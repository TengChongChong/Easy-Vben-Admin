// 错误提示类型
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

/**
 * @description 请求选项
 */
export interface RequestOptions {
  // 将请求参数拼接到url
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string;
  // 请求拼接路径
  urlPrefix?: string;
  // 错误提示类型
  errorMessageMode?: ErrorMessageMode;
  // Whether to add a timestamp
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
}

/**
 * @description 请求重试
 */
export interface RetryRequest {
  isOpenRetry: boolean;
  count: number;
  waitTime: number;
}
/**
 * @description 服务端响应
 */
export interface Result<T = any> {
  // 请求是否成功
  success: boolean;
  // 响应数据
  data?: T;
  // 错误码
  errorCode?: string;
  // 错误提示，用于显示给用户
  errorMessage?: string;
  // 错误显示方式
  showType?: number;
  // 唯一请求Id，方便后端排查故障
  traceId?: string;
  // 当前访问服务节点，方便后端排查故障
  host?: string;
}

/**
 * @description 文件上传参数
 */
export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // 文件名
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
