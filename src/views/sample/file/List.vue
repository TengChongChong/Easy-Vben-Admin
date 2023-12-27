<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sample:file:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sample:file:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="sample:file:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sample:file:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>通过FileInfo下载</template>
              <a-button type="link" size="small" @click="handleDownload(record.id)">
                <template #icon>
                  <Icon icon="ant-design:download-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>通过下载链接下载</template>
              <a-button type="link" size="small" @click="handleGeneratorDownloadLink(record.id)">
                <template #icon>
                  <Icon icon="ant-design:download-outlined" />
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SampleFileInput @register="registerModal" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/sample/file/file.data';
  import { useModal } from '/@/components/Modal';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import { add, remove, select, get, download } from '/@/api/sample/sampleFile';
  import SampleFileInput from '/@/views/sample/file/Input.vue';
  import { downloadFileById, downloadFileInfo } from '/@/utils/file/download';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'SampleFileList',
    components: {
      Icon,
      PageWrapper,
      SampleFileInput,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      const [registerModal, { openModal }] = useModal();

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '文件示例',
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

      const handleCreate = () => {
        add().then((data) => {
          openModal(true, data);
        });
      };

      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openModal(true, data);
        });
      };

      function handleDownload(id: string) {
        downloadFileInfo(id);
      }

      function handleGeneratorDownloadLink(id: string) {
        download(id).then((downloadId) => {
          downloadFileById(downloadId);
        });
      }

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
        reload,
        handleDownload,
        handleGeneratorDownloadLink,
      };
    },
  });
</script>
