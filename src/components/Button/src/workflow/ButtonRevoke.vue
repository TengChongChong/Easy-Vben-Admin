<template>
  <span>
    <a-button v-if="!small" type="danger" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:rollback-outlined" />
      </template>
      {{ text }}
    </a-button>
    <a-tooltip v-else>
      <template #title>{{ text }}</template>
      <a-button type="link" danger size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:rollback-outlined" />
        </template>
      </a-button>
    </a-tooltip>

    <ReasonModal @register="registerModal" @success="handleSuccess" />
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import ReasonModal from './modal/ReasonModal.vue';
  import { useModal } from '/@/components/Modal';
  import { selectTask } from '/@/api/activiti/activitiHistoric';
  import { revoke } from '/@/api/activiti/activitiTask';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'AButtonRevoke',
    components: { Icon, ReasonModal },
    props: {
      small: propTypes.bool,
      // 按钮文字
      text: propTypes.string.def('撤销'),
      // 下方两组参数二选一 `processInstanceId` 或 `businessKey`
      // 流程实例ID
      processInstanceId: propTypes.string,
      // 业务Id
      businessKey: propTypes.string,
      // 是否需要填写原因
      reason: propTypes.bool.def(false),
    },
    emits: ['success'],
    setup(props, { emit }) {
      let processInstanceId: Nullable<string> = null;

      const [registerModal, { openModal }] = useModal();

      const handleClick = async () => {
        if (props.businessKey && !processInstanceId) {
          await selectTask(props.businessKey).then((res) => {
            processInstanceId = res.processInstanceId;
          });
        } else {
          processInstanceId = props.processInstanceId;
        }

        if (processInstanceId) {
          if (props.reason) {
            openModal(true, processInstanceId);
          } else {
            revoke(processInstanceId, null).then((res) => {
              if (res) {
                message.success('撤销成功');
                handleSuccess();
              }
            });
          }
        }
      };

      function handleSuccess() {
        emit('success');
      }

      return {
        handleClick,
        registerModal,
        handleSuccess,
      };
    },
  });
</script>
