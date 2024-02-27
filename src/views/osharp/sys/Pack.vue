<template>
  <div>
    <AdminTable v-bind="adminTableProps" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { AdminTable, AdminTableProps } from '/@/components/Osharp';
import { ActionItem, BasicColumn, BasicTableProps, FormSchema, FormProps } from '/@/components/Table';
import { useMessage } from '/@/hooks/web/useMessage';
import { ModuleInfo, defaultModuleInfo, packLevelTags, TagRender, CheckboxRender, FilterOperate, transTagToOptions } from "/@/utils/osharp";


const module: ModuleInfo = {
  ...defaultModuleInfo,
  moduleName: 'Systems',
  moduleDisplay: '系统管理',
  entityName: 'Pack',
  entityDisplay: '模块包'
};
const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
const { createMessage } = useMessage();

const columns: BasicColumn[] = [
  { title: '名称', dataIndex: 'display', align: 'left', sorter: true, width: 150 },
  { title: '类型', dataIndex: 'class', align: 'left', sorter: true, width: 200 },
  { title: '级别', dataIndex: 'level', sorter: true, width: 100, customRender: ({ text }) => TagRender(text, packLevelTags) },
  { title: '启动顺序', dataIndex: 'order', align: 'left', sorter: true, width: 60 },
  { title: '是否可用', dataIndex: 'isEnabled', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
];

const filterSchemas: FormSchema[] = [
  { label: '名称', field: 'display', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 8 } },
  {
    label: '级别',
    field: 'level',
    component: 'Select',
    componentProps: { operate: FilterOperate.Equal, options: transTagToOptions(packLevelTags) },
    colProps: { span: 4 },
  },
  { label: '是否启用', field: 'isEnabled', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 4 } },

];

const adminTableProps: AdminTableProps = {
  module: module,
  tablePropsFn: tablePropsFn,
  filterFormPropsFn: filterFormPropsFn,
};

function tablePropsFn(p: BasicTableProps): BasicTableProps {
  p.title = `${module.entityDisplay}管理`;
  p.columns = columns;
  p.useSearchForm = true;
  p.showIndexColumn = true;
  p.rowSelection = undefined;
  return p;
}

function filterFormPropsFn(p: FormProps): FormProps {
  p.schemas = filterSchemas;
  return p;
}
</script>