<template>
  <PageWrapper>
    <a-card title="富文本基础示例" :bordered="false" class="!mb-4">
      <Tinymce v-model="value" @change="handleChange" width="100%" />
    </a-card>

    <a-card title="富文本嵌入表单示例" :bordered="false" class="!mb-4">
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
  import { defineComponent, h, ref } from 'vue';
  import { Tinymce } from '/@/components/Tinymce';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, FormSchema } from '/@/components/Form';
  import { message } from 'ant-design-vue';

  const schemas: FormSchema[] = [
    {
      field: 'title',
      component: 'Input',
      label: 'title',
      defaultValue: 'defaultValue',
      rules: [{ required: true }],
    },
    {
      field: 'tinymce',
      component: 'Input',
      label: 'tinymce',
      defaultValue: 'defaultValue',
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];

  export default defineComponent({
    name: 'SampleCompEditorTinymceIndex',
    components: { PageWrapper, BasicForm, Tinymce },
    setup() {
      const value = ref('hello world!');
      function handleChange(value: string) {
        console.log(value);
      }
      return {
        schemas,
        handleChange,
        value,
        handleSubmit: (values: any) => {
          message.success('click search,values:' + JSON.stringify(values));
        },
      };
    },
  });
</script>
