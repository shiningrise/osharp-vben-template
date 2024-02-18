import { defHttp } from '/@/utils/http/axios';
import { Result } from '/#/axios';

export async function readEntityinfoNodeApi() {
  const url = `/admin/entityInfo/readNode`;
  const result = await defHttp.get<Result>({ url: url });
  const nodes = result.data;
  return nodes;
}

export async function readEntityPropertiesApi(typeName: string){
  const url = `/admin/entityinfo/readproperties`;
  const result = await defHttp.get<Result>({url: url, params: {typeName: typeName}});
  const nodes = result.data;
  return nodes;
}
