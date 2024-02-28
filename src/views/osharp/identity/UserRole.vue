<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/identity/UserRole.vue" company="LiuliuSoft">
    OSHARP.ORG@2021
 </copyright>
 <site>https://www.osharp.org</site>
 <last-editor>郭明锋</last-editor> -->

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
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, FilterOperate, transTagToOptions } from '/@/utils/osharp';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Identity',
    moduleDisplay: '身份认证',
    entityName: 'UserRole',
    entityDisplay: '用户角色',
    entityFullName: 'OSharp.Hosting.Identity.Entities.UserRole,OSharp.Hosting.Core'
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();

  const columns: BasicColumn[] = [
    { title: '编号', dataIndex: 'id', width: 50 },
    { title: '用户', dataIndex: 'userName', width: 200 },
    { title: '角色', dataIndex: 'roleName', width: 200 },
    { title: '是否锁定', dataIndex: 'isLocked', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
  ];

  const editSchemas: FormSchema[] = [
    { label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' },
    { label: '用户', field: 'userId', component: 'Input', show: false },
    { label: '角色', field: 'roleId', component: 'Input', show: false },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', colProps: { span: 12 } },
  ];

  const filterSchemas: FormSchema[] = [
    { field: 'userName', label: '用户', valueField: 'User.UserName', component: 'Input', colProps: { span: 8 } },
    { field: 'roleName', label: '角色', valueField: 'Role.Name', component: 'Input', colProps: { span: 8 } },
  ];

  const adminTableProps: AdminTableProps = {
    module: module,
    tablePropsFn: tablePropsFn,
    tableActionsFn: tableActionsFn,
    tableDropDownActionsFn: tableDropDownActionsFn,
    filterFormPropsFn: filterFormPropsFn,
    editFormPropsFn: editFormPropsFn,
    editModalFn: (m, r) => m.setModalProps({ title: `更新${module.entityDisplay} - ${r.userName}[${r.roleName}]` }),
  };

  function tablePropsFn(p: BasicTableProps): BasicTableProps {
    p.title = `${module.entityDisplay}管理`;
    p.columns = columns;
    p.useSearchForm = true;
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
