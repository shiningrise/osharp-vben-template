import { Result } from "#/axios"
import { defHttp } from "@/utils/http/axios"

export async function updateRoleEntityApi(dtos:Recordable[]){
  const url = '/admin/roleentity/update'
  console.log('updateRoleEntityApi', dtos);
  const result = await defHttp.post<Result>({ url: url, data: dtos });
  return result;
}