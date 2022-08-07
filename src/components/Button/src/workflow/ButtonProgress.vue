<template>
  <span>
    <a-button v-if="!small" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:apartment-outlined" />
      </template>
      {{ text }}
    </a-button>
    <a-tooltip v-else>
      <template #title>{{ text }}</template>
      <a-button type="link" size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:apartment-outlined" />
        </template>
      </a-button>
    </a-tooltip>

    <ProcessModal @register="registerModal" />
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import ProcessModal from './modal/ProcessModal.vue';
  import { useModal } from '/@/components/Modal';
  import { selectTask } from '/@/api/activiti/activitiHistoric';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    name: 'AButtonProgress',
    components: { Icon, ProcessModal },
    props: {
      small: propTypes.bool,
      // 按钮文字
      text: propTypes.string.def('查看进度'),
      // 下方两组参数二选一 `executionId+processInstanceId` 或 `businessKey`
      // 执行实例ID
      executionId: propTypes.string,
      // 流程实例ID
      processInstanceId: propTypes.string,
      // 业务Id
      businessKey: propTypes.string,
    },
    setup(props) {
      const globSetting = useGlobSetting();

      let executionId: Nullable<string> = null,
        processInstanceId: Nullable<string> = null;

      const [registerModal, { openModal }] = useModal();

      const handleClick = async () => {
        if (props.businessKey && (!executionId || !processInstanceId)) {
          await selectTask(props.businessKey).then((res) => {
            executionId = res.executionId;
            processInstanceId = res.processInstanceId;
          });
        } else {
          executionId = props.executionId;
          processInstanceId = props.processInstanceId;
        }

        if (executionId) {
          openModal(true, {
            processInstanceId,
            url: `${globSetting.apiUrl}/api/activiti/process/trace/process/progress/image/${executionId}`,
          });
        }
      };

      return {
        handleClick,
        registerModal,
      };
    },
  });
</script>
