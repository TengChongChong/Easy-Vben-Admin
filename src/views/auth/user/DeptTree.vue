<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="部门"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { BasicTree } from '/@/components/Tree';
  import { selectAll } from '/@/api/auth/sysDept';
  import { TreeItem } from '/@/components/Tree/src/tree';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';

  export default defineComponent({
    name: 'DeptTree',
    components: { BasicTree },

    emits: ['select'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);

      async function fetch() {
        selectAll().then((res) => {
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
          treeData.value = listToTree(treeNodes);
        });
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });
      return { treeData, handleSelect };
    },
  });
</script>
