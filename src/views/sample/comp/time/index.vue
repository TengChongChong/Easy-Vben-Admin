<template>
  <PageWrapper>
    <a-card title="基础示例" :bordered="false" class="!mb-4">
      <Time :value="time1" />
      <br />
      <Time :value="time2" />
    </a-card>

    <a-card title="定时更新" :bordered="false" class="!mb-4">
      <Time :value="now" :step="1" />
      <br />
      <Time :value="now" :step="5" />
    </a-card>

    <a-card title="定时更新" :bordered="false">
      <Time :value="now" mode="date" />
      <br />
      <Time :value="now" mode="datetime" />
      <br />
      <Time :value="now" />
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Time } from '/@/components/Time';

  export default defineComponent({
    components: { PageWrapper, Time },
    setup() {
      const now = new Date().getTime();
      const state = reactive({
        time1: now - 60 * 3 * 1000,
        time2: now - 86400 * 3 * 1000,
      });
      return {
        ...toRefs(state),
        now,
      };
    },
  });
</script>
