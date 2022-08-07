<template>
  <PageWrapper>
    <div class="demo-box" v-ripple>水波纹示例</div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import RippleDirective from '/@/directives/ripple';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SampleFeatRippleIndex',
    components: { PageWrapper },
    directives: {
      Ripple: RippleDirective,
    },
  });
</script>

<style lang="less" scoped>
  .demo-box {
    display: flex;
    width: 300px;
    height: 300px;
    font-size: 24px;
    color: #fff;
    background-color: #408ede;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
  }
</style>
