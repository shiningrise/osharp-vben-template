<template>
  <BasicDrawer @register="registerDrawer" v-bind="$attrs">
    <div>
      <FilterGroupV :group="group || { rules: [], groups: [], operate: FilterOperate.And, level: 1 }" :entity="entity" />
      <Button @click="showGroupJson()" type="default" style="margin: 5px;">显示JSON</Button>
      <Button @click="submit()" type="primary" style="margin: 5px;">提交</Button>
      <Alert type="info" :showIcon="true" message="筛选规则JSON" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import { ref, defineProps, computed } from "vue";
import { cloneDeep } from 'lodash';
import { Button, Alert } from "ant-design-vue";
import { BasicDrawer, useDrawerInner } from "/@/components/Drawer";
import { FilterGroupV } from "../..";
import { FilterGroup, FilterOperate, ModuleInfo } from "@/utils/osharp";

const props = defineProps<{ record: Recordable; module: ModuleInfo; group: FilterGroup; entity: string; }>();
const authPath = computed(() => `Root.${props.module.areaName}.${props.module.moduleName}.${props.module.entityName}`).value;
const groupJson = ref('');

const [registerDrawer] = useDrawerInner(data => { 
  console.log(data);
});

function showGroupJson() { 
  let g = cloneDeep(props.group);
  groupJson.value = JSON.stringify(g, null, 2);
}

function submit() { 

}
</script>
