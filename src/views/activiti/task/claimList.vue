<template>
  <activiti-task-list status="waitingClaim" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import ActivitiTaskList from '/@/views/activiti/task/List.vue';
  export default defineComponent({
    name: 'ActivitiTaskClaimList',
    components: {
      ActivitiTaskList,
    },
  });
</script>
