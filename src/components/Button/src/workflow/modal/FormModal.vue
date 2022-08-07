<template>
  <BasicModal v-bind="$attrs" @register="register" title="发起流程">
    <BasicForm @register="registerForm" />
    <template #footer>
      <a-button @click="closeModal">
        <Icon icon="ant-design:close-outlined" />
        关闭
      </a-button>
      <a-button :loading="btnLoading" type="primary" @click="handleSubmit">
        <Icon icon="ant-design:plus-outlined" />
        提交
      </a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import {
    ActivitiFormProperty,
    ActivitiProcessDefinition,
  } from '/@/api/activiti/model/activitiProcessDefinition';
  import { startProcessInstance } from '/@/api/activiti/activitiProcessDefinition';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    components: { BasicModal, BasicForm, Icon },
    emits: ['register', 'success'],
    setup(_, { emit }) {
      const btnLoading = ref<boolean>(false);

      const activitiProcessDefinition = ref<ActivitiProcessDefinition>();

      const [registerForm, { validate, setProps }] = useForm({
        labelWidth: 100,
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [register, { closeModal }] = useModalInner(({ processDefinition, startFormData }) => {
        console.log('processDefinition', processDefinition);
        activitiProcessDefinition.value = processDefinition;

        const schemas: FormSchema[] = [];
        startFormData.map((item) => {
          schemas.push(convertFormSchema(item));
        });
        setProps({ schemas });
      });

      async function handleSubmit() {
        try {
          btnLoading.value = true;
          const values = await validate();
          const {
            processDefinitionId,
            businessKey,
            businessTitle,
            businessDetailsPath,
            extentParams,
          } = activitiProcessDefinition.value!;
          await startProcessInstance({
            processDefinitionId,
            hasFormData: true,
            extentParams: Object.assign(extentParams || {}, values),
            businessKey,
            businessTitle,
            businessDetailsPath,
          }).then(() => {
            emit('success');
            closeModal();
            message.success('流程已启动');
          });
        } catch (e) {
          console.error(e);
        } finally {
          btnLoading.value = false;
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
            formSchema.component = 'Select';
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

      return { btnLoading, register, registerForm, closeModal, handleSubmit };
    },
  });
</script>
