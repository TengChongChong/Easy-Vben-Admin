// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import type { AxiosResponse } from 'axios';
import { clone } from 'lodash-es';
import type { ErrorMessageMode, RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus, sessionInvalid } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage, IconType } from '/@/hooks/web/useMessage';
import { RequestEnum, ContentTypeEnum, ShowTypeEnum, ErrorCodeEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getToken } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { AxiosRetry } from '/@/utils/http/axios/axiosRetry';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * 请求之前处理config
   *
   * @param config config
   * @param options options
   * @returns config
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * 请求拦截器处理
   *
   * @param config config
   * @param options options
   * @returns config
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 请求成功
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取success，data等信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const responseData = res.data;
    if (!responseData) {
      throw new Error(t('sys.api.apiRequestFailed'));
    }
    // 后端响应信息
    const { success, data, errorCode, errorMessage } = responseData;

    // 是否有错误信息
    if (!success || errorCode || errorMessage) {
      throw new Error(
        `Http状态码为成功时禁止返回错误信息success: ${success} / errorCode: ${errorCode} / errorMessage: ${errorMessage}，请调整Http状态码`,
      );
    }

    // 请求成功，仅返回data
    return data;
  },

  /**
   * 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosResponse, error: any) => {
    const { t } = useI18n();

    // ! 默认使用 Ant Design Vue 的 Message 全局提示 组件进行错误提示，如需修改请调整`defaultErrorMessageMode`默认值
    const defaultErrorMessageMode: ErrorMessageMode = 'message';

    // 如果使用全局错误捕获，将错误信息缓存
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);

    const { response, code, message, config } = error || {};
    let errorMessageMode = config?.requestOptions?.errorMessageMode || defaultErrorMessageMode;
    const responseData: Result = response?.data;
    let errMessage = '';
    let errorShowType: IconType = 'error';

    if (responseData && errorMessageMode === 'none') {
      // 前端要求静默
      return Promise.reject(error);
    }

    if (responseData) {
      // 后端业务有响应数据
      const { showType, errorMessage, errorCode } = responseData;
      switch (showType) {
        case ShowTypeEnum.SHOW_TYPE_INFO:
          errorShowType = 'info';
          break;
        case ShowTypeEnum.SHOW_TYPE_WARNING:
          errorShowType = 'warning';
          break;
        case ShowTypeEnum.SHOW_TYPE_ERROR:
          errorShowType = 'error';
          break;
      }

      // 错误提示内容
      if (errorMessage) {
        errMessage = errorMessage;
      }

      if (ErrorCodeEnum.SESSION_INVALID_CODE === errorCode) {
        // 会话失效
        sessionInvalid(errMessage);
      }
    }

    if (!errMessage) {
      // 后端业务未返回错误信息
      const err: string = error?.toString?.() ?? '';
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }

      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }
    }

    if (errMessage) {
      if (!responseData && errorMessageMode === 'none') {
        //  后端未响应，可能后端服务故障或客户端网络断开，使用默认提示
        errorMessageMode = defaultErrorMessageMode;
      }

      // 提示错误
      if (errorMessageMode === 'modal') {
        createModal(
          {
            title: t('sys.api.errorTip'),
            content: errMessage,
          },
          errorShowType,
        );
      } else if (errorMessageMode === 'message') {
        createMessage[errorShowType](errMessage);
      }
      return Promise.reject(error);
    }

    // 如果上面的错误处理都没有命中，根据Http状态码提示错误信息
    checkStatus(error?.response?.status, errMessage, config?.requestOptions);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: false,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
