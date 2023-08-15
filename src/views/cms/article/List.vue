<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="cms:article:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="cms:article:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover' && record.coverUrl">
          <div class="article-cover"><ImagePreview :imageList="[apiUrl + record.coverUrl]" /></div>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small @click="go(`/cms/article/input?id=${record.id}`)" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="cms:article:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
            <button-release v-if="record.status !== '1'" :id="record.id" @success="reload" />
            <button-revoke v-if="record.status === '1'" :id="record.id" @success="reload" />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>预览</template>
              <a
                target="_blank"
                :href="`${apiUrl}/cms/route/${record.siteId}/article/${record.id}`"
              >
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
  import { defineComponent, ref, reactive, onActivated, watch, computed, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns } from '/@/views/cms/article/article.data';
  import { AButtonAdd, AButtonRemove, AButtonRemoveBatch, AButtonEdit } from '/@/components/Button';
  import { remove, select } from '/@/api/cms/cmsArticle';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useCmsStore } from '/@/store/modules/cms';
  import dayjs from 'dayjs';
  import { selectAll } from '/@/api/cms/cmsColumn';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { ImagePreview } from '/@/components/Preview';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Icon } from '/@/components/Icon';
  import ButtonRelease from './components/ButtonRelease.vue';
  import ButtonRevoke from './components/ButtonRevoke.vue';

  export default defineComponent({
    name: 'CmsArticleList',
    components: {
      Icon,
      AButtonEdit,
      ImagePreview,
      SiteSelect,
      PageWrapper,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      ButtonRelease,
      ButtonRevoke,
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

      // 监听切换站点
      const cmsStore = useCmsStore();
      const getCurrentSite = computed(() => cmsStore.getCurrentSite);

      watch(
        () => cmsStore.getCurrentSite,
        () => {
          if (getCurrentSite.value) {
            // 刷新查询条件栏目数据
            getForm().updateSchema({
              field: 'columnId',
              componentProps: {
                params: {
                  siteId: getCurrentSite.value?.id,
                },
              },
            });
            // 刷新表格数据
            reload();
          }
        },
      );

      onActivated(() => {
        if (isFirst) {
          // 首次加载不刷新数据，防止重复加载
          isFirst = false;
          return;
        }
        reload();
      });
      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm }] = useTable({
        title: '文章',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: [
            {
              field: 'columnId',
              label: '栏目',
              component: 'ApiTreeSelect',
              componentProps: {
                api: selectAll,
                params: {
                  siteId: getCurrentSite.value?.id,
                },
                onChange: () => {
                  nextTick(() => reload());
                },
                afterFetch: (res) => {
                  const treeNodes: TreeNode[] = [] as TreeNode[];
                  res.map((item) => {
                    const { id, parentId, title } = item;
                    treeNodes.push({
                      id,
                      parentId,
                      title,
                      value: id,
                      key: id,
                    });
                  });
                  return listToTree(treeNodes);
                },
              },
            },
            {
              field: 'title',
              label: '标题',
              component: 'Input',
            },
            {
              field: 'subtitle',
              label: '副标题',
              component: 'Input',
            },
            {
              field: 'source',
              label: '信息来源',
              component: 'Input',
            },
            {
              field: 'author',
              label: '作者',
              component: 'Input',
            },
            {
              field: '[startReleaseDate, endReleaseDate]',
              label: '发布时间',
              component: 'RangePicker',
              componentProps: {
                allowEmpty: [true, true],
                showTime: true,
                ranges: {
                  今天: [dayjs().startOf('day'), dayjs().endOf('day')],
                  本周: [dayjs().startOf('week'), dayjs().endOf('week')],
                  本月: [dayjs().startOf('month'), dayjs().endOf('month')],
                },
              },
              colProps: { xxl: 12, xl: 16, md: 24 },
            },
          ],
        },
        actionColumn: {
          width: 160,
          title: '操作',
          key: 'action',
        },
      });

      const handleCreate = () => {
        const columnId = getForm().getFieldsValue().columnId || '';
        go(`/cms/article/input?columnId=${columnId}`);
      };

      return {
        apiUrl: globSetting.apiUrl,
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        searchInfo,
        remove,
        go,
        registerTable,
        handleCreate,
        reload,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.article-cover) {
    .ant-image-img {
      max-height: 60px;
      max-width: 120px;
    }
  }
</style>
