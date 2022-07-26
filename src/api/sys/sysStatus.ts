import { defHttp } from '/@/utils/http/axios';
import {
  JvmSpecInfo,
  JvmInfo,
  JavaSpecInfo,
  JavaInfo,
  JavaRuntimeInfo,
  OsInfo,
  UserInfo,
  HostInfo,
  RuntimeInfo,
} from '/@/api/sys/model/sysStatusModel';

// base url
const BASE_URL = '/api/auth/sys/status';

/**
 * Java Virtual Machine Specification信息
 *
 * @return JvmSpecInfo
 */
export function getJvmSpecInfo() {
  return defHttp.get<JvmSpecInfo>({
    url: `${BASE_URL}/jvm/spec/info`,
  });
}

/**
 * Java Virtual Machine Implementation信息
 *
 * @return JvmInfo
 */
export function getJvmInfo() {
  return defHttp.get<JvmInfo>({
    url: `${BASE_URL}/jvm/info`,
  });
}

/**
 * Java Specification信息
 *
 * @return JavaSpecInfo
 */
export function getJavaSpecInfo() {
  return defHttp.get<JavaSpecInfo>({
    url: `${BASE_URL}/java/spec/info`,
  });
}

/**
 * Java Implementation信息
 *
 * @return JavaInfo
 */
export function getJavaInfo() {
  return defHttp.get<JavaInfo>({
    url: `${BASE_URL}/java/info`,
  });
}

/**
 * Java运行时信息
 *
 * @return JavaRuntimeInfo
 */
export function getJavaRuntimeInfo() {
  return defHttp.get<JavaRuntimeInfo>({
    url: `${BASE_URL}/java/runtime/info`,
  });
}

/**
 * 系统信息
 *
 * @return OsInfo
 */
export function getOsInfo() {
  return defHttp.get<OsInfo>({
    url: `${BASE_URL}/os/info`,
  });
}

/**
 * 用户信息
 *
 * @return UserInfo
 */
export function getUserInfo() {
  return defHttp.get<UserInfo>({
    url: `${BASE_URL}/user/info`,
  });
}

/**
 * 当前主机网络地址信息
 *
 * @return HostInfo
 */
export function getHostInfo() {
  return defHttp.get<HostInfo>({
    url: `${BASE_URL}/host/info`,
  });
}

/**
 * 运行时信息，包括内存总大小、已用大小、可用大小等
 *
 * @return RuntimeInfo
 */
export function getRuntimeInfo() {
  return defHttp.get<RuntimeInfo>({
    url: `${BASE_URL}/runtime/info`,
  });
}
