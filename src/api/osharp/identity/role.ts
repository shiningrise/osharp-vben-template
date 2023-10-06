import { defHttp } from '/@/utils/http/axios';
import { Result } from '/#/axios';

export async function readRoleNodeApi() {
  const url = `/admin/role/readNode`;
  const result = await defHttp.get<Result>({ url: url });
  const nodes = result.data;
  return nodes;
}
