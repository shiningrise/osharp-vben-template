<template>
  <BasicModal @register="registerModal" @ok="submit" v-bind="$attrs" :destroy-on-close="true">
    <div>
      <FilterGroupV :group="group" :entity="entity"/>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from "ant-design-vue";
import { BasicModal, useModalInner } from '@/components/Modal';
import { EditModalDataWrap } from "/@/utils/osharp";
import { adminSearchModalProps } from "./props";

const props = defineProps(adminSearchModalProps);
const emits = defineEmits(['register', 'onClose']);

const url = ref<string>();

const [registerModal, modalMethods] = useModalInner((data: EditModalDataWrap) => {
  modalMethods.setModalProps({ confirmLoading: false });
  url.value = data.submitUrl;
});


function submit() {
  console.log('admin search modal submit');
}

</script>
