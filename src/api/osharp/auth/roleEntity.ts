import { Result } from "#/axios"
import { defHttp } from "@/utils/http/axios"
import { FilterGroup } from "@/utils/osharp";

export async function setRoleEntityFilterGroupApi(id: any, group: FilterGroup) {
  const url = `/admin/roleentity/setfiltergroup?id=${id}`;
  const result = await defHttp.post<Result>({ url: url, data: group });
  return result;
}