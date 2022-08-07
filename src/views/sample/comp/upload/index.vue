<template>
  <PageWrapper>
    <a-row :gutter="[16, 16]">
      <a-col :md="12">
        <a-card title="基础示例" :bordered="false">
          <BasicUpload
            :maxSize="20"
            :maxNumber="10"
            @change="handleChange"
            :api="uploadApi"
            class="my-5"
            :accept="['image/*']"
          />
        </a-card>
      </a-col>
      <a-col :md="12">
        <a-card title="嵌入表单" :bordered="false">
          <BasicForm @register="register" class="my-5" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { PageWrapper } from '/@/components/Page';
  import { Alert } from 'ant-design-vue';
  import { uploadApi } from '/@/api/sys/upload';

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      label: '字段1',
      component: 'Upload',
      componentProps: {
        maxSize: 20,
        maxNumber: 10,
        accept: ['image/*'],
      },
      colProps: { xxl: 24, xl: 24, lg: 24 },
      rules: [{ required: true, message: '请选择上传文件' }],
    },
  ];
  export default defineComponent({
    components: { BasicUpload, BasicForm, PageWrapper, [Alert.name]: Alert },
    setup() {
      const [register] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      return {
        handleChange: (list) => {
          console.log(list);
        },
        uploadApi,
        register,
      };
    },
  });
</script>
