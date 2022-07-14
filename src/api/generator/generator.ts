import { defHttp } from '/@/utils/http/axios';
import { SelectModel } from '/@/api/model/selectModel';
import { TableInfo } from '/@/api/generator/model/generatorModel';
import { GeneratorConfig } from '/@/views/generator/ts/generator.data';

// base url
const BASE_URL = '/api/auth/generator';

/**
 * 获取表
 */
export function selectTable(params) {
  return defHttp.get<SelectModel[]>({
    url: `${BASE_URL}/table`,
    params,
  });
}

/**
 * 获取表详情
 *
 * @param dataSource 数据源
 * @param tableName 表名
 */
export function getTableInfo(dataSource: string, tableName: string) {
  return defHttp.get<TableInfo>({
    url: `${BASE_URL}/table/info`,
    params: {
      dataSource,
      tableName,
    },
  });
}

/**
 * 查询项目中模块
 */
export function selectModules() {
  return defHttp.get<SelectModel[]>({
    url: `${BASE_URL}/modules`,
  });
}

/**
 * 生成代码
 *
 * @param generatorConfig 生成配置
 */
export function generate(generatorConfig: GeneratorConfig) {
  return defHttp.post<boolean>({
    url: BASE_URL,
    data: generatorConfig,
  });
}
