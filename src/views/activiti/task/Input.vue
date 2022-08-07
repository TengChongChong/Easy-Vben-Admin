<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="任务办理"
    okText="提交"
    width="80%"
    @ok="handleSubmit"
  >
    <div class="task-input">
      <div class="p-4">
        <component
          v-if="businessKey && businessDetailsComponent"
          :is="businessDetailsComponent"
          :id="businessKey"
        />
        <a-descriptions class="mb-4" :column="2" bordered>
          <a-descriptions-item label="发起人">
            [{{ taskInfo?.applyUser?.dept?.name }}]
            {{ taskInfo?.applyUser?.nickname }}
          </a-descriptions-item>
          <a-descriptions-item label="发起时间">
            {{ formatToDateTime(taskInfo?.createDate) }}
          </a-descriptions-item>
        </a-descriptions>

        <div
          class="ant-descriptions-header"
          v-if="taskInfo?.taskFormData && taskInfo?.taskFormData.length"
        >
          <div class="ant-descriptions-title">审核</div>
        </div>

        <div class="task-form">
          <BasicForm @register="registerForm" />
        </div>
      </div>
    </div>
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, ref } from 'vue';
  import { completeTask, getTaskInfo } from '/@/api/activiti/activitiTask';
  import { ActivitiTaskInfo } from '/@/api/activiti/model/activitiTaskInfoModel';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { ActivitiFormProperty } from '/@/api/activiti/model/activitiProcessDefinition';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { Icon } from '/@/components/Icon';
  import { message } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  export default defineComponent({
    name: 'ActivitiTaskInput',
    components: { BasicDrawer, BasicForm, Icon },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const businessDetailsComponent = ref();
      const businessKey = ref<string>();
      const taskInfo = ref<ActivitiTaskInfo>();

      let taskId: Nullable<string> = null;

      // 引入Info组件，用于显示业务表单
      const modules = import.meta.glob('../../**/Info.vue');

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (id) => {
        taskId = id;
        businessDetailsComponent.value = null;
        getTaskInfo(taskId!).then((res) => {
          taskInfo.value = res;
          businessKey.value = res.businessKey;

          if (res.taskFormData && res.taskFormData.length) {
            const schemas: FormSchema[] = [];
            res.taskFormData.map((item) => {
              schemas.push(convertFormSchema(item));
            });
            setProps({ schemas });
          }

          businessDetailsComponent.value = defineAsyncComponent(
            // @ts-ignore
            modules[`../..${res.variables.businessDetailsPath}`],
          );
        });
      });

      const [registerForm, { validate, setProps }] = useForm({
        labelWidth: 140,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      /**
       * 办理
       */
      async function handleSubmit() {
        try {
          const values = await validate();
          changeLoading(true);
          await completeTask(taskId!, values).then((res) => {
            if (res) {
              message.success('办理成功');
              emit('success');
              closeDrawer();
            }
          });
        } catch (e) {
          console.error(e);
        } finally {
          changeLoading(false);
        }
      }

      /**
       * 将工作流中的表单转为BasicForm所需格式
       *
       * @param formProperty
       */
      function convertFormSchema(formProperty: ActivitiFormProperty) {
        const formSchema: FormSchema = {
          field: formProperty.id,
          label: formProperty.name,
          required: formProperty.required,
          component: 'Input',
        };

        switch (formProperty.typeCode) {
          case 'enum':
            formSchema.component = 'RadioGroup';
            const options = [];
            for (let key in formProperty.values) {
              // @ts-ignore
              options.push({ value: key, label: formProperty.values[key] });
            }
            formSchema.componentProps = { options };
            break;
          case 'boolean':
            formSchema.component = 'RadioGroup';
            formSchema.componentProps = {
              options: [
                { value: true, label: 'true' },
                { value: false, label: 'false' },
              ],
            };
            break;
          case 'date':
            formSchema.component = 'DatePicker';
            formSchema.componentProps = {
              format: formProperty.datePattern,
              showTime: getShowTime(formProperty.datePattern),
            };
            break;
          case 'long':
            formSchema.component = 'InputNumber';
            break;
        }
        return formSchema;
      }

      /**
       * 获取是否要显示时间
       *
       * @param datePattern 时间格式
       */
      function getShowTime(datePattern: string) {
        if (!datePattern) {
          return false;
        }
        return datePattern.indexOf('H') > -1 || datePattern.indexOf('h') > -1;
      }

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        taskInfo,
        businessKey,
        businessDetailsComponent,
        formatToDateTime,
      };
    },
  });
</script>
<style lang="less">
  .task-input {
    .ant-descriptions {
      .ant-descriptions-view:first-child {
        border-top: 0;
      }

      .ant-descriptions-item-label {
        width: 140px;
        text-align: right;
      }
    }
  }
</style>
