<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="scheduler:job:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="scheduler:job:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <a-popconfirm
          title="确定要全部开始吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="handleStartAll()"
        >
          <a-button type="danger">
            <template #icon>
              <Icon icon="ant-design:check-outlined" />
            </template>
            全部开始
          </a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确定要全部暂停吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="handlePauseAll()"
        >
          <a-button type="danger">
            <template #icon>
              <Icon icon="ant-design:pause-outlined" />
            </template>
            全部暂停
          </a-button>
        </a-popconfirm>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <Authority value="scheduler:job:save">
              <a-tooltip>
                <template #title>立即执行</template>
                <a-popconfirm
                  title="确定要立即执行吗？"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="handleImmediateExecution(record.id)"
                >
                  <a-button type="link" danger size="small">
                    <template #icon>
                      <Icon icon="ant-design:play-circle-outlined" />
                    </template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </Authority>
            <a-divider type="vertical" />
            <a-button-edit small auth="scheduler:job:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="scheduler:job:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>执行日志</template>
              <a-button type="link" size="small" @click="handleOpenLogModal(record.id)">
                <template #icon>
                  <Icon icon="ant-design:profile-outlined" />
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SchedulerJobInput @register="registerDrawer" @success="reload" />
    <JobLogModal @register="registerLog" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import {
    select,
    add,
    get,
    remove,
    immediateExecution,
    startAll,
    pauseAll,
  } from '/@/api/scheduler/schedulerJob';
  import { columns, searchFormSchema } from '/@/views/scheduler/job/job.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import SchedulerJobInput from '/@/views/scheduler/job/Input.vue';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';
  import JobLogModal from '/@/views/scheduler/job/JobLogModal.vue';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    name: 'SchedulerJobList',
    components: {
      JobLogModal,
      PageWrapper,
      Authority,
      Icon,
      SchedulerJobInput,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      const { createMessage } = useMessage();
      const [registerLog, { openModal: openLogModal }] = useModal();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '定时任务',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 200,
          title: '操作',
          key: 'action',
        },
      });

      /**
       * 新增
       */
      function handleCreate() {
        add().then((data) => {
          openDrawer(true, data);
        });
      }
      function handleEdit(id: string) {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      }
      const handleImmediateExecution = (id) => {
        immediateExecution(id).then(() => {
          createMessage.success('执行成功');
          reload();
        });
      };

      const handleStartAll = () => {
        startAll().then(() => {
          createMessage.success('执行成功');
          reload();
        });
      };

      const handlePauseAll = () => {
        pauseAll().then(() => {
          createMessage.success('执行成功');
          reload();
        });
      };

      const handleOpenLogModal = (id) => {
        openLogModal(true, id);
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        registerLog,
        registerDrawer,
        registerTable,
        reload,
        handleCreate,
        handleEdit,
        handleImmediateExecution,
        handleStartAll,
        handlePauseAll,
        handleOpenLogModal,
      };
    },
  });
</script>
