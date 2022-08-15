<template>
  <BasicModal @register="registerModal" @ok="submit" v-bind="$attrs" :destroy-on-close="true">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormProps, useForm } from '/@/components/Form';
  import { adminEditModalProps } from './props';
  import { defHttp } from '/@/utils/http/axios';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { Result } from '/#/axios';
  import { EditModalDataWrap } from '/@/utils/osharp';

  const url = ref('');
  const props = defineProps(adminEditModalProps);

  const emits = defineEmits(['onClose', 'register']);

  const [registerForm, formMethods] = useForm(getEditFormProps());
  const [registerModal, modalMethods] = useModalInner((data: EditModalDataWrap) => {
    formMethods.resetFields();
    modalMethods.setModalProps({ confirmLoading: false });
    url.value = data.submitUrl;
    formMethods.setFieldsValue({ ...data.record });
  });

  function getEditFormProps(): FormProps {
    let p: FormProps = {
      labelWidth: 100,
      showActionButtonGroup: false,
      autoSubmitOnEnter: true,
    };
    if (props.editFormPropsFn) {
      p = props.editFormPropsFn(p);
    }
    return p;
  }

  async function submit() {
    modalMethods.setModalProps({ loading: true });
    try {
      let values = await formMethods.validate();
      let params;
      if (props.transportSubmitData) {
        params = props.transportSubmitData(values);
      } else {
        params = [values];
      }
      const result = await defHttp.post<Result>({ url: url.value, params: params });
      if (result.type == ResultEnum.SUCCESS) {
        formMethods.resetFields();
        emits('onClose');
        modalMethods.closeModal();
      }
    } catch (e) {
    } finally {
      modalMethods.setModalProps({ loading: false });
    }
  }
</script>
