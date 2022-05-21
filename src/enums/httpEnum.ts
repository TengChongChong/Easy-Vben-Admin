/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = 'success',
}
/**
 * 系统级错误码
 */
export enum ErrorCodeEnum {
  // 会话失效
  SESSION_INVALID_CODE = '00401-1',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * 后端消息提示方式
 */
export enum ShowTypeEnum {
  /**
   * 通知提醒框 - info
   */
  SHOW_TYPE_INFO = 1,
  /**
   * 通知提醒框 - warning
   */
  SHOW_TYPE_WARNING = 2,
  /**
   * 通知提醒框 - error
   */
  SHOW_TYPE_ERROR = 3,
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
