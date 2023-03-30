<template>
  <BasicTree
    title="部门"
    toolbar
    search
    :clickRowToExpand="false"
    :treeData="treeData"
    @select="handleSelect"
  />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { BasicTree } from '/@/components/Tree';
  import { selectAll } from '/@/api/auth/sysDept';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { TreeItem } from '/@/components/Tree/src/type/tree';

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
