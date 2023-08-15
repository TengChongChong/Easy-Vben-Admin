<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-remove-batch
          auth="cms:feedback:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <a-button-export
          :loading="exportBtnLoading"
          auth="cms:feedback:select"
          @click="handelExportData"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="cms:feedback:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="cms:feedback:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <CmsFeedbackInput @register="registerModal" @success="reload" />

    <!--  站点切换工具  -->
    <SiteSelect />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/cms/feedback/feedback.data';
  import { useModal } from '/@/components/Modal';
  import {
    AButtonEdit,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonExport,
  } from '/@/components/Button';
  import { downloadFileById } from '/@/utils/file/download';
  import { remove, select, get, exportData } from '/@/api/cms/cmsFeedback';
  import CmsFeedbackInput from '/@/views/cms/feedback/Input.vue';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';

  export default defineComponent({
    name: 'CmsFeedbackList',
    components: {
      SiteSelect,
      PageWrapper,
      CmsFeedbackInput,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonExport,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      // 导出按钮状态
      const exportBtnLoading = ref<boolean>(false);
      const [registerModal, { openModal }] = useModal();

      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm }] = useTable({
        title: '用户反馈',
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

      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openModal(true, data);
        });
      };

      const handelExportData = async () => {
        exportBtnLoading.value = true;
        try {
          await exportData(Object.assign(searchInfo, getForm().getFieldsValue())).then((id) => {
            downloadFileById(id);
          });
        } catch (e) {
          console.error('导出数据错误', e);
        } finally {
          exportBtnLoading.value = false;
        }
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        searchInfo,
        exportBtnLoading,
        handelExportData,
        remove,
        registerModal,
        registerTable,
        handleEdit,
        reload,
      };
    },
  });
</script>
