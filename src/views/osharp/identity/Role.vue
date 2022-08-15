<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/identity/Role.vue" company="LiuliuSoft">
    OSHARP.ORG@2021
 </copyright>
 <site>https://www.osharp.org</site>
 <last-editor>郭明锋</last-editor> -->

<template>
  <div>
    <AdminTable v-bind="tableProps" />
    <AdminFunctionViewDrawer @register="registerFunctionViewDrawer" v-bind="functionViewProps" width="800" />
    <AdminEditModal @register="registerSetModulesModel" :module="module" :edit-form-props-fn="setModulesFormFn" @on-close="tableMethods.reload()" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { ActionItem, BasicColumn, BasicTableProps, FormSchema, FormProps, useTable } from '/@/components/Table';
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, transTagToOptions, FilterOperate } from '/@/utils/osharp';
  import { AdminTable, AdminTableProps, AdminFunctionViewDrawer, AdminFunctionViewDrawerProps, AdminEditModal } from '/@/components/Osharp';
  import { defHttp } from '/@/utils/http/axios';
  import { Result } from '/#/axios';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Identity',
    moduleDisplay: '身份认证',
    entityName: 'Role',
    entityDisplay: '角色',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();
  const [registerTable, tableMethods] = useTable();

  const columns: BasicColumn[] = [
    { title: '编号', dataIndex: 'id', width: 50 },
    { title: '名称', dataIndex: 'name', align: 'left', sorter: true, width: 150 },
    { title: '备注', dataIndex: 'remark', align: 'left', sorter: true, width: 150 },
    { title: '是否管理', dataIndex: 'isAdmin', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '是否默认', dataIndex: 'isDefault', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '是否锁定', dataIndex: 'isLocked', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '创建时间', dataIndex: 'createdTime', sorter: true, width: 130, format: 'date|YYYY/MM/DD HH:mm' },
  ];

  const editSchemas: FormSchema[] = [
    { label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' },
    { label: '名称', field: 'name', component: 'Input' },
    { label: '备注', field: 'remark', component: 'Input' },
    { label: '是否管理', field: 'isAdmin', component: 'Switch', colProps: { span: 12 } },
    { label: '是否默认', field: 'isDefault', component: 'Switch', colProps: { span: 12 } },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', colProps: { span: 12 } },
  ];

  const filterSchemas: FormSchema[] = [
    { label: '名称', field: 'name', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '备注', field: 'remark', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '是否管理', field: 'isAdmin', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', colProps: { span: 8 } },
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
    return p;
  }

  function tableActionsFn(items: ActionItem[], record: Recordable) {
    items[1].ifShow = () => record.deletable && !record.isSystem;
    return items;
  }

  function tableDropDownActionsFn(items: ActionItem[], record: Recordable) {
    items.push(
      { icon: 'ant-design:safety-certificate-outlined', label: '设置权限', auth: `${authPath}.SetModules`, onClick: setModules.bind(null, record) },
      {
        icon: 'ant-design:security-scan-outlined',
        label: '查看功能',
        auth: 'Root.Admin.Auth.RoleFunction.ReadFunctions',
        onClick: readFunctions.bind(null, record),
      },
    );
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

  // #region 设置权限

  const [registerSetModulesModel, setModulesModalMethods] = useModal();

  async function setModules(record: Recordable) {
    setModulesModalMethods.setModalProps({ title: `设置角色的权限 - ${record.id}.${record.name}` });
    const result = await defHttp.get<Result>({ url: `/admin/module/readRoleModules?roleId=${record.id}` });
    const nodes: any[] = result.data;
    console.log(result);
  }

  function setModulesFormFn(p: FormProps): FormProps {
    p.schemas = [{ label: '编号', field: 'roleId', component: 'Input', dynamicDisabled: true }];
    return p;
  }

  // #endregion

  // #region 查看功能

  const [registerFunctionViewDrawer, functionViewMethods] = useDrawer();

  const functionViewProps: AdminFunctionViewDrawerProps = {
    module: { ...module, moduleName: 'RoleFunction', moduleDisplay: '角色功能', entityName: 'Function', entityDisplay: '功能' },
  };

  function readFunctions(record: Recordable) {
    functionViewMethods.setDrawerProps({ title: `查看角色功能 - ${record.name}` });
    functionViewMethods.openDrawer(true, record);
  }

  // #endregion
</script>
