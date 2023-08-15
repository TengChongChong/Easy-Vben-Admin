<template>
  <div class="mx-auto mt-12" style="max-width: 520px">
    <a-alert type="info" show-icon>
      <template #message>
        {{
          checkedKeys.length
            ? `已选择个 ${pageCheckedKeys.length} 页面，${columnCheckedKeys.length} 个栏目`
            : '在下方勾选需要发布的资源'
        }}
      </template>
    </a-alert>

    <BasicTree
      toolbar
      search
      checkable
      :height="500"
      :clickRowToExpand="false"
      :treeData="treeData"
      @check="handleCheck"
      v-model:value="checkedKeys"
      v-model:expandedKeys="expandedKeys"
    />

    <a-checkbox v-if="columnCheckedKeys.length" v-model:checked="releaseArticle">
      发布栏目下文章
    </a-checkbox>
  </div>

  <div class="text-right">
    <a-popconfirm
      v-if="checkedKeys.length"
      :title="`确定要发布选择的 ${checkedKeys.length} 个资源吗?`"
      ok-text="是"
      cancel-text="否"
      @confirm="handleSaveRelease"
    >
      <a-button type="primary">
        <template #icon>
          <Icon icon="ant-design:check-outlined" />
        </template>
        发布
      </a-button>
    </a-popconfirm>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { useCmsStore } from '/@/store/modules/cms';
  import { BasicTree } from '/@/components/Tree';
  import { TreeItem } from '/@/components/Tree/src/type/tree';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { save, selectReleaseAssets, startRelease } from '/@/api/cms/cmsRelease';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { CmsRelease } from '/@/api/cms/model/cmsReleaseModel';

  export default defineComponent({
    components: {
      Icon,
      BasicTree,
    },
    emits: ['show-loading', 'close-loading', 'release'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      // 默认展开站点、页面、栏目节点
      const expandedKeys = ref<string[]>(['0', 'ignore_page_0', 'ignore_column_0']);
      const checkedKeys = ref<string[]>([]);
      const pageCheckedKeys = ref<string[]>([]);
      const columnCheckedKeys = ref<string[]>([]);
      const releaseArticle = ref(false);

      // 监听切换站点
      const cmsStore = useCmsStore();
      const getCurrentSite = computed(() => cmsStore.getCurrentSite);
      watch(
        () => cmsStore.getCurrentSite,
        () => {
          if (getCurrentSite.value) {
            // 刷新数据
            loadReleaseAssets();
            checkedKeys.value = [];
          }
        },
      );

      onMounted(() => {
        loadReleaseAssets();
      });

      async function handleSaveRelease() {
        try {
          emit('show-loading');
          const cmsRelease: CmsRelease = await save({
            pageIds: pageCheckedKeys.value.join(','),
            columnIds: columnCheckedKeys.value.join(','),
            releaseArticle: releaseArticle.value ? '1' : '0',
          });
          // 开始发布
          const res = await startRelease(cmsRelease.id!);
          if (res) {
            emit('release', cmsRelease);
          }
        } catch (e) {
        } finally {
          emit('close-loading');
        }
      }

      async function loadReleaseAssets() {
        const data = await selectReleaseAssets();
        treeData.value = afterFetch(data);
      }

      function afterFetch(res) {
        const treeNodes: TreeNode[] = [] as TreeNode[];
        res.map((item) => {
          const { id, parentId, title, type } = item;
          treeNodes.push({
            id,
            parentId,
            title,
            // @ts-ignore
            type,
            value: id,
            key: id,
          });
        });
        return listToTree(treeNodes);
      }

      function handleCheck(_, { checkedNodes }) {
        const pageKeys: string[] = [],
          columnKeys: string[] = [];
        checkedNodes.map((item) => {
          if (item.type === 'page') {
            pageKeys.push(item.key);
          } else if (item.type === 'column') {
            columnKeys.push(item.key);
          }
        });
        columnCheckedKeys.value = columnKeys;
        pageCheckedKeys.value = pageKeys;
      }

      return {
        treeData,
        checkedKeys,
        expandedKeys,
        releaseArticle,
        handleCheck,
        handleSaveRelease,
        columnCheckedKeys,
        pageCheckedKeys,
      };
    },
  });
</script>
