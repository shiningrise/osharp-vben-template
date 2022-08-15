<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/auth/Module.vue" company="LiuliuSoft">
    OSHARP.ORG@2021
 </copyright>
 <site>https://www.osharp.org</site>
 <last-editor>郭明锋</last-editor> -->

<template>
  <div>
    <AdminTable @register="registerTable" v-bind="tableProps">
      <template #appandToolbar>
        <a-button type="primary" @click="expandOrCollapseAll">展开/收缩</a-button>
      </template>
    </AdminTable>
    <AdminFunctionViewDrawer @register="registerFunctionViewDrawer" v-bind="functionViewProps" width="800" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { ActionItem, BasicColumn, BasicTableProps, FormSchema, FormProps, useTable } from '/@/components/Table';
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, FilterOperate, transTagToOptions } from '/@/utils/osharp';
  import { AdminFunctionViewDrawer, AdminFunctionViewDrawerProps, AdminTable, AdminTableProps } from '/@/components/Osharp';
  import arrayToTree from 'array-to-tree';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Auth',
    moduleDisplay: '权限授权',
    entityName: 'Module',
    entityDisplay: '模块',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();
  const [registerTable, tableMethods] = useTable();
  const isExpanded = ref(false);

  const columns: BasicColumn[] = [
    { title: '编号', dataIndex: 'id', width: 200, align: 'left' },
    { title: '模块名称', dataIndex: 'name', align: 'left', width: 150 },
    { title: '模块描述', dataIndex: 'remark', align: 'left', width: 150 },
    { title: '模块代码', dataIndex: 'code', align: 'left', width: 150 },
    { title: '排序码', dataIndex: 'orderCode', width: 150 },
  ];

  const filterSchemas: FormSchema[] = [
    { label: '模块名称', field: 'name', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
    { label: '模块代码', field: 'code', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
  ];

  const tableProps: AdminTableProps = {
    module: module,
    tablePropsFn: tablePropsFn,
    tableActionsFn: tableActionsFn,
    tableDropDownActionsFn: tableDropDownActionsFn,
    filterFormPropsFn: filterFormPropsFn,
  };

  function tablePropsFn(p: BasicTableProps): BasicTableProps {
    p.title = `${module.entityDisplay}管理`;
    p.columns = columns;
    p.useSearchForm = false;
    p.showIndexColumn = false;
    p.isTreeTable = true;
    p.pagination = false;
    p.rowKey = 'id';
    p.childrenColumnName = 'children';
    p.afterFetch = afterFetchFn;
    p.defaultExpandAllRows = true;
    p.expandRowByClick = true;
    return p;
  }

  function afterFetchFn(data: Recordable[]) {
    let treeData = arrayToTree(data, { parentProperty: 'parentId' });
    return treeData;
  }

  function tableActionsFn(items: ActionItem[], record: Recordable) {
    return items;
  }

  function tableDropDownActionsFn(items: ActionItem[], record: Recordable) {
    items.push({
      icon: 'ant-design:security-scan-outlined',
      label: '查看功能',
      auth: 'Root.Admin.Auth.RoleFunction.ReadFunctions',
      onClick: readFunctions.bind(null, record),
    });
    return items;
  }

  function filterFormPropsFn(p: FormProps): FormProps {
    p.schemas = filterSchemas;
    return p;
  }

  function expandOrCollapseAll() {
    if (unref(isExpanded)) {
      tableMethods.collapseAll();
      isExpanded.value = false;
    } else {
      tableMethods.expandAll();
      isExpanded.value = true;
    }
  }

  // #region 查看功能

  const [registerFunctionViewDrawer, functionViewMethods] = useDrawer();

  const functionViewProps: AdminFunctionViewDrawerProps = {
    module: { ...module, moduleName: 'Module', moduleDisplay: '模块功能', entityName: 'Function', entityDisplay: '功能' },
  };

  function readFunctions(record: Recordable) {
    functionViewMethods.setDrawerProps({ title: `查看模块功能 - ${record.id}.${record.remark}` });
    functionViewMethods.openDrawer(true, record);
  }

  // #endregion
</script>
