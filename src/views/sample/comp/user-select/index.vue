<template>
  <PageWrapper>
    <div class="user-wrapper">
      <a-row :gutter="[16, 16]">
        <a-col :xl="12" :lg="24">
          <a-card title="基础示例" :bordered="false">
            <h3>UserSelect - 用户选择器</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="选择用户">
                <user-select v-model:value="userId" />
              </a-descriptions-item>
              <a-descriptions-item label="选择用户 - 多选">
                <user-select mode="multiple" v-model:value="userIds" />
              </a-descriptions-item>
            </a-descriptions>
            <h3>UserModalSelect - 用户对话框选择器</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="选择用户">
                <user-modal-select v-model:value="userId" />
              </a-descriptions-item>
              <a-descriptions-item label="选择用户 - 多选">
                <user-modal-select multiple v-model:value="userIds" />
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24">
          <a-card title="在表单中使用" :bordered="false" class="!mb-4">
            <BasicForm @register="register" />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { UserSelect, UserModalSelect } from '/@/components/UserSelect';
  export default defineComponent({
    components: {
      UserSelect,
      UserModalSelect,
      PageWrapper,
      BasicForm,
    },
    setup() {
      const userId = ref<string>('1533320501638762498');
      const userIds = ref<string[]>(['1533320501638762498', '1533326281821671425']);

      const schemas: FormSchema[] = [
        {
          field: 'userSelect',
          label: '选择用户',
          component: 'UserSelect',
        },
        {
          field: 'userSelectMultiple',
          label: '选择用户 - 多选',
          component: 'UserSelect',
          componentProps: {
            multiple: true,
          },
        },
        {
          field: 'userModalSelect',
          label: '选择用户',
          component: 'UserModalSelect',
        },
        {
          field: 'userModalSelectMultiple',
          label: '选择用户 - 多选',
          component: 'UserModalSelect',
          componentProps: {
            multiple: true,
          },
        },
      ];

      const [register, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: { sm: 24 },
        baseColProps: { sm: 24 },
      });

      const formModel = {};

      onMounted(() => {
        setFieldsValue(formModel);
      });

      return {
        userId,
        userIds,
        register,
      };
    },
  });
</script>
<style lang="less">
  .user-wrapper {
    h3 {
      margin-top: 0.5rem;
    }

    .ant-descriptions-bordered {
      .ant-descriptions-item-label {
        width: 160px;
      }
    }
  }
</style>
