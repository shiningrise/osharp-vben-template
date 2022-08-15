<!--
 * @ Author: 张业平
 * @ Create Time: 2022-07-16 20:28:46
 * From: https://github.com/vbenjs/vue-vben-admin/pull/2086
 -->

<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ searchFormVisible ? t('component.table.settingHideSearchForm') : t('component.table.settingShowSearchForm') }}</span>
    </template>
    <ZoomInOutlined @click="searchToggle(true)" v-show="!searchFormVisible" />
    <ZoomOutOutlined @click="searchToggle(false)" v-show="searchFormVisible" />
  </Tooltip>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons-vue';
  import { useTableContext } from '../../hooks/useTableContext';
  const { t } = useI18n();
  const table = useTableContext();
  const searchFormVisible = computed(() => {
    return table.getBindValues.value.useSearchForm;
  });
  function searchToggle(hidden: boolean) {
    table.setProps({
      useSearchForm: hidden,
    });
  }
</script>
