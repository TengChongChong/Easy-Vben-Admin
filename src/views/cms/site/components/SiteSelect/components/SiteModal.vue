<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="选择站点"
    :mask-closable="getCurrentSite != null"
    :keyboard="getCurrentSite != null"
    :closable="getCurrentSite != null"
    :show-cancel-btn="false"
    @ok="setSite"
  >
    <a-alert
      v-if="getCurrentSite == null"
      message="请选择需要编辑的站点，并点击确认按钮"
      type="info"
      show-icon
    />

    <a-alert
      v-if="getCurrentSite != null"
      :message="`当前编辑：${getCurrentSite.name}，如需编辑其他站点，请选择站点后点击确认按钮`"
      type="info"
      show-icon
    />
    <BasicTree
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      v-model:selectedKeys="selectedKeys"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { selectAll, get } from '/@/api/cms/cmsSite';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { BasicTree } from '/@/components/Tree';
  import { TreeItem } from '/@/components/Tree/src/type/tree';
  import { useCmsStore } from '/@/store/modules/cms';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    components: { BasicTree, BasicModal },
    emits: ['change', 'register'],
    setup(_, { emit }) {
      const cmsStore = useCmsStore();
      const selectedKeys = ref<string[]>([]);
      const [register, { closeModal, changeLoading }] = useModalInner(() => {});

      const getCurrentSite = computed(() => {
        return cmsStore.getCurrentSite;
      });

      const treeData = ref<TreeItem[]>([]);

      onMounted(async () => {
        changeLoading(true);
        const data = await selectAll();
        treeData.value = afterFetch(data);
        changeLoading(false);
      });

      async function setSite() {
        if (selectedKeys.value.length === 0) {
          message.warn('请选择要编辑的站点');
          return;
        }
        const cmsSite = await get(selectedKeys.value[0]);
        cmsStore.setCurrentSite(cmsSite);
        emit('change', cmsSite);
        selectedKeys.value = [];
        closeModal();
      }

      function afterFetch(res) {
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
      }

      return {
        getCurrentSite,
        selectedKeys,
        treeData,
        selectAll,
        register,
        closeModal,
        setSite,
      };
    },
  });
</script>
