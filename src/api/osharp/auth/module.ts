import { defHttp } from '/@/utils/http/axios';
import { Result } from '/#/axios';

export async function readRoleModulesApi(params: any) {
  if (!params || !params.roleId) {
    return undefined;
  }
  const url = `/admin/module/readRoleModules?roleId=${params.roleId}`;
  const result = await defHttp.get<Result>({ url: url });
  const treeData: any[] = result.data;
  return treeData;
}
