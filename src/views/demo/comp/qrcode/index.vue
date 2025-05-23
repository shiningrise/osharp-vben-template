<template>
  <PageWrapper title="二维码组件使用示例">
    <div class="flex flex-wrap">
      <CollapseContainer title="基础示例" :canExpan="true" class="text-center mb-6 w-1/5 mr-6">
        <QrCode :value="qrCodeUrl" />
      </CollapseContainer>

      <CollapseContainer title="渲染成img标签示例" class="text-center mb-6 w-1/5 mr-6">
        <QrCode :value="qrCodeUrl" tag="img" />
      </CollapseContainer>

      <CollapseContainer title="配置样式示例" class="text-center mb-6 w-1/5 mr-6">
        <QrCode
          :value="qrCodeUrl"
          :options="{
            color: { dark: '#55D187' },
          }"
        />
      </CollapseContainer>

      <CollapseContainer title="本地logo示例" class="text-center mb-6 w-1/5 mr-6">
        <QrCode :value="qrCodeUrl" :logo="LogoImg" />
      </CollapseContainer>

      <CollapseContainer title="在线logo示例" class="text-center mb-6 w-1/5 mr-6">
        <QrCode
          :value="qrCodeUrl"
          logo="https://vebn.oss-cn-beijing.aliyuncs.com/vben/logo.png"
          :options="{
            color: { dark: '#55D187' },
          }"
        />
      </CollapseContainer>

      <CollapseContainer title="logo配置示例" class="text-center mb-6 w-1/5 mr-6">
        <QrCode
          :value="qrCodeUrl"
          :logo="{
            src: 'https://vebn.oss-cn-beijing.aliyuncs.com/vben/logo.png',
            logoSize: 0.2,
            borderSize: 0.05,
            borderRadius: 50,
            bgColor: 'blue',
          }"
        />
      </CollapseContainer>

      <CollapseContainer title="下载示例" class="text-center mb-6 w-1/5 mr-6">
        <QrCode :value="qrCodeUrl" ref="qrRef" :logo="LogoImg" />
        <a-button class="mb-2" type="primary" @click="download"> 下载 </a-button>
        <div class="msg">(在线logo会导致图片跨域，需要下载图片需要自行解决跨域问题)</div>
      </CollapseContainer>

      <CollapseContainer title="配置大小示例" class="text-center w-1/5 mr-6">
        <QrCode :value="qrCodeUrl" :width="300" />
      </CollapseContainer>

      <CollapseContainer title="扩展绘制示例" class="text-center w-1/5 mr-6">
        <QrCode
          :value="qrCodeUrl"
          :width="200"
          :options="{ margin: 5 }"
          ref="qrDiyRef"
          :logo="LogoImg"
          @done="onQrcodeDone"
        />
        <a-button class="mb-2" type="primary" @click="downloadDiy"> 下载 </a-button>
        <div class="msg">要进行扩展绘制则不能将tag设为img</div>
      </CollapseContainer>

      <CollapseContainer title="Antdv QRCode" class="text-center w-1/5 mr-6">
        <QRCode :value="qrCodeUrl" :size="200" />
      </CollapseContainer>

      <CollapseContainer title="Antdv QRCode 带icon" class="text-center w-1/5 mr-6">
        <QRCode :value="qrCodeUrl" :size="200" :icon="LogoImg" />
      </CollapseContainer>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { QrCode, QrCodeActionType } from '@/components/Qrcode';
  import LogoImg from '@/assets/osharp/images/logo.png';
  import { CollapseContainer } from '@/components/Container';
  import { PageWrapper } from '@/components/Page';
  import { type Nullable } from '@vben/types';
  import { QRCode } from 'ant-design-vue';

  const qrCodeUrl = 'https://www.vvbin.cn';
  const qrRef = ref<Nullable<QrCodeActionType>>(null);
  const qrDiyRef = ref<Nullable<QrCodeActionType>>(null);
  function download() {
    const qrEl = unref(qrRef);
    if (!qrEl) return;
    qrEl.download('文件名');
  }
  function downloadDiy() {
    const qrEl = unref(qrDiyRef);
    if (!qrEl) return;
    qrEl.download('Qrcode');
  }

  function onQrcodeDone({ ctx }: any) {
    if (ctx instanceof CanvasRenderingContext2D) {
      // 额外绘制
      ctx.fillStyle = 'black';
      ctx.font = '16px "微软雅黑"';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText('你帅你先扫', 100, 195, 200);
    }
  }
</script>
