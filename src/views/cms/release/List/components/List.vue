<template>
  <!-- 表格 -->
  <BasicTable :inset="true" :searchInfo="searchInfo" @register="registerTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'releaseContent'">
        {{ record.pageIds?.split(',').length }}个页面，
        {{ record.columnIds?.split(',').length }}个栏目
        {{ record.releaseArticle ? '及栏目下文章' : '' }}
      </template>
      <template v-if="column.key === 'done'">
        <a-typography-text type="success">{{ record.done }}</a-typography-text>
      </template>
      <template v-if="column.key === 'fail'">
        <a-typography-text type="danger">{{ record.fail }}</a-typography-text>
      </template>
      <template v-if="column.key === 'action'">
        <div class="basic-table-action center">
          <!-- 查看详情 -->
          <a-button-info small :path="`/cms/release/queue/list?parentId=${record.id}`" />
        </div>
      </template>
    </template>
  </BasicTable>

  <!--  站点切换工具  -->
  <SiteSelect />
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from './release.data';
  import { select } from '/@/api/cms/cmsRelease';
  import { useCmsStore } from '/@/store/modules/cms';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';
  import AButtonInfo from '/@/components/Button/src/ButtonInfo.vue';

  export default defineComponent({
    components: {
      AButtonInfo,
      SiteSelect,
      BasicTable,
    },
    setup() {
      // 查询条件
      const searchInfo = reactive<Recordable>({});

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
        api: select,
        columns,
        showTableSetting: false,
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

      return {
        searchInfo,
        registerTable,
        reload,
      };
    },
  });
</script>
<style lang="less" scoped>
  .vben-basic-table {
    padding: 0;
  }
</style>
