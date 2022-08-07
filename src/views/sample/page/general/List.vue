<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sample:general:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sample:general:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <a-button-import import-code="sample:general" />
        <a-button-export
          :loading="exportBtnLoading"
          auth="sample:general:select"
          @click="handelExportData"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="sample:general:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sample:general:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SampleGeneralInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/sample/page/general/general.data';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonEdit,
    AButtonImport,
    AButtonExport,
  } from '/@/components/Button';
  import { downloadFileById } from '/@/utils/file/download';
  import { SampleGeneral } from '/@/api/sample/model/sampleGeneralModel';
  import { add, remove, select, get, exportData } from '/@/api/sample/sampleGeneral';
  import SampleGeneralInput from '/@/views/sample/page/general/Input.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SamplePageGeneralList',
    components: {
      PageWrapper,
      SampleGeneralInput,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonImport,
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
        title: '代码生成示例',
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
          openDrawer(true, data);
        });
      };

      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      };

      const handelExportData = async () => {
        exportBtnLoading.value = true;
        try {
          await exportData(searchInfo as SampleGeneral).then((id) => {
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
      };
    },
  });
</script>
