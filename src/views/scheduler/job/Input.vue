<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="定时任务"
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
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { save, add } from '/@/api/scheduler/schedulerJob';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { SchedulerJob } from '/@/api/scheduler/model/SchedulerJobModel';
  import { AButtonSave } from '/@/components/Button';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SchedulerJobInput',
    components: { AButtonSave, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'code',
            label: '代码',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '代码不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'cron',
            label: 'cron',
            component: 'Input',
            required: true,
            rules: [{ max: 64, message: '代码不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'bean',
            label: '类',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '类不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'method',
            label: '方法',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '方法不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'sys',
            label: '是否系统',
            required: true,
            auth: RoleEnum.SYS_ADMIN,
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'status',
            label: '状态',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'schedulerJobStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'remarks',
            label: '备注',
            component: 'InputTextArea',
            rules: [{ max: 900, message: '备注不能超过900个字符', trigger: 'blur' }],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        changeLoading(true);
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      async function handleSubmit(callback: (_: SchedulerJob) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as SchedulerJob).then((res) => {
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
        await handleSubmit(() => {
          // 重置表单
          resetFields();
          add().then((data) => {
            setFieldsValue({ ...data });
          });

          changeLoading(false);
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
