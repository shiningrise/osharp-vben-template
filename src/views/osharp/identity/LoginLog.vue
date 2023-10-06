<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/identity/LoginLog.vue" company="LiuliuSoft">
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
    entityName: 'LoginLog',
    entityDisplay: '登录日志',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();

  const columns: BasicColumn[] = [
    { title: '用户名', dataIndex: 'userName', sorter: true, width: 150 },
    { title: '用户昵称', dataIndex: 'nickName', sorter: true, width: 150 },
    { title: '登录IP', dataIndex: 'ip', align: 'left', sorter: true, width: 100 },
    { title: '用户代理头', dataIndex: 'userAgent', align: 'left', width: 450 },
    { title: '创建时间', dataIndex: 'createdTime', sorter: true, width: 130, format: 'date|YYYY/MM/DD HH:mm' },
    { title: '退出时间', dataIndex: 'logoutTime', sorter: true, width: 130, format: 'date|YYYY/MM/DD HH:mm' },
  ];

  const filterSchemas: FormSchema[] = [
    { label: '用户名', field: 'userName', valueField: 'User.UserName', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 8 } },
    { label: '昵称', field: 'nickName', valueField: 'User.NickName', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 8 } },
    { label: '登录IP', field: 'ip', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 8 } },
  ];

  const adminTableProps: AdminTableProps = {
    module: module,
    tablePropsFn: tablePropsFn,
    tableActionsFn: tableActionsFn,
    tableDropDownActionsFn: tableDropDownActionsFn,
    filterFormPropsFn: filterFormPropsFn,
  };

  function tablePropsFn(p: BasicTableProps): BasicTableProps {
    p.title = `${module.entityDisplay}管理`;
    p.columns = columns;
    p.useSearchForm = true;
    p.showIndexColumn = true;
    return p;
  }

  function tableActionsFn(items: ActionItem[], record: Recordable) {
    items[1].ifShow = () => true;
    return items;
  }

  function tableDropDownActionsFn(items: ActionItem[], record: Recordable) {
    return items;
  }

  function filterFormPropsFn(p: FormProps): FormProps {
    p.schemas = filterSchemas;
    return p;
  }
</script>
