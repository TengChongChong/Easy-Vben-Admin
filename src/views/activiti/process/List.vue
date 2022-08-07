<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      row-key="deploymentId"
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-remove-batch
          auth="activiti:process:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'version'">
          <a-tag color="blue">v.{{ record.version }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-tooltip>
              <template #title>查看流程图</template>
              <a-button type="link" size="small" @click="handleOpenProcessModal(record)">
                <template #icon>
                  <Icon icon="ant-design:apartment-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <Authority value="activiti:process:suspend" v-if="record.suspensionState === 1">
              <a-popconfirm
                title="挂起流程将同时挂起流程相关的任务"
                ok-text="是"
                cancel-text="否"
                @confirm="handleSuspend(record.processDefinitionId, true)"
              >
                <a-tooltip>
                  <template #title>挂起流程</template>
                  <a-button danger type="link" size="small">
                    <template #icon>
                      <Icon icon="ant-design:pause-outlined" />
                    </template>
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
              <a-divider type="vertical" />
            </Authority>
            <Authority value="activiti:process:activation" v-if="record.suspensionState === 2">
              <a-popconfirm
                title="激活流程将同时激活流程相关的任务"
                ok-text="是"
                cancel-text="否"
                @confirm="handleActivation(record.processDefinitionId, true)"
              >
                <a-tooltip>
                  <template #title>激活流程</template>
                  <a-button type="link" size="small">
                    <template #icon>
                      <Icon icon="ant-design:check-outlined" />
                    </template>
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
              <a-divider type="vertical" />
            </Authority>
            <Authority value="activiti:process:save">
              <a-tooltip>
                <template #title>另存为模型</template>
                <a-button type="link" size="small" @click="handleConvertToModel(record)">
                  <template #icon>
                    <Icon icon="ant-design:save-outlined" />
                  </template>
                </a-button>
              </a-tooltip>
              <a-divider type="vertical" />
            </Authority>
            <a-button-remove
              small
              auth="activiti:process:remove"
              :id="record.deploymentId"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <ActivitiProcessInput @register="registerModal" @success="reload" />
    <!-- 流程图 -->
    <ActivitiProcessModal @register="registerProcessModal" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { remove, select, suspend, activation } from '/@/api/activiti/activitiProcess';
  import { searchFormSchema, columns } from '/@/views/activiti/process/process.data';
  import { AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import ActivitiProcessInput from '/@/views/activiti/process/Input.vue';
  import ActivitiProcessModal from '/@/views/activiti/process/ProcessModal.vue';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import { ActivitiProcess } from '/@/api/activiti/model/activitiProcessModel';
  import { message } from 'ant-design-vue/lib/components';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    name: 'ActivitiProcessList',
    components: {
      Icon,
      PageWrapper,
      ActivitiProcessInput,
      ActivitiProcessModal,
      AButtonRemoveBatch,
      AButtonRemove,
      BasicTable,
      Authority,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});

      const globSetting = useGlobSetting();

      const [registerModal, { openModal }] = useModal();
      const [registerProcessModal, { openModal: openProcessModal }] = useModal();

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '流程模型',
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
       * 流程转模型
       * @param record
       */
      const handleConvertToModel = (record: ActivitiProcess) => {
        const { key, name, description } = record;
        openModal(true, { key, name, description });
      };

      /**
       * 挂起流程
       *
       * @param processDefinitionId     流程id
       * @param suspendProcessInstances 如果为true，将同时挂起此流程正在进行的任务
       */
      const handleSuspend = (processDefinitionId, suspendProcessInstances) => {
        suspend(processDefinitionId, suspendProcessInstances).then(() => {
          message.success('流程已挂起');
          reload();
        });
      };

      /**
       * 激活流程
       *
       * @param processDefinitionId     流程id
       * @param suspendProcessInstances 如果为true，将同时激活此流程正在进行的任务
       */
      const handleActivation = (processDefinitionId, suspendProcessInstances) => {
        activation(processDefinitionId, suspendProcessInstances).then(() => {
          message.success('流程已激活');
          reload();
        });
      };

      /**
       * 查看流程图
       *
       * @param deploymentId 部署id
       * @param dgrmResourceName 资源名
       */
      const handleOpenProcessModal = ({ deploymentId, dgrmResourceName }) => {
        openProcessModal(
          true,
          `${globSetting.apiUrl}/api/activiti/process/${deploymentId}/${dgrmResourceName}/image/stream`,
        );
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        searchInfo,
        remove,
        registerModal,
        registerTable,
        handleConvertToModel,
        handleSuspend,
        handleActivation,
        registerProcessModal,
        handleOpenProcessModal,
        reload,
      };
    },
  });
</script>
