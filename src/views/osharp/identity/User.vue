<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/identity/User.vue" company="LiuliuSoft">
    OSHARP.ORG@2021
 </copyright>
 <site>https://www.osharp.org</site>
 <last-editor>郭明锋</last-editor> -->

<template>
  <div>
    <AdminTable @register="registerTable" v-bind="tableProps" />
    <AdminFunctionViewDrawer @register="registerFunctionViewDrawer" v-bind="functionViewProps" width="800" />
    <AdminEditModal
      @register="registerSetRolesModal"
      :module="module"
      :edit-form-props-fn="setRolesFormFn"
      :transport-submit-data="transportSetRoleData"
      @on-close="tableMethods.reload()"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Empty, CheckboxGroup } from 'ant-design-vue';
  import { computed, h } from 'vue';
  import { Result } from '/#/axios';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { AdminTable, AdminTableProps, AdminFunctionViewDrawer, AdminFunctionViewDrawerProps, AdminEditModal, AdminEditModalProps } from '/@/components/Osharp';
  import { ActionItem, BasicColumn, BasicTableProps, FormSchema, FormProps, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, transTagToOptions, EditModalDataWrap, FilterOperate } from '/@/utils/osharp';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Identity',
    moduleDisplay: '身份认证',
    entityName: 'User',
    entityDisplay: '用户',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();
  const [registerTable, tableMethods] = useTable();

  const columns: BasicColumn[] = [
    { title: '编号', dataIndex: 'id', width: 50 },
    { title: '用户名', dataIndex: 'userName', align: 'left', sorter: true, width: 150 },
    { title: '用户昵称', dataIndex: 'nickName', align: 'left', sorter: true, width: 150 },
    { title: '邮箱', dataIndex: 'email', align: 'left', sorter: true, width: 150 },
    { title: '邮箱确认', dataIndex: 'emailConfirmed', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '手机号', dataIndex: 'phoneNumber', align: 'left', sorter: true, width: 150 },
    { title: '手机号确认', dataIndex: 'phoneNumberConfirmed', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '用户头像', dataIndex: 'headImg', align: 'left', width: 150 },
    { title: '锁定时间', dataIndex: 'lockoutEnd', sorter: true, width: 150, defaultHidden: true },
    { title: '是否登录锁', dataIndex: 'lockoutEnabled', sorter: true, width: 100, defaultHidden: true, customRender: ({ text }) => CheckboxRender(text) },
    { title: '登录失败次数', dataIndex: 'accessFailedCount', sorter: true, width: 100, defaultHidden: true },
    { title: '是否锁定', dataIndex: 'isLocked', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
    { title: '创建时间', dataIndex: 'createdTime', sorter: true, width: 130, format: 'date|YYYY/MM/DD HH:mm' },
  ];

  const editSchemas: FormSchema[] = [
    { label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' },
    { label: '用户名', field: 'userName', component: 'Input' },
    { label: '用户昵称', field: 'nickName', component: 'Input' },
    { label: '邮箱', field: 'email', component: 'Input' },
    { label: '邮箱确认', field: 'emailConfirmed', component: 'Switch', colProps: { span: 12 } },
    { label: '手机号', field: 'phoneNumber', component: 'Input' },
    { label: '手机号确认', field: 'phoneNumberConfirmed', component: 'Switch', colProps: { span: 12 } },
    { label: '用户头像', field: 'headImg', component: 'Input' },
    { label: '是否登录锁', field: 'lockoutEnabled', component: 'Switch', colProps: { span: 12 } },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', colProps: { span: 12 } },
  ];

  const filterSchemas: FormSchema[] = [
    { label: '用户名', field: 'userName', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '邮箱', field: 'email', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '邮箱确认', field: 'emailConfirmed', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '手机号', field: 'phoneNumber', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '手机号确认', field: 'phoneNumberConfirmed', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '锁定时间', field: 'lockoutEnd', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '是否登录锁', field: 'lockoutEnabled', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '登录失败次数', field: 'accessFailedCount', component: 'InputNumber', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '是否锁定', field: 'isLocked', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
    { label: '创建时间', field: 'createdTime', component: 'DatePicker', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
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
    items[1].ifShow = () => record.deletable && record.id != 1;
    return items;
  }

  function tableDropDownActionsFn(items: ActionItem[], record: Recordable) {
    items.push(
      { icon: 'ant-design:usergroup-add-outlined', label: '设置角色', auth: `${authPath}.SetRoles`, onClick: setRoles.bind(null, record) },
      { icon: 'ant-design:safety-certificate-outlined', label: '设置权限', auth: `${authPath}.SetModules`, onClick: setModules.bind(null, record) },
      {
        icon: 'ant-design:security-scan-outlined',
        label: '查看功能',
        auth: 'Root.Admin.Auth.UserFunction.ReadFunctions',
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

  // #region FunctionViewDrawer

  const functionViewProps: AdminFunctionViewDrawerProps = {
    module: { ...module, moduleName: 'UserFunction', moduleDisplay: '用户功能', entityName: 'Function', entityDisplay: '功能' },
  };

  const [registerFunctionViewDrawer, functionViewMethods] = useDrawer();

  function readFunctions(record: Recordable) {
    functionViewMethods.setDrawerProps({ title: `查看用户功能 - ${record.nickName}[${record.userName}]` });
    functionViewMethods.openDrawer(true, record);
  }
  // #endregion

  // #region SetRoles

  const [registerSetRolesModal, setRolesModalMethods] = useModal();

  async function setRoles(record: Recordable) {
    setRolesModalMethods.setModalProps({ title: `设置用户的角色 - ${record.nickName}[${record.userName}]` });
    const result = await defHttp.get<Result>({ url: `/admin/role/readuserroles?userId=${record.id}` });
    const nodes: any[] = result.data;
    const checkeds = nodes.filter((m) => m.isChecked === true).map((m) => m.id);
    const options = nodes.map((m) => ({ value: m.id, label: m.name }));
    const data: Recordable = {
      userId: record.id,
      roleIds: [],
      roleNodes: { options, checkeds },
    };
    const url = `/admin/user/setroles`;
    setRolesModalMethods.openModal<EditModalDataWrap>(true, { submitUrl: url, record: data });
  }

  function setRolesFormFn(p: FormProps): FormProps {
    p.schemas = [
      { label: '编号', field: 'userId', component: 'Input', dynamicDisabled: true },
      {
        label: '角色',
        field: 'roleIds',
        component: 'CheckboxGroup',
        render: ({ model, field }) => {
          const data = model.roleNodes;
          if (!data) {
            return h(Empty, { description: '没有角色选项' });
          }
          return h(CheckboxGroup, {
            options: data?.options,
            defaultValue: data?.checkeds,
            onChange: (e: ChangeEvent) => {
              model[field] = e;
            },
          });
        },
      },
      { label: '', field: 'roleNodes', component: 'Input', show: false },
    ];
    return p;
  }

  function transportSetRoleData(p: Recordable): Recordable {
    delete p.roleNodes;
    return p;
  }

  // #endregion

  // #region SetModules

  function setModules(record: Recordable) {
    createMessage.info(`设置用户功能：${record.userName}`);
  }

  // #endregion
</script>
