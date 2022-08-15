<template>
  <div ref="wrapRef">
    <slot name="beforeTable"></slot>
    <BasicTable @register="registerTable" v-bind="$attrs">
      <template #toolbar>
        <Authority :value="`${authPath}.Create`">
          <a-button type="primary" @click="createRow">新建</a-button>
        </Authority>
        <Authority :value="`${authPath}.Delete`">
          <a-button type="primary" @click="deleteRows">批量删除</a-button>
        </Authority>
        <slot name="appandToolbar"></slot>
      </template>
      <template #form-resetBefore>
        <a-button @click="openAdvanceFilter" style="margin-right: 8px">高级搜索</a-button>
      </template>
      <template #actionCol="{ record }">
        <TableAction :actions="getTableActions(record)" :drop-down-actions="getTableDropDownActions(record)" />
      </template>
      <slot name="tableTemplates"></slot>
    </BasicTable>
    <slot name="afterTable"></slot>
    <AdminEditModal @register="registerModal" @on-close="onModalClose" :module="props.module" :edit-form-props-fn="props.editFormPropsFn" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, BasicTableProps, useTable, TableAction, FormProps } from '/@/components/Table';
  import { computed, ref } from 'vue';
  import { Result } from '/#/axios';
  import { Authority } from '/@/components/Authority';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { adminTableProps } from './props';
  import { defHttp } from '/@/utils/http/axios';
  import { buildFilterGroup, EditModalDataWrap, PageRequestOptions, readTableData } from '/@/utils/osharp';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { AdminEditModal } from '/@/components/Osharp/AdminTable';
  import { List } from 'linqts';

  const { createMessage, createConfirm } = useMessage();
  const props = defineProps(adminTableProps);
  const module = computed(() => props.module).value;
  const authPath = computed(() => `Root.${module?.areaName}.${module?.moduleName}.${module?.entityName}`).value;
  const lowerEntity = computed(() => module?.entityName.toLowerCase());
  const tableProps = ref<BasicTableProps>();

  const [registerTable, tableMethods] = useTable(getTableProps());
  const [registerModal, modalMethods] = useModal();

  function getTableProps(): BasicTableProps {
    let p: BasicTableProps = {
      columns: [],
      api: readData,
      canResize: true,
      clickToRowSelect: false,
      showTableSetting: true,
      tableSetting: { fullScreen: true },
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
    if (tablePropsValue.useSearchForm && filterSchemas) {
      const filterFormValue = tableMethods.getForm().getFieldsValue();
      options.filter = buildFilterGroup(filterFormValue, filterSchemas);
    }
    const url = `/admin/${lowerEntity.value}/read`;
    return readTableData(url, options, props.tableDataFn);
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

  function openAdvanceFilter() {
    createMessage.info('打开高级搜索框');
  }

  function createRow() {
    modalMethods.setModalProps({ title: `新建${module?.entityDisplay}` });
    const url = `/admin/${module?.entityName}/create`;
    const record: Recordable = {};
    modalMethods.openModal<EditModalDataWrap>(true, { submitUrl: url, record });
  }

  function updateRow(record: Recordable) {
    modalMethods.setModalProps({ title: `更新${module?.entityDisplay}` });
    if (props.editModalFn) {
      props.editModalFn(modalMethods, record);
    }
    const url = `/admin/${module?.entityName}/update`;
    modalMethods.openModal<EditModalDataWrap>(true, { submitUrl: url, record });
  }

  function onModalClose() {
    tableMethods.reload();
  }

  async function deleteRow(record: Recordable) {
    const ids = [record.id];
    const result = await defHttp.post({
      url: `/admin/${module?.entityName.toLowerCase()}/delete`,
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
</script>
