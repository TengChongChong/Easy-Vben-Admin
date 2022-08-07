<template>
  <PageWrapper
    title="基础表单"
    contentBackground
    content=" 表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
    contentClass="p-4"
  >
    <BasicForm @register="register" />
    <div class="text-center">
      <a-space>
        <a-button-save @click="customSubmitFunc" />
      </a-space>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent } from 'vue';
  import { schemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { AButtonSave } from '/@/components/Button';

  export default defineComponent({
    name: 'FormBasicPage',
    components: { AButtonSave, BasicForm, PageWrapper },
    setup() {
      const { createMessage } = useMessage();
      const [register, { validate, setProps }] = useForm({
        schemas: schemas,
        showActionButtonGroup: false,
        baseColProps: { md: 12, sm: 24 },
      });

      async function customSubmitFunc() {
        try {
          await validate();
          setProps({
            submitButtonOptions: {
              loading: true,
            },
          });
          setTimeout(() => {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
            createMessage.success('提交成功！');
          }, 2000);
        } catch (error) {}
      }

      return { register, customSubmitFunc };
    },
  });
</script>
<style lang="less" scoped>
  .form-wrap {
    padding: 24px;
    background-color: @component-background;
  }
</style>
