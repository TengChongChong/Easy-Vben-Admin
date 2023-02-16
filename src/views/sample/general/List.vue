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
        <Authority value="sys:dept:save">
          <a-button @click="handleOrder">
            <template #icon> <Icon icon="ant-design:ordered-list-outlined" /> </template> 排序
          </a-button>
        </Authority>

        <a-button @click="expandAll">
          <template #icon> <Icon icon="ant-design:plus-outlined" /> </template> 展开全部
        </a-button>
        <a-button @click="collapseAll">
          <template #icon> <Icon icon="ant-design:minus-outlined" /> </template>折叠全部
        </a-button>
        <a-button-import auth="sample:general:import:data" import-code="sample:general" />
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
    <SampleGeneralOrder @register="registerOrderDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { clearTreeEmptyChildren, listToTree } from '/@/utils/helper/treeHelper';
  import { searchFormSchema, columns } from '/@/views/sample/general/general.data';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonEdit,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonImport,
    AButtonExport,
  } from '/@/components/Button';
  import { downloadFileById } from '/@/utils/file/download';
  import { add, remove, select, get, exportData } from '/@/api/sample/sampleGeneral';
  import SampleGeneralInput from '/@/views/sample/general/Input.vue';
  import SampleGeneralOrder from '/@/views/sample/general/Order.vue';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'SampleGeneralList',
    components: {
      Icon,
      PageWrapper,
      SampleGeneralInput,
      SampleGeneralOrder,
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
      // 排序
      const [registerOrderDrawer, { openDrawer: openOrderDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm, expandAll, collapseAll }] = useTable({
        title: '代码生成示例',
        api: select,
        afterFetch: (items) => {
          const tree = listToTree(items);
          return clearTreeEmptyChildren(tree, 'children');
        },
        isTreeTable: true,
        pagination: false,
        showIndexColumn: false,
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

      /**
       * 排序
       */
      const handleOrder = () => {
        openOrderDrawer(true, {});
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
        registerDrawer,
        registerTable,
        registerOrderDrawer,
        openOrderDrawer,
        handleCreate,
        handleEdit,
        reload,
        expandAll,
        collapseAll,
        handleOrder,
      };
    },
  });
</script>
