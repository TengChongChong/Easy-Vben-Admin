<template>
  <BasicModal
    v-bind="$attrs"
    :width="960"
    :min-height="260"
    @register="registerModel"
    title="审核进度"
  >
    <img class="process-img" alt="" :src="imgSrc" />
    <a-divider>流程记录</a-divider>
    <a-timeline>
      <template v-for="item in activitiTaskList" :key="item.id">
        <a-timeline-item
          v-if="['startEvent', 'userTask', 'endEvent'].indexOf(item.activityType) > -1"
        >
          <template #dot>
            <Icon
              v-if="item.activityType === 'startEvent'"
              icon="ant-design:play-circle-outlined"
            />
            <Icon v-if="item.activityType === 'userTask'" icon="ant-design:user-outlined" />
            <Icon v-if="item.activityType === 'endEvent'" icon="ant-design:check-outlined" />
          </template>
          {{ item.activityName }}
          {{
            item.assignee ? `[${item.assignee}]` : item.activityType === 'userTask' ? '未签收' : ''
          }}
          <a-tag color="blue">
            {{ formatToNow(item.startTime) }}
          </a-tag>
        </a-timeline-item>
      </template>
    </a-timeline>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import { ActivitiTask } from '/@/api/activiti/model/activitiTaskModel';
  import { selectHistoric } from '/@/api/activiti/activitiHistoric';
  import { formatToNow } from '/@/utils/dateUtil';

  export default defineComponent({
    name: 'ActivitiProcessModal',
    components: { BasicModal, Icon },
    emits: ['register'],
    setup() {
      const imgSrc = ref<string>();
      const activitiTaskList = ref<ActivitiTask[]>([]);

      const [registerModel] = useModalInner(async ({ url, processInstanceId }) => {
        imgSrc.value = `${url}?t=${new Date().getTime()}`;

        selectHistoric(processInstanceId).then((res) => {
          activitiTaskList.value = res;
        });
      });

      return {
        imgSrc,
        activitiTaskList,
        registerModel,
        formatToNow,
      };
    },
  });
</script>
<style scoped>
  .process-img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
</style>
