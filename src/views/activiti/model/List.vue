<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="activiti:model:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="activiti:model:remove"
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
            <Authority value="activiti:model:save">
              <a-tooltip>
                <template #title>流程编辑</template>
                <a-button type="link" size="small" @click="handleEdit(record.id)">
                  <template #icon>
                    <Icon icon="ant-design:edit-outlined" />
                  </template>
                </a-button>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip>
                <template #title>部署流程</template>
                <a-button type="link" size="small" @click="handleDeploymentProcess(record.id)">
                  <template #icon>
                    <Icon icon="ant-design:check-outlined" />
                  </template>
                </a-button>
              </a-tooltip>
              <a-divider type="vertical" />
            </Authority>
            <a-tooltip>
              <template #title>导出模型</template>
              <a-button type="link" size="small" @click="handleExportXml(record.id)">
                <template #icon>
                  <Icon icon="ant-design:download-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="activiti:model:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <ActivitiModelInput @register="registerModal" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { remove, select, exportXml, deploymentProcess } from '/@/api/activiti/activitiModel';
  import { searchFormSchema, columns } from '/@/views/activiti/model/model.data';
  import { AButtonAdd, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import ActivitiModelInput from '/@/views/activiti/model/Input.vue';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';
  import { downloadFileById } from '/@/utils/file/download';
  import { message } from 'ant-design-vue/lib/components';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    name: 'ActivitiModelList',
    components: {
      Icon,
      PageWrapper,
      ActivitiModelInput,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      BasicTable,
      Authority,
    },
    setup() {
      const go = useGo();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});

      const [registerModal, { openModal }] = useModal();

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

      function handleCreate() {
        openModal(true, {});
      }

      function handleEdit(id: string) {
        go(`/activiti/model/edit/${id}`);
      }

      const handleExportXml = (id: string) => {
        exportXml(id).then((downloadId) => {
          downloadFileById(downloadId);
        });
      };

      const handleDeploymentProcess = (id: string) => {
        deploymentProcess(id).then((res) => {
          if (res) {
            message.success('部署成功');
          }
        });
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
        handleCreate,
        handleEdit,
        handleExportXml,
        handleDeploymentProcess,
        reload,
      };
    },
  });
</script>
