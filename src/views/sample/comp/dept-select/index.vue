<template>
  <PageWrapper>
    <div class="dept-wrapper">
      <a-row :gutter="[16, 16]">
        <a-col :xl="12" :lg="24">
          <a-card title="基础示例" :bordered="false">
            <h3>DeptSelect - 部门选择器</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="选择部门">
                <dept-select v-model:value="deptId" />
              </a-descriptions-item>
              <a-descriptions-item label="选择部门 - 多选">
                <dept-select multiple v-model:value="deptIds" />
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
  import { DeptSelect } from '/@/components/Dept';
  export default defineComponent({
    components: {
      DeptSelect,
      PageWrapper,
      BasicForm,
    },
    setup() {
      const deptId = ref<string>('1');
      const deptIds = ref<string[]>(['1', '1531875430343229442']);

      const schemas: FormSchema[] = [
        {
          field: 'deptSelect',
          label: '选择部门',
          component: 'DeptSelect',
        },
        {
          field: 'deptSelectMultiple',
          label: '选择部门 - 多选',
          component: 'DeptSelect',
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
        deptId,
        deptIds,
        register,
      };
    },
  });
</script>
<style lang="less">
  .dept-wrapper {
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
