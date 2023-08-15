<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="cms:column:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="cms:column:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <Authority value="cms:column:save">
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
        <a-button-import auth="cms:column:import:data" import-code="cms:column" />
        <a-button-export
          :loading="exportBtnLoading"
          auth="cms:column:select"
          @click="handelExportData"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <!--        <template v-if="column.key === 'coverProportion'">-->
        <!--          <template v-if="record.coverProportionWidth && record.coverProportionHeight">-->
        <!--            {{ record.coverProportionWidth }}:{{ record.coverProportionHeight }}-->
        <!--          </template>-->
        <!--          <template v-else>任意比例</template>-->
        <!--        </template>-->
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-add-sub small auth="cms:column:save" :id="record.id" @click="handleCreate" />
            <a-divider type="vertical" />
            <a-button-edit small auth="cms:column:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="cms:column:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>预览</template>
              <a target="_blank" :href="`${apiUrl}/cms/route/${record.siteId}/column/${record.id}`">
                <a-button type="link" size="small">
                  <template #icon>
                    <Icon icon="ant-design:eye-outlined" />
                  </template>
                </a-button>
              </a>
            </a-tooltip>
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <CmsColumnInput @register="registerDrawer" @success="reload" />
    <CmsColumnOrder @register="registerOrderDrawer" @success="reload" />
    <!--  站点切换工具  -->
    <SiteSelect />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { clearTreeEmptyChildren, listToTree } from '/@/utils/helper/treeHelper';
  import { searchFormSchema, columns } from '/@/views/cms/column/column.data';
  import { Icon } from '/@/components/Icon';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonEdit,
    AButtonAddSub,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonImport,
    AButtonExport,
  } from '/@/components/Button';
  import { downloadFileById } from '/@/utils/file/download';
  import { Authority } from '/@/components/Authority';
  import { add, remove, select, get, exportData } from '/@/api/cms/cmsColumn';
  import CmsColumnInput from '/@/views/cms/column/Input.vue';
  import CmsColumnOrder from '/@/views/cms/column/Order.vue';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';
  import { useCmsStore } from '/@/store/modules/cms';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    name: 'CmsColumnList',
    components: {
      SiteSelect,
      PageWrapper,
      Authority,
      Icon,
      CmsColumnInput,
      CmsColumnOrder,
      AButtonAdd,
      AButtonAddSub,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonImport,
      AButtonExport,
      BasicTable,
    },
    setup() {
      const globSetting = useGlobSetting();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      // 导出按钮状态
      const exportBtnLoading = ref<boolean>(false);

      const [registerDrawer, { openDrawer }] = useDrawer();
      // 排序
      const [registerOrderDrawer, { openDrawer: openOrderDrawer }] = useDrawer();

      // 监听切换站点
      const cmsStore = useCmsStore();

      watch(
        () => cmsStore.getCurrentSite,
        () => {
          if (cmsStore.getCurrentSite) {
            reload();
          }
        },
      );

      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm, expandAll, collapseAll }] = useTable({
        title: '栏目',
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

      const handleCreate = (id: string | undefined) => {
        add(id).then((data) => {
          openDrawer(true, { ...data, siteId: cmsStore.getCurrentSite?.id });
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
        apiUrl: globSetting.apiUrl,
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
