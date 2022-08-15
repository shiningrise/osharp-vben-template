import { FilterGroup, FilterOperate } from './types';

export * from './types';
export * from './utils';

export const defFilterGroup: FilterGroup = {
  rules: [],
  groups: [],
  operate: FilterOperate.And,
};
