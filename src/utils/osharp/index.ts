import { FilterGroup, FilterOperate, FilterOperateEntry } from './types';

export * from './types';
export * from './utils';

export const defFilterGroup: FilterGroup = {
  rules: [],
  groups: [],
  operate: FilterOperate.And,
  level: 1
};

export const defGroupOperateEntries: any[] = [
  { value: FilterOperate.And, label: "并且" },
  { value: FilterOperate.Or, label: "或者" }
];
