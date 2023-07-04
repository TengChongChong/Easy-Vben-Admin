<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="用户"
    width="30%"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm" />

    <template #appendFooter>
      <a-button-save @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { add, save } from '/@/api/auth/sysUser';
  import { SysUser } from '/@/api/auth/model/sysUserModel';
  import { AButtonSave } from '/@/components/Button';
  import { checkPassword } from '/@/utils/validator';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SysUserInput',
    components: { AButtonSave, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const deptId = ref();

      const [
        registerForm,
        { resetFields, setFieldsValue, validate, updateSchema, getFieldsValue },
      ] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'nickname',
            label: '昵称',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '昵称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'username',
            label: '账号',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'password',
            label: '密码',
            component: 'InputPassword',
            rules: [],
            componentProps: {
              autocomplete: 'new-password',
            },
            show: ({ values }) => !values.id,
          },
          {
            field: 'roleIdList',
            label: '角色',
            required: true,
            component: 'RoleSelect',
            componentProps: {
              multiple: true,
              type: 'deptId',
            },
          },
          {
            field: 'sex',
            label: '性别',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'sex',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'status',
            label: '状态',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'phoneNumber',
            label: '手机号',
            component: 'Input',
            rules: [{ max: 32, message: '手机号不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'email',
            label: '邮箱',
            component: 'Input',
            rules: [{ max: 32, message: '邮箱不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'birthday',
            label: '生日',
            component: 'DatePicker',
          },
          {
            field: 'source',
            label: '来源',
            component: 'Input',
            rules: [{ max: 32, message: '来源不能超过32个字符', trigger: 'blur' }],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        await setForm(data);
      });

      async function setForm(data) {
        changeLoading(true);

        // 重置表单
        await resetFields();
        deptId.value = data?.deptId;
        await updateSchema({
          field: 'roleIdList',
          componentProps: {
            type: 'deptId',
            deptId: deptId.value,
          },
        });

        if (data.id) {
          // 不允许在此页面修改密码
          await updateSchema({
            field: 'password',
            rules: [],
          });
        } else {
          await updateSchema({
            field: 'password',
            rules: [{ required: true, validator: checkPassword, trigger: 'change' }],
          });
        }

        await setFieldsValue(data);
        changeLoading(false);
      }

      async function handleSubmit(callback: (_: SysUser) => any) {
        try {
          changeLoading(true);
          await validate();
          const values = getFieldsValue();

          await save({
            ...values,
            deptId: unref(deptId),
          }).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      async function handleSave() {
        await handleSubmit((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit((res) => {
          add(res.deptId!).then(async (data) => {
            await setForm(data);
          });
        });
      }

      return {
        registerDrawer,
        registerForm,
        handleSave,
        handleSaveAndAdd,
      };
    },
  });
</script>
