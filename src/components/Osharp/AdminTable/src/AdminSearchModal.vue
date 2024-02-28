<template>
  <BasicModal @register="registerModal" @ok="submit()" @cancel="cancel()" v-bind="$attrs" :destroy-on-close="true">
    <div>
      <FilterGroupV :group="group" :entity="entity" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { adminSearchModalProps } from "./props";
import { BasicModal, useModalInner } from '@/components/Modal';
import { FilterGroupV } from "/@/components/Osharp";
import { FilterOperate, FilterGroup, cleanFilterGroup } from '/@/utils/osharp';

const props = defineProps(adminSearchModalProps);
const group = ref<FilterGroup>({ rules: [], groups: [], operate: FilterOperate.And, level: 1 });
const entity = computed(() => props.module?.entityFullName!);

const emits = defineEmits(['register', 'submit']);

const [registerModal, modalMethods] = useModalInner(data => {
  modalMethods.setModalProps({ confirmLoading: false });
});

function submit() {
  let g = group.value;
  emits('submit', g);
}

function cancel() {
  
}

</script>
