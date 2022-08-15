<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/infos/Message.vue" company="LiuliuSoft">
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
  import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, transTagToOptions, FilterOperate } from '/@/utils/osharp';

  const module: ModuleInfo = {
    ...defaultModuleInfo,
    moduleName: 'Infos',
    moduleDisplay: '信息',
    entityName: 'Message',
    entityDisplay: '站内信',
  };
  const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
  const { createMessage } = useMessage();

  const columns: BasicColumn[] = [{ title: '编号', dataIndex: 'id', width: 300 }];

  const editSchemas: FormSchema[] = [{ label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' }];

  const filterSchemas: FormSchema[] = [];

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
