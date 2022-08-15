<template>
  <BasicDrawer @register="registerDrawer" v-bind="$attrs">
    <BasicTable @register="registerTable" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { adminFunctionViewDrawerProps } from './props';
  import { defHttp } from '/@/utils/http/axios';
  import { PageData, accessTypeTags, TagRender, readTableData, PageRequestOptions } from '/@/utils/osharp';
  import { Result } from '/#/axios';

  const props = defineProps(adminFunctionViewDrawerProps);
  const module = computed(() => props.module).value;

  const [registerDrawer] = useDrawerInner((data) => {
    let paramName = module!.moduleName.toLowerCase();
    paramName = paramName.includes('role') ? 'roleId' : paramName.includes('user') ? 'userId' : 'moduleId';
    const url = `/${module?.areaName.toLowerCase()}/${module?.moduleName.toLowerCase()}/readfunctions?${paramName}=${data.id}`;
    tableMethods.setProps({ api: (opts) => readData(url, opts) });
    tableMethods.setPagination({ current: 1 });
    tableMethods.reload();
  });

  const [registerTable, tableMethods] = useTable({
    columns: [
      { title: '功能名称', dataIndex: 'name', sorter: true, align: 'left' },
      { title: '功能类型', dataIndex: 'accessType', sorter: true, width: 100, customRender: ({ text }) => TagRender(text, accessTypeTags) },
      { title: '区域', dataIndex: 'area', sorter: true, align: 'left', width: 80 },
      { title: '控制器', dataIndex: 'controller', sorter: true, align: 'left', width: 100 },
    ],
    title: '功能列表',
    clickToRowSelect: false,
    showTableSetting: true,
    showIndexColumn: true,
    immediate: false,
  });

  async function readData(url: string, opts: any) {
    const options: PageRequestOptions = {
      page: opts.page,
      pageSize: opts.pageSize,
      field: opts.field,
      order: opts.order,
    };
    return readTableData(url, options);
  }
</script>
