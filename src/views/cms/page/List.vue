<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="cms:page:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="cms:page:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="cms:page:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="cms:page:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>预览</template>
              <a target="_blank" :href="`${apiUrl}/cms/route/${record.siteId}/page/${record.id}`">
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

    <!--  站点切换工具  -->
    <SiteSelect />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, onActivated, watch, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/cms/page/page.data';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import { remove, select } from '/@/api/cms/cmsPage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Icon } from '/@/components/Icon';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';
  import { useCmsStore } from '/@/store/modules/cms';

  export default defineComponent({
    name: 'CmsPageList',
    components: {
      SiteSelect,
      Icon,
      PageWrapper,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      BasicTable,
    },
    setup() {
      const globSetting = useGlobSetting();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      const go = useGo();

      let isFirst = true;

      onActivated(() => {
        if (isFirst) {
          // 首次加载不刷新数据，防止重复加载
          isFirst = false;
          return;
        }
        reload();
      });

      // 监听切换站点
      const cmsStore = useCmsStore();
      const getCurrentSite = computed(() => cmsStore.getCurrentSite);
      watch(
        () => cmsStore.getCurrentSite,
        () => {
          if (getCurrentSite.value) {
            // 刷新表格数据
            reload();
          }
        },
      );

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '页面',
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
        go(`/cms/page/input`);
      };

      const handleEdit = (id: string) => {
        go(`/cms/page/input?id=${id}`);
      };

      return {
        apiUrl: globSetting.apiUrl,
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        searchInfo,
        remove,
        registerTable,
        handleCreate,
        handleEdit,
        reload,
      };
    },
  });
</script>
