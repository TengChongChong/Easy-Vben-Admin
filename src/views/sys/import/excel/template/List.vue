<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add @click="handleCreate" />
        <a-button-remove-batch :id="checkedKeys" :api="remove" @success="reload" />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove small :id="record.id" :api="remove" @success="reload" />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>导入配置</template>
              <a-button type="link" size="small" @click="handleDetailsConfig(record)">
                <template #icon>
                  <Icon icon="ant-design:setting-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>下载模版</template>
              <a-button type="link" size="small" @click="handleDownload(record.importCode)">
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
    <SysImportExcelTemplateInput @register="registerDrawer" @success="reload" />

    <SysImportExcelTemplateDetailsConfig @register="registerDetailsConfigDrawer" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/sys/import/excel/template/template.data';
  import { Icon } from '/@/components/Icon';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonRemove, AButtonRemoveBatch, AButtonEdit } from '/@/components/Button';
  import { remove, select, get, downloadTemplate } from '/@/api/sys/sysImportExcelTemplate';
  import SysImportExcelTemplateInput from '/@/views/sys/import/excel/template/Input.vue';
  import SysImportExcelTemplateDetailsConfig from '/@/views/sys/import/excel/template/DetailsConfig.vue';
  import { PageWrapper } from '/@/components/Page';
  import { downloadFileById } from '/@/utils/file/download';

  export default defineComponent({
    name: 'SysImportExcelTemplateList',
    components: {
      PageWrapper,
      SysImportExcelTemplateInput,
      SysImportExcelTemplateDetailsConfig,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      BasicTable,
      Icon,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();

      const [registerDetailsConfigDrawer, { openDrawer: openDetailsConfigDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '导入模板',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 180,
          title: '操作',
          key: 'action',
        },
      });

      function handleCreate() {
        openDrawer(true, { startRow: 1 });
      }

      function handleEdit(id: string) {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      }

      function handleDetailsConfig(data) {
        openDetailsConfigDrawer(true, data);
      }

      function handleDownload(importCode) {
        downloadTemplate(importCode).then((res) => {
          downloadFileById(res);
        });
      }

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        registerDetailsConfigDrawer,
        registerDrawer,
        registerTable,
        handleCreate,
        handleEdit,
        handleDetailsConfig,
        handleDownload,
        reload,
      };
    },
  });
</script>
