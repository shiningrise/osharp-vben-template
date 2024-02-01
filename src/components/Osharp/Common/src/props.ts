import { FilterGroup } from '/@/utils/osharp';

export const filterGroupVProps = {
  group: { type: Object as PropType<FilterGroup>, required: true },
  entityType: { type: String, required: true },
};
