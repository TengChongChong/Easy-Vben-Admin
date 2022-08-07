<template>
  <PageWrapper>
    <a-card title="MarkDown嵌入表单示例" :bordered="false">
      <BasicForm
        :labelWidth="100"
        :schemas="schemas"
        :actionColOptions="{ span: 24 }"
        :base-col-props="{ xxl: 24, xl: 24, md: 24 }"
        @submit="handleSubmit"
      />
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { BasicForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { MarkDown } from '/@/components/Markdown';
  import { PageWrapper } from '/@/components/Page';

  const schemas: FormSchema[] = [
    {
      field: 'title',
      component: 'Input',
      label: 'title',
      defaultValue: '标题',
      required: true,
    },
    {
      field: 'markdown',
      component: 'Input',
      label: 'markdown',
      defaultValue: 'defaultValue',
      rules: [{ required: true, trigger: 'blur' }],
      render: ({ model, field }) => {
        return h(MarkDown, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];
  export default defineComponent({
    name: 'SampleCompEditorMarkdownEditor',
    components: { BasicForm, PageWrapper },
    setup() {
      const { createMessage } = useMessage();

      return {
        schemas,
        handleSubmit: (values: any) => {
          createMessage.success('click search,values:' + JSON.stringify(values));
        },
      };
    },
  });
</script>
