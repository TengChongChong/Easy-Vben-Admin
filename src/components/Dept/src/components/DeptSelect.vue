<template>
  <api-tree-select
    allow-clear
    v-model:value="currentValue"
    :multiple="multiple"
    :api="selectAll"
    :afterFetch="afterFetch"
    @change="handleChange"
    style="width: 100%"
  />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { ApiTreeSelect } from '/@/components/Form';
  import { selectAll } from '/@/api/auth/sysDept';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';

  export default defineComponent({
    name: 'DeptSelect',
    components: { ApiTreeSelect },
    inheritAttrs: false,
    props: {
      value: [Array, String],
      // 是否为多选
      multiple: propTypes.bool.def(false),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const currentValue = ref();

      watch(
        () => props.value,
        () => {
          currentValue.value = props.value;
        },
      );

      onMounted(() => {
        currentValue.value = props.value;
      });

      const afterFetch = (res) => {
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
      };

      function handleChange(value) {
        currentValue.value = value;
        emit('change', value);
        emit('update:value', value);
      }

      return {
        currentValue,
        selectAll,
        afterFetch,
        handleChange,
      };
    },
  });
</script>
