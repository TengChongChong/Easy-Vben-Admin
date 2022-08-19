<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable row-key="processInstanceId" :searchInfo="searchInfo" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'taskStatus'">
          <dict-tag
            v-if="record.deleteReason != null && record.deleteReason !== ''"
            dictType="taskStatus"
            :value="TaskStatus.RESCINDED"
          />
          <dict-tag
            v-else-if="record.endTime == null"
            dictType="taskStatus"
            :value="TaskStatus.IN_PROCESS"
          />
          <dict-tag v-else dictType="taskStatus" :value="TaskStatus.COMPLETED" />
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-progress
              small
              :execution-id="record.executionId"
              :process-instance-id="record.processInstanceId"
            />
            <template v-if="record.deleteReason == null && record.endTime == null">
              <a-divider type="vertical" />
              <a-button-revoke
                small
                :process-instance-id="record.processInstanceId"
                :reason="true"
                @success="reload"
              />
            </template>
          </div>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, nextTick, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns } from '/@/views/activiti/history/task-instance/all/list.data';
  import { PageWrapper } from '/@/components/Page';
  import { selectMy } from '/@/api/activiti/activitiHistoryTaskInstance';
  import { AButtonProgress, AButtonRevoke } from '/@/components/Button';
  import { DictTag } from '/@/components/Dict';
  import { TaskStatus } from '/@/views/activiti/history/task-instance/participate/list.data';
  export default defineComponent({
    name: 'ActivitiHistoryTaskInstanceMyList',
    components: {
      AButtonRevoke,
      DictTag,
      AButtonProgress,
      PageWrapper,
      BasicTable,
    },
    setup() {
      // 查询条件
      const searchInfo = reactive<Recordable>({});

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '我发起的',
        api: selectMy,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: [
            {
              field: 'taskStatus',
              label: '任务状态',
              component: 'DictSelect',
              componentProps: {
                dictType: 'taskStatus',
                onChange() {
                  reloadTable();
                },
              },
            },
            {
              field: 'processInstanceId',
              label: '流水号',
              component: 'Input',
            },
            {
              field: 'businessTitle',
              label: '业务',
              component: 'Input',
            },
          ],
        },
        actionColumn: {
          width: 100,
          title: '操作',
          key: 'action',
        },
      });

      const reloadTable = () => {
        nextTick(() => {
          reload();
        });
      };

      return {
        TaskStatus,
        searchInfo,
        registerTable,
        reload,
      };
    },
  });
</script>
