<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="userName" class="enter-x">
        <Input class="fix-auto-fill" size="large" v-model:value="formData.userName" :placeholder="t('sys.login.userName')" />
      </FormItem>
      <FormItem name="email" class="enter-x">
        <Input class="fix-auto-fill" size="large" v-model:value="formData.email" :placeholder="t('sys.login.email')" />
      </FormItem>
      <FormItem name="nickName" class="enter-x">
        <Input class="fix-auto-fill" size="large" v-model:value="formData.nickName" :placeholder="t('sys.login.nickName')" />
      </FormItem>
      <!-- <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" class="fix-auto-fill" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput size="large" class="fix-auto-fill" v-model:value="formData.sms" :placeholder="t('sys.login.smsCode')" />
      </FormItem> -->
      <FormItem name="password" class="enter-x">
        <StrengthMeter size="large" v-model:value="formData.password" :placeholder="t('sys.login.password')" />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword size="large" visibilityToggle v-model:value="formData.confirmPassword" :placeholder="t('sys.login.confirmPassword')" />
      </FormItem>
      <FormItem name="captcha" class="enter-x">
        <!-- <Input class="fix-auto-fill" size="large" v-model:value="formData.captcha" :placeholder="t('sys.login.captcha')" enter-button="Search" /> -->
        <!-- <Input v-model:value="formData.captcha" addonAfter="Search" /> -->
        <InputCaptcha v-model:value="formData.captcha" :captchaId="formData.captchaId" />
      </FormItem>
      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>
      <Button type="primary" class="enter-x" size="large" block @click="handleRegister" :loading="loading">
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed, onMounted } from 'vue';
  import { Guid } from 'guid-typescript';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { InputCaptcha } from '/@/components/Osharp';
  const { createMessage, createErrorModal } = useMessage();
  const userStore = useUserStore();

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // mobile: '',
    // sms: '',
    nickName: '',
    captcha: '',
    captchaId: '',
    policy: false,
  });

  onMounted(() => {
    let id = Guid.create().toString();
    formData.captchaId = id;
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister(): Promise<void> {
    try {
      const data = await validForm();
      if (!data) return;
      loading.value = true;

      const info = await userStore.register({
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        captcha: data.captcha,
        captchaId: formData.captchaId,
        policy: data.policy,
      });
      if (info) {
        createMessage.success(`用户${info.nickName}(${info.userName})注册成功，将跳到登录页进行登录`);
        handleBackLogin();
      }
    } catch (error) {
      createErrorModal({ content: `注册失败，请检查注册信息` });
    } finally {
      loading.value = false;
    }
  }
</script>
