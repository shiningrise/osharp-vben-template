<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/auth/Function.vue" company="LiuliuSoft">
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
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, FilterOperate, transTagToOptions, accessTypeTags } from '/@/utils/osharp';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Auth',
    moduleDisplay: '权限授权',
    entityName: 'Function',
    entityDisplay: '功能',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();

  const columns: BasicColumn[] = [
    { title: '名称', dataIndex: 'name', align: 'left', sorter: true, width: 250 },
    { title: '区域', dataIndex: 'area', align: 'left', sorter: true, width: 100 },
    { title: '控制器', dataIndex: 'controller', align: 'left', sorter: true, width: 100 },
    { title: '功能', dataIndex: 'action', align: 'left', sorter: true, width: 150 },
    { title: '是否控制器', dataIndex: 'isController', sorter: true, width: 150, customRender: ({ text }) => CheckboxRender(text) },
    { title: '是否Ajax', dataIndex: 'isAjax', sorter: true, width: 100, defaultHidden: true, customRender: ({ text }) => CheckboxRender(text) },
    { title: '访问类型', dataIndex: 'accessType', sorter: true, width: 100, customRender: ({ text }) => TagRender(text, accessTypeTags) },
    { title: '操作审计', dataIndex: 'auditOperationEnabled', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '数据审计', dataIndex: 'auditEntityEnabled', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '缓存秒数', dataIndex: 'cacheExpirationSeconds', sorter: true, width: 100 },
    { title: '相对过期', dataIndex: 'isCacheSliding', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '是否从库', dataIndex: 'isSlaveDatabase', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '是否锁定', dataIndex: 'isLocked', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
  ];

  const editSchemas: FormSchema[] = [
    { label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' },
    { label: '访问类型', field: 'accessType', component: 'Select', componentProps: { options: transTagToOptions(accessTypeTags) }, colProps: { span: 12 } },
    { label: '操作审计', field: 'auditOperationEnabled', component: 'Switch', colProps: { span: 12 } },
    { label: '数据审计', field: 'auditEntityEnabled', component: 'Switch', colProps: { span: 12 } },
    { label: '缓存秒数', field: 'cacheExpirationSeconds', component: 'InputNumber', colProps: { span: 12 } },
    { label: '相对过期', field: 'isCacheSliding', component: 'Switch', colProps: { span: 12 } },
    { label: '是否从库', field: 'isSlaveDatabase', component: 'Switch', colProps: { span: 12 } },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', colProps: { span: 12 } },
  ];

  const filterSchemas: FormSchema[] = [
    { label: '名称', field: 'name', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '区域', field: 'area', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '控制器', field: 'controller', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '功能', field: 'action', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '是否控制器', field: 'isController', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '是否Ajax', field: 'isAjax', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    {
      label: '访问类型',
      field: 'accessType',
      component: 'Select',
      componentProps: { operate: FilterOperate.Equal, options: transTagToOptions(accessTypeTags) },
      colProps: { span: 8 },
    },
    { label: '操作审计', field: 'auditOperationEnabled', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '数据审计', field: 'auditEntityEnabled', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '缓存秒数', field: 'cacheExpirationSeconds', component: 'InputNumber', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '相对过期', field: 'isCacheSliding', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '是否从库', field: 'isSlaveDatabase', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
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
