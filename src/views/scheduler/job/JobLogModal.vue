<template>
  <BasicModal @register="register" title="执行日志">
    <List :scheduler-job-id="schedulerJobId" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import List from '/@/views/scheduler/jobLog/List.vue';
  export default defineComponent({
    components: { BasicModal, List },
    setup() {
      const schedulerJobId = ref<string>();
      const [register] = useModalInner((id) => {
        schedulerJobId.value = id;
      });

      return { register, schedulerJobId };
    },
  });
</script>
