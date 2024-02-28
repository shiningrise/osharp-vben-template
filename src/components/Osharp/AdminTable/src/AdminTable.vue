<template>
  <div ref="wrapRef">
    <slot name="beforeTable"></slot>
    <BasicTable @register="registerTable" v-bind="$attrs">
      <template #expandedRowRender="{ record }" v-if="showExpand">
        <slot name="expandedRowRender" :record="record"></slot>
      </template>
      <template #toolbar>
        <Authority :value="`${authPath}.Create`">
          <Button type="primary" @click="createRow">新建</Button>
        </Authority>
        <Authority :value="`${authPath}.Delete`">
          <Button type="primary" @click="deleteRows">批量删除</Button>
        </Authority>
        <slot name="appandToolbar"></slot>
      </template>
      <template #form-resetBefore>
        <Button @click="openAdvanceFilter" style="margin-right: 8px">高级搜索</Button>
      </template>
      <template #actionCol="{ record }">
        <TableAction :actions="getTableActions(record)" :drop-down-actions="getTableDropDownActions(record)" />
      </template>
      <slot name="tableTemplates"></slot>
    </BasicTable>
    <slot name="afterTable"></slot>
    <AdminEditModal @register="registerEditModal" @submit="onEditModalSubmit" :module="module"
      :edit-form-props-fn="props.editFormPropsFn" />
    <AdminSearchModal @register="registerSearchModal" @submit="onSearchModalSubmit" :module="props.module" :width="750" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Button } from 'ant-design-vue';
import { Result } from '/#/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { List } from 'linqts';
import { ResultEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { Authority } from '/@/components/Authority';
import { useModal } from '/@/components/Modal';
import { adminTableProps } from './props';
import { buildFilterGroup, PageRequestOptions, readTableData, EditModalDataWrap, FilterGroup } from '/@/utils/osharp';
import { ActionItem, BasicTable, BasicTableProps, useTable, TableAction, FormProps, FetchParams } from '/@/components/Table';
import { AdminEditModal, AdminSearchModal } from '/@/components/Osharp/AdminTable';


const { createMessage, createConfirm } = useMessage();
const props = defineProps(adminTableProps);
const authPath = computed(() => `Root.${props.module?.areaName}.${props.module?.moduleName}.${props.module?.entityName}`).value;
const lowerEntity = computed(() => props.module?.entityName.toLowerCase());
const tableProps = ref<BasicTableProps>();

const [registerTable, tableMethods] = useTable(getTableProps());

function getTableProps(): BasicTableProps {
  let p: BasicTableProps = {
    columns: [],
    api: readData,
    canResize: true,
    clickToRowSelect: false,
    showTableSetting: true,
    tableSetting: { fullScreen: true, searchToggle: true },
    showIndexColumn: false,
    formConfig: getFilterFormProps(),
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'actionCol',
      slots: { customRender: 'actionCol' },
      fixed: 'right',
    },
  };
  if (props.tablePropsFn) {
    p = props.tablePropsFn(p);
  }
  tableProps.value = p;
  return p;
}

async function readData(opts: any) {
  const options: PageRequestOptions = {
    page: opts.page,
    pageSize: opts.pageSize,
    field: opts.field,
    order: opts.order,
  };
  const tablePropsValue = tableProps.value!;
  const filterSchemas = tablePropsValue.formConfig?.schemas;
  const group1 = adGroup.value;
  if (group1 && (group1.rules.length > 0 || group1.groups.length > 0)) {
    options.filter = group1;
  }
  if (tablePropsValue.useSearchForm && filterSchemas) {
    const filterFormValue = tableMethods.getForm().getFieldsValue();
    const group2 = buildFilterGroup(filterFormValue, filterSchemas);
    if (group2 && (group2.rules.length > 0 || group2.groups.length > 0)) {
      options.filter = group2;
    }
  }

  const url = `/admin/${lowerEntity.value}/read`;
  const data = await readTableData(url, options, props.tableDataFn);
  if (searchModalMethods) {
    searchModalMethods.setModalProps({ confirmLoading: false });
  }
  return data;  
}

function getTableActions(record: Recordable): ActionItem[] {
  let items: ActionItem[] = [];
  items.push(
    { icon: 'ant-design:edit-outlined', onClick: updateRow.bind(null, record), auth: `${authPath}.Update`, ifShow: () => record.updatable },
    {
      icon: 'ant-design:delete-outlined',
      auth: `${authPath}.Delete`,
      ifShow: () => record.deletable,
      popConfirm: { title: '是否确认删除？', confirm: deleteRow.bind(null, record) },
    },
  );
  if (props.tableActionsFn) {
    items = props.tableActionsFn(items, record);
  }
  return items;
}

function getTableDropDownActions(record: Recordable): ActionItem[] {
  let items: ActionItem[] = [];
  if (props.tableDropDownActionsFn) {
    items = props.tableDropDownActionsFn(items, record);
  }
  return items;
}

function getFilterFormProps(): FormProps {
  let p: FormProps = {
    labelWidth: 100,
    size: 'small',
    autoAdvancedLine: 1,
    autoSubmitOnEnter: true,
  };
  if (props.filterFormPropsFn) {
    p = props.filterFormPropsFn(p);
  }
  return p;
}

// #region 创建、更新记录

const [registerEditModal, editModalMethods] = useModal();

function createRow() {
  editModalMethods.setModalProps({ title: `新建${props.module?.entityDisplay}` });
  const url = `/admin/${props.module?.entityName}/create`;
  const record: Recordable = {};
  editModalMethods.openModal<EditModalDataWrap>(true, { submitUrl: url, record });
}

function updateRow(record: Recordable) {
  editModalMethods.setModalProps({ title: `更新${props.module?.entityDisplay}` });
  if (props.editModalFn) {
    props.editModalFn(editModalMethods, record);
  }
  const url = `/admin/${props.module?.entityName}/update`;
  editModalMethods.openModal<EditModalDataWrap>(true, { submitUrl: url, record });
}

function onEditModalSubmit() {
  tableMethods.reload();
}

// #endregion

// #region 删除记录

async function deleteRow(record: Recordable) {
  const ids = [record.id];
  const result = await defHttp.post({
    url: `/admin/${props.module?.entityName.toLowerCase()}/delete`,
    params: ids,
  });
  if (result.type == ResultEnum.SUCCESS) {
    tableMethods.reload();
    return;
  }
}

async function deleteRows() {
  const rows = tableMethods.getSelectRows();
  const ids = new List(rows).Select((m) => m.id).ToArray();
  if (ids.length == 0) {
    createMessage.warn('请选择要删除的数据行');
    return;
  }
  createConfirm({
    iconType: 'warning',
    title: '请确认',
    content: `是否确定要删除选中的 ${ids.length} 条数据？`,
    onOk: async () => {
      const result = await defHttp.post<Result>({
        url: `/admin/${lowerEntity.value}/delete`,
        params: ids,
      });
      if (result.type == ResultEnum.SUCCESS) {
        tableMethods.reload();
        tableMethods.clearSelectedRowKeys();
        return false;
      }
    },
  });
}

// #endregion

// #region 高级查询

const [registerSearchModal, searchModalMethods] = useModal();
const adGroup = ref<FilterGroup>();

function openAdvanceFilter() {
  searchModalMethods.setModalProps({ title: `高级搜索：${props.module?.entityDisplay}信息` });
  searchModalMethods.openModal(true, {});
}

function onSearchModalSubmit(group: FilterGroup) {
  adGroup.value = group;
  searchModalMethods.setModalProps({ confirmLoading: true });
  tableMethods.reload();
}

// #endregion

</script>
