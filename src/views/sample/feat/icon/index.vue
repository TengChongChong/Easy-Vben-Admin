<template>
  <PageWrapper>
    <a-card :bordered="false" title="Antv Icon使用 (直接按需引入相应组件即可)" class="!mb-4">
      <div class="flex justify-around">
        <GithubFilled :style="{ fontSize: '30px' }" />
        <QqCircleFilled :style="{ fontSize: '30px' }" />
        <WechatFilled :style="{ fontSize: '30px' }" />
        <AlipayCircleFilled :style="{ fontSize: '30px' }" />
        <IeCircleFilled :style="{ fontSize: '30px' }" />
        <TaobaoCircleFilled :style="{ fontSize: '30px' }" />
        <CodepenCircleFilled :style="{ fontSize: '30px' }" />
      </div>
    </a-card>

    <a-card :bordered="false" title="IconIfy 组件使用" class="!mb-4">
      <div class="flex justify-around flex-wrap">
        <Icon icon="ion:layers-outline" :size="30" />
        <Icon icon="ion:bar-chart-outline" :size="30" />
        <Icon icon="ion:tv-outline" :size="30" />
        <Icon icon="ion:settings-outline" :size="30" />
      </div>
    </a-card>

    <a-card :bordered="false" title="svg 雪碧图" class="!mb-4">
      <div class="flex justify-around flex-wrap">
        <SvgIcon name="test" size="32" />
        <template v-for="item in 6" :key="item">
          <SvgIcon :name="`dynamic-avatar-${item}`" size="32" />
        </template>
      </div>
    </a-card>

    <a-card :bordered="false" title="图标选择器(Iconify)" class="!mb-4">
      <div class="flex justify-around flex-wrap">
        <IconPicker />
      </div>
    </a-card>

    <a-card :bordered="false" title="图标选择器(Svg)" class="!mb-4">
      <div class="flex justify-around flex-wrap">
        <IconPicker mode="svg" />
      </div>
    </a-card>

    <Alert
      show-icon
      message="推荐使用Iconify组件"
      description="Icon组件基本包含所有的图标,在下面网址内你可以查询到你想要的任何图标。并且打包只会打包所用到的图标。"
    />
    <a-button type="primary" @click="toIconify"> Iconify 图标大全 </a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  import {
    QqCircleFilled,
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    IeCircleFilled,
    TaobaoCircleFilled,
    CodepenCircleFilled,
  } from '@ant-design/icons-vue';

  import { Icon, IconPicker, SvgIcon } from '/@/components/Icon';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SampleFeatIconIndex',
    components: {
      PageWrapper,
      GithubFilled,
      QqCircleFilled,
      WechatFilled,
      AlipayCircleFilled,
      IeCircleFilled,
      TaobaoCircleFilled,
      CodepenCircleFilled,
      Icon,
      Alert,
      IconPicker,
      SvgIcon,
    },
    setup() {
      return {
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
      };
    },
  });
</script>
