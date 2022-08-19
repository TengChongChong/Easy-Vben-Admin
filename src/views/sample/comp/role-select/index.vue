<template>
  <PageWrapper>
    <div class="role-wrapper">
      <a-row :gutter="[16, 16]">
        <a-col :xl="12" :lg="24">
          <a-card title="基础示例" :bordered="false">
            <h3>RoleSelect - 角色选择器</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="选择角色">
                <role-select v-model:value="roleId" />
              </a-descriptions-item>
              <a-descriptions-item label="选择角色 - 多选">
                <role-select multiple v-model:value="roleIds" />
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
  import { RoleSelect } from '/@/components/Role';
  export default defineComponent({
    components: {
      RoleSelect,
      PageWrapper,
      BasicForm,
    },
    setup() {
      const roleId = ref<string>('1531819854540070914');
      const roleIds = ref<string[]>(['1531819854540070914', '1531819907467993089']);

      const schemas: FormSchema[] = [
        {
          field: 'roleSelect',
          label: '选择角色',
          component: 'RoleSelect',
        },
        {
          field: 'roleSelectMultiple',
          label: '选择角色 - 多选',
          component: 'RoleSelect',
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

      const formModel = {
        roleSelect: '1531819854540070914',
        roleSelectMultiple: ['1531819854540070914', '1531819907467993089'],
      };

      onMounted(() => {
        setFieldsValue(formModel);
      });

      return {
        roleId,
        roleIds,
        register,
      };
    },
  });
</script>
<style lang="less">
  .role-wrapper {
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
