<template>
  <PageWrapper>
    <a-card title="文本复制示例" :bordered="false">
      <div class="flex justify-center">
        <a-input placeholder="请输入" v-model:value="value" />
        <a-button type="primary" @click="handleCopy"> Copy </a-button>
      </div>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, unref, ref } from 'vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SampleFeatCopyIndex',
    components: { PageWrapper },
    setup() {
      const valueRef = ref('');
      const { createMessage } = useMessage();
      const { clipboardRef, copiedRef } = useCopyToClipboard();

      function handleCopy() {
        const value = unref(valueRef);
        if (!value) {
          createMessage.warning('请输入要拷贝的内容！');
          return;
        }
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.warning('copy success！');
        }
      }
      return { handleCopy, value: valueRef };
    },
  });
</script>
