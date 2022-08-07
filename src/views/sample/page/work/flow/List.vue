<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sample:work:flow:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sample:work:flow:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <a-button-export
          :loading="exportBtnLoading"
          auth="sample:general:select"
          @click="handelExportData"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'startDate'">
          {{ formatToDate(record.startDate, 'MM-DD HH:mm') }} ~
          {{ formatToDate(record.endDate, 'MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-start
              small
              v-if="!record.processInstanceId"
              model-key="leave"
              :business-key="record.id"
              :business-title="record.reason"
              :business-details-path="`/sample/page/work/flow/Info.vue`"
              @success="reload"
            />
            <a-button-progress small v-if="record.processInstanceId" :business-key="record.id" />
            <template
              v-if="
                record.processInstanceId != null &&
                record.workFlowStatus !== '已办结' &&
                record.workFlowStatus !== '已撤销'
              "
            >
              <a-divider type="vertical" />
              <a-button-revoke small :business-key="record.id" :reason="true" @success="reload" />
            </template>
            <a-divider type="vertical" />
            <a-button-edit small auth="sample:work:flow:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sample:work:flow:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SampleWorkFlowInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/sample/page/work/flow/flow.data';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonEdit,
    AButtonExport,
    AButtonStart,
    AButtonProgress,
    AButtonRevoke,
  } from '/@/components/Button';
  import { downloadFileById } from '/@/utils/file/download';
  import { SampleWorkFlow } from '/@/api/sample/model/sampleWorkFlowModel';
  import { add, remove, select, get, exportData } from '/@/api/sample/work/sampleWorkFlow';
  import SampleWorkFlowInput from '/@/views/sample/page/work/flow/Input.vue';
  import { PageWrapper } from '/@/components/Page';
  import { formatToDate } from '/@/utils/dateUtil';

  export default defineComponent({
    name: 'SamplePageWorkFlowList',
    components: {
      AButtonRevoke,
      AButtonProgress,
      AButtonStart,
      PageWrapper,
      SampleWorkFlowInput,
      AButtonAdd,
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

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '流程示例',
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

      const handelExportData = async () => {
        exportBtnLoading.value = true;
        try {
          await exportData(searchInfo as SampleWorkFlow).then((id) => {
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
        registerDrawer,
        registerTable,
        handleCreate,
        handleEdit,
        reload,
        formatToDate,
      };
    },
  });
</script>
