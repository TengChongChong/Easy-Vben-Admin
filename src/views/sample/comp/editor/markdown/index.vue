<template>
  <PageWrapper>
    <a-card title="MarkDown组件示例" :bordered="false" class="!mb-4">
      <a-space>
        <a-button @click="toggleTheme" class="mb-2" type="primary"> 切换主题 </a-button>
        <a-button @click="clearValue" class="mb-2" type="default"> 清空内容 </a-button>
      </a-space>

      <MarkDown
        v-model:value="value"
        @change="handleChange"
        ref="markDownRef"
        placeholder="这是占位文本"
      />
    </a-card>
    <a-card title="Markdown Viewer 组件示例">
      <MarkdownViewer :value="value" />
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { MarkDown, MarkDownActionType, MarkdownViewer } from '/@/components/Markdown';
  import { PageWrapper } from '/@/components/Page';
  import { Card } from 'ant-design-vue';

  export default defineComponent({
    name: 'SampleCompEditorMarkdownIndex',
    components: { MarkDown, PageWrapper, MarkdownViewer, ACard: Card },
    setup() {
      const markDownRef = ref<Nullable<MarkDownActionType>>(null);
      const valueRef = ref(`
# title

# content
`);

      let isDark = false;

      function toggleTheme() {
        const markDown = unref(markDownRef);
        if (!markDown) return;
        const editor = markDown.getVditor();
        if (isDark) {
          editor.setTheme('classic');
        } else {
          editor.setTheme('dark');
        }
        isDark = !isDark;
      }

      function handleChange(v: string) {
        valueRef.value = v;
      }

      function clearValue() {
        valueRef.value = '';
      }

      return {
        value: valueRef,
        toggleTheme,
        markDownRef,
        handleChange,
        clearValue,
      };
    },
  });
</script>
