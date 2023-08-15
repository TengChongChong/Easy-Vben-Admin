<template>
  <BasicForm @register="registerForm" />
</template>

<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { CmsArticle } from '/@/api/cms/model/cmsArticleModel';
  import { defineComponent, watch } from 'vue';

  export default defineComponent({
    components: { BasicForm },
    props: {
      cmsArticle: { type: Object as PropType<CmsArticle> },
    },
    setup(props) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 80,
        schemas: [
          {
            field: 'keyword',
            label: '关键字',
            component: 'Input',
            rules: [{ max: 128, message: '关键字不能超过128个字符', trigger: 'blur' }],
          },
          {
            field: 'description',
            label: '描述',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 1024, message: '描述不能超过1024个字符', trigger: 'blur' }],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      watch(
        () => props.cmsArticle,
        async () => {
          await resetFields();
          await setFieldsValue(props.cmsArticle);
        },
      );
      return {
        registerForm,
        validate,
        getFieldsValue,
      };
    },
  });
</script>

<style scoped lang="less"></style>
