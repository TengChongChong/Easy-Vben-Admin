<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable row-key="processInstanceId" :searchInfo="searchInfo" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-tooltip v-if="'waitingClaim' === page">
              <template #title>签收</template>
              <a-button type="link" size="small" @click="handleClaimTask(record.id)">
                <template #icon>
                  <Icon icon="ant-design:check-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <template v-if="'claimed' === page">
              <a-tooltip>
                <template #title>办理</template>
                <a-button type="link" size="small" @click="handleTask(record.id)">
                  <template #icon>
                    <Icon icon="ant-design:form-outlined" />
                  </template>
                </a-button>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-button-progress
                small
                :execution-id="record.executionId"
                :process-instance-id="record.processInstanceId"
              />
            </template>
          </div>
        </template>
      </template>
    </BasicTable>

    <ActivitiTaskInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/activiti/task/list.data';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import { claimTask, select } from '/@/api/activiti/activitiTask';
  import { propTypes } from '/@/utils/propTypes';
  import { message } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import ActivitiTaskInput from './Input.vue';
  import { AButtonProgress } from '/@/components/Button';

  export default defineComponent({
    name: 'ActivitiTaskList',
    components: {
      AButtonProgress,
      ActivitiTaskInput,
      PageWrapper,
      BasicTable,
      Icon,
    },
    props: {
      title: propTypes.string.def('待办任务'),
      status: propTypes.string.def('claimed'),
    },
    setup(props) {
      // 查询条件
      const searchInfo = reactive<Recordable>({});

      const [registerDrawer, { openDrawer }] = useDrawer();

      onMounted(() => {
        if (props.status) {
          searchInfo.status = props.status;
        }
      });

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: props.title,
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      /**
       * 签收任务
       *
       * @param id id
       */
      function handleClaimTask(id) {
        claimTask(id).then((res) => {
          if (res) {
            message.success('任务签收成功');
            reload();
          }
        });
      }

      /**
       * 办理任务
       *
       * @param id id
       */
      function handleTask(id) {
        openDrawer(true, id);
      }

      return {
        registerDrawer,
        page: props.status,
        searchInfo,
        registerTable,
        handleClaimTask,
        handleTask,
        reload,
      };
    },
  });
</script>
