<template>
  <a-input-group>
    <Input style="width: 120px; min-width: 100px; margin-right: 10px" size="large" v-bind="$attrs" :placeholder="t('sys.login.captcha')" />
    <img :src="imageUrl" @click="refreshCaptcha()" style="width: 100px; height: 40px; cursor: pointer" title="点击刷新验证码" />
  </a-input-group>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Input } from 'ant-design-vue';
  const { t } = useI18n();
  const props = defineProps({
    captchaId: { type: String },
  });
  const imageUrl = ref('');
  onMounted(() => {
    refreshCaptcha();
  });

  function refreshCaptcha() {
    const time = new Date().getTime();
    imageUrl.value = `/basic-api/common/captcha?id=${props.captchaId}&t=${time}`;
  }
</script>
