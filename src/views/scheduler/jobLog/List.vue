<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable @register="registerTable" :searchInfo="searchInfo" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { select } from '/@/api/scheduler/schedulerJobLog';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'SchedulerJobList',
    components: {
      PageWrapper,
      BasicTable,
    },
    props: {
      schedulerJobId: propTypes.string,
    },
    setup(props) {
      const searchInfo = reactive<Recordable>({});

      watch(
        () => props.schedulerJobId,
        () => {
          searchInfo.schedulerJobId = props.schedulerJobId;
          reload();
        },
      );

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        api: select,
        columns: [
          {
            title: '执行时间',
            dataIndex: 'runDate',
            sorter: true,
            width: 160,
            format: 'date|YYYY-MM-DD HH:mm:ss',
          },
          {
            title: '耗时',
            dataIndex: 'timeConsuming',
            sorter: true,
            width: 150,
            customRender: ({ record }) => `${record.timeConsuming / 1000}s`,
          },
        ],
        showTableSetting: false,
      });

      return {
        searchInfo,
        registerTable,
        reload,
      };
    },
  });
</script>
