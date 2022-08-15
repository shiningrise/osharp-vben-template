<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/auth/EntityInfo.vue" company="LiuliuSoft">
    OSHARP.ORG@2021
 </copyright>
 <site>https://www.osharp.org</site>
 <last-editor>郭明锋</last-editor> -->

<template>
  <div>
    <AdminTable v-bind="tableProps" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { AdminTable, AdminTableProps } from '/@/components/Osharp';
  import { ActionItem, BasicColumn, BasicTableProps, FormSchema, FormProps } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, FilterOperate, transTagToOptions } from '/@/utils/osharp';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Auth',
    moduleDisplay: '权限授权',
    entityName: 'EntityInfo',
    entityDisplay: '实体',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();

  const columns: BasicColumn[] = [
    { title: '实体名称', dataIndex: 'name', align: 'left', sorter: true, width: 150 },
    { title: '实体类型名称', dataIndex: 'typeName', align: 'left', sorter: true, width: 150 },
    { title: '是否数据审计', dataIndex: 'auditEnabled', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
  ];

  const editSchemas: FormSchema[] = [
    { label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' },
    { label: '是否数据审计', field: 'auditEnabled', component: 'Switch', colProps: { span: 12 } },
  ];

  const filterSchemas: FormSchema[] = [
    { label: '实体名称', field: 'name', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '实体类型名称', field: 'typeName', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '是否数据审计', field: 'auditEnabled', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
  ];

  const tableProps: AdminTableProps = {
    module: module,
    tablePropsFn: tablePropsFn,
    tableActionsFn: tableActionsFn,
    tableDropDownActionsFn: tableDropDownActionsFn,
    filterFormPropsFn: filterFormPropsFn,
    editFormPropsFn: editFormPropsFn,
    editModalFn: (m, r) => m.setModalProps({ title: `更新${module.entityDisplay} - ${r.name}` }),
  };

  function tablePropsFn(p: BasicTableProps): BasicTableProps {
    p.title = `${module.entityDisplay}管理`;
    p.columns = columns;
    p.useSearchForm = true;
    p.showIndexColumn = true;
    p.rowSelection = undefined;
    return p;
  }

  function tableActionsFn(items: ActionItem[], record: Recordable) {
    return items;
  }

  function tableDropDownActionsFn(items: ActionItem[], record: Recordable) {
    return items;
  }

  function filterFormPropsFn(p: FormProps): FormProps {
    p.schemas = filterSchemas;
    return p;
  }
  function editFormPropsFn(p: FormProps): FormProps {
    p.schemas = editSchemas;
    return p;
  }
</script>
