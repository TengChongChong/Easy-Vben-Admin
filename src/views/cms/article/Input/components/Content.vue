<template>
  <a-card>
    <BasicForm @register="registerForm" />

    <div class="text-center">
      <a-space v-if="!isChangeSite">
        <a-button-save :loading="saveBtnLoading" @click="save" />
        <a-button-save :loading="saveBtnLoading" text="保存并新增" @click="saveAndAdd" />
      </a-space>

      <a-alert
        style="display: inline-flex"
        v-if="isChangeSite"
        message="你已切换站点，本页面无法保存"
        type="warning"
        show-icon
      />
    </div>
  </a-card>
</template>

<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent, h, watch } from 'vue';
  import Editor from '/@/views/cms/components/Tinymce/Editor.vue';
  import { CmsArticle } from '/@/api/cms/model/cmsArticleModel';
  import { AButtonSave } from '/@/components/Button';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    components: { BasicForm, AButtonSave },
    props: {
      saveBtnLoading: propTypes.bool,
      isChangeSite: propTypes.bool,
      cmsArticle: { type: Object as PropType<CmsArticle> },
    },
    setup(props, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 80,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'title',
            label: '标题',
            required: true,
            component: 'Input',
            rules: [{ max: 128, message: '标题不能超过128个字符', trigger: 'blur' }],
          },
          {
            field: 'subtitle',
            label: '副标题',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 256, message: '副标题不能超过256个字符', trigger: 'blur' }],
          },
          {
            field: 'content',
            label: '内容',
            component: 'Input',
            render: ({ model, field }) => {
              return h(Editor, {
                value: model[field],
                height: 595,
                onChange: (value: string) => {
                  model[field] = value;
                },
              });
            },
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
        save: () => emit('save'),
        saveAndAdd: () => emit('save-and-add'),
      };
    },
  });
</script>

<style scoped lang="less"></style>
