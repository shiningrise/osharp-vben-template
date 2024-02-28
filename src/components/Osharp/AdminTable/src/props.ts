import { FilterGroup } from '@/utils/osharp';
import { PropType } from 'vue';
import { FilterGroup } from '@/utils/osharp';
import { FilterGroup, PageData } from './../../../../utils/osharp/types';
import { ModuleInfo } from '/@/utils/osharp';
import { ActionItem, BasicTableProps, EditRecordRow, FormProps } from '/@/components/Table';
import { ModalMethods } from '/@/components/Modal';

export const adminTableProps = {
  /** 模块信息 */
  module: {
    type: Object as PropType<ModuleInfo>,
    required: true,
  },
  /** BasicTableProps 的转换函数，用于按需转换默认的Props配置 */
  tablePropsFn: {
    type: Function as PropType<(p: BasicTableProps) => BasicTableProps>,
    default: (p: BasicTableProps) => p,
  },
  /** TableActions的转换函数，用于转换行操作入口配置 */
  tableActionsFn: {
    type: Function as PropType<(items: ActionItem[], record: EditRecordRow) => ActionItem[]>,
  },
  /** TableAction的下拉配置转换，用于转换行操作的下拉操作入口配置 */
  tableDropDownActionsFn: {
    type: Function as PropType<(items: ActionItem[], record: EditRecordRow) => ActionItem[]>,
  },
  /** 查询表单属性转换函数 */
  filterFormPropsFn: {
    type: Function as PropType<(p: FormProps) => FormProps>,
  },
  /** 编辑表单属性转换函数 */
  editFormPropsFn: {
    type: Function as PropType<(p: FormProps) => FormProps>,
  },
  editModalFn: {
    type: Function as PropType<(m: ModalMethods, record: Recordable) => void>,
  },
  tableDataFn: {
    type: Function as PropType<(data: PageData<any>) => PageData<any>>,
  },
  /** 是否显示展开按钮 */
  showExpand: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

export const adminEditModalProps = {
  /** 模块信息 */
  module: {
    type: Object as PropType<ModuleInfo>,
    required: true,
  },
  /** 编辑表单属性转换函数 */
  editFormPropsFn: {
    type: Function as PropType<(p: FormProps) => FormProps>,
  },
  transportSubmitData: {
    type: Function as PropType<(p: Recordable) => Recordable>,
  },
};

export const adminFunctionViewDrawerProps = {
  module: {
    type: Object as PropType<ModuleInfo>,
    required: true,
  },
  tableProps: {
    type: Object as PropType<BasicTableProps>,
  },
};

export const adminSearchDrawerProps = {
  record: {
    type: Object as PropType<Recordable>,
    required: false,
  },
  module: {
    type: Object as PropType<ModuleInfo>,
    required: true,
  },
  group: {
    type: Object as PropType<FilterGroup>,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  }
};

export const adminSearchModalProps = {
  /** 模块信息 */
  module: {
    type: Object as PropType<ModuleInfo>,
    required: true,
  },
  /** 过滤条件组 */
  group: {
    type: Object as PropType<FilterGroup>,
    required: true,
  },
  /** 实体类型 */
  entity: {
    type: String,
    required: true,
  },
  /** 转换提交的数据 */
  transportSubmitData: {
    type: Function as PropType<(p: Recordable) => Recordable>,
  },
};
