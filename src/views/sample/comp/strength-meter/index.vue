<template>
  <PageWrapper>
    <a-row>
      <a-col :xl="8" :md="12">
        <a-card title="密码强度校验" :bordered="false">
          <StrengthMeter placeholder="默认" />
          <StrengthMeter placeholder="禁用" disabled />
          <br />
          <StrengthMeter placeholder="隐藏input" :show-input="false" value="!@#qwe12345" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: {
      StrengthMeter,
      PageWrapper,
    },
  });
</script>
<style lang="less" scoped>
  .demo-wrap {
    width: 50%;
    background-color: @component-background;
    border-radius: 10px;
  }
</style>
