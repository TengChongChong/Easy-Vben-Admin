<template>
  <a-cascader
    v-model:value="state"
    v-bind="$attrs"
    :options="getOptions"
    change-on-select
    @change="handleChange"
  />
</template>
<script lang="ts">
  import { defineComponent, ref, computed, watch } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useDictStore } from '/@/store/modules/dict';
  import { TreeSelectModel } from '/@/api/model/selectModel';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'DictCascader',
    inheritAttrs: false,
    props: {
      dictType: propTypes.string,
      value: propTypes.array,
      displayRenderArray: propTypes.array,
    },
    emits: ['options-change', 'change'],
    setup(props) {
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const dictStore = useDictStore();
      const tree = ref<TreeSelectModel[]>([]);

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      const getOptions = computed(() => {
        return tree.value;
      });

      watch(
        () => props.dictType,
        () => {
          getTree();
        },
      );

      function getTree() {
        tree.value = dictStore.selectTree(props.dictType);
      }

      function handleChange(keys) {
        emitData.value = keys;
      }

      getTree();

      return { state, attrs, getOptions, handleChange };
    },
  });
</script>
