<template>
  <a-descriptions title="流程示例" :column="2" bordered>
    <a-descriptions-item label="请假类型">
      <dict-tag dictType="leaveType" :value="sampleWorkFlow.leaveType" />
    </a-descriptions-item>
    <a-descriptions-item label="请假时间">
      {{ formatToDate(sampleWorkFlow.startDate, 'MM-DD HH:mm') }} ~
      {{ formatToDate(sampleWorkFlow.endDate, 'MM-DD HH:mm') }}
    </a-descriptions-item>
    <a-descriptions-item label="原因" :colspan="2">
      {{ sampleWorkFlow.reason }}
    </a-descriptions-item>
  </a-descriptions>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { get } from '/@/api/sample/work/sampleWorkFlow';
  import { SampleWorkFlow } from '/@/api/sample/model/sampleWorkFlowModel';
  import { propTypes } from '/@/utils/propTypes';
  import { DictTag } from '/@/components/Dict';
  import { formatToDate } from '/@/utils/dateUtil';
  export default defineComponent({
    name: 'SamplePageWorkFlowInput',
    components: { DictTag },
    props: {
      id: propTypes.string.isRequired,
    },
    setup(props) {
      const sampleWorkFlow = ref<SampleWorkFlow>({});

      watch(
        () => props.id,
        () => getInfo(),
      );

      getInfo();
      function getInfo() {
        get(props.id).then((res) => {
          sampleWorkFlow.value = res;
        });
      }

      return { sampleWorkFlow, formatToDate };
    },
  });
</script>
