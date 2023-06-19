<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="cms:site:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="cms:site:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <Authority value="cms:site:save" @click="handleCreate">
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
        <a-button-export
          :loading="exportBtnLoading"
          auth="cms:site:select"
          @click="handelExportData"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-add-sub small auth="cms:site:save" :id="record.id" @click="handleCreate" />
            <a-divider type="vertical" />
            <a-button-edit small auth="cms:site:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="cms:site:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <CmsSiteInput @register="registerDrawer" @success="reload" />
    <CmsSiteOrder @register="registerOrderDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { clearTreeEmptyChildren, listToTree } from '/@/utils/helper/treeHelper';
  import { searchFormSchema, columns } from '/@/views/cms/site/site.data';
  import { Icon } from '/@/components/Icon';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonEdit,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonExport,
    AButtonAddSub,
  } from '/@/components/Button';
  import { downloadFileById } from '/@/utils/file/download';
  import { Authority } from '/@/components/Authority';
  import { add, remove, select, get, exportData } from '/@/api/cms/cmsSite';
  import CmsSiteInput from '/@/views/cms/site/Input.vue';
  import CmsSiteOrder from '/@/views/cms/site/Order.vue';

  export default defineComponent({
    name: 'CmsSiteList',
    components: {
      AButtonAddSub,
      PageWrapper,
      Authority,
      Icon,
      CmsSiteInput,
      CmsSiteOrder,
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
      // 排序
      const [registerOrderDrawer, { openDrawer: openOrderDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm, expandAll, collapseAll }] = useTable({
        title: '站点',
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
          width: 120,
          title: '操作',
          key: 'action',
        },
      });

      // onActivated()

      /**
       * 新增
       *
       * @param id 上级id
       */
      const handleCreate = (id: string | undefined) => {
        add(id).then((data) => {
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
