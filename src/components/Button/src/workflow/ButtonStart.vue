<template>
  <span>
    <a-button v-if="!small" type="primary" :loading="loading" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:check-outlined" />
      </template>
      {{ text }}
    </a-button>
    <a-tooltip v-else>
      <template #title>{{ text }}</template>
      <a-button type="link" :loading="loading" size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:check-outlined" />
        </template>
      </a-button>
    </a-tooltip>

    <FormModal @register="registerModal" @success="handleSuccess" />
  </span>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { getProcessDefinitionId } from '/@/api/activiti/activitiModel';
  import { startProcessInstance } from '/@/api/activiti/activitiProcessDefinition';
  import FormModal from './modal/FormModal.vue';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    name: 'AButtonStart',
    components: { Icon, FormModal },
    props: {
      small: propTypes.bool,
      // 按钮文字
      text: propTypes.string.def('提交'),
      // 拓展参数
      params: propTypes.object.def(),
      // 流程模型标识
      modelKey: propTypes.string.isRequired,
      // 业务数据ID
      businessKey: propTypes.string.isRequired,
      // 业务标题
      businessTitle: propTypes.string.isRequired,
      // 业务数据详情url
      businessDetailsPath: propTypes.string.isRequired,
    },
    emits: ['success'],
    setup(props, { emit }) {
      const loading = ref<boolean>(false);
      const processDefinitionId = ref<string>();

      const [registerModal, { openModal }] = useModal();

      const handleClick = async () => {
        loading.value = true;

        if (!unref(processDefinitionId)) {
          try {
            processDefinitionId.value = await getProcessDefinitionId(props.modelKey);
          } catch (e) {
            // 未部署或挂起
            loading.value = false;
            return;
          }
        }
        const { businessKey, businessTitle, businessDetailsPath, params } = props;
        startProcessInstance({
          processDefinitionId: unref(processDefinitionId) as string,
          hasFormData: false,
          extentParams: params,
          businessKey,
          businessTitle,
          businessDetailsPath,
        }).then((res) => {
          loading.value = false;
          if (res.hasStartForm) {
            console.log('startFormData', res.startFormData);
            openModal(true, {
              processDefinition: {
                processDefinitionId: unref(processDefinitionId) as string,
                extentParams: params,
                businessKey,
                businessTitle,
                businessDetailsPath,
              },
              startFormData: res.startFormData,
            });
          } else {
            message.success('流程已启动');
            handleSuccess();
          }
        });
      };

      function handleSuccess() {
        emit('success');
      }

      return {
        loading,
        handleClick,
        registerModal,
        handleSuccess,
      };
    },
  });
</script>
