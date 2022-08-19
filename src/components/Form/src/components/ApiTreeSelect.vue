<template>
  <a-tree-select
    v-bind="getAttrs"
    show-search
    :tree-node-filter-prop="treeNodeFilterProp"
    @tree-expand="treeExpand"
    @change="handleChange"
    v-model:treeExpandedKeys="treeExpandedKeys"
    v-model:value="state"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </a-tree-select>
</template>

<script lang="ts">
  import { computed, defineComponent, watch, ref, onMounted, unref } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { isArray, isFunction, isNullOrUnDef, isNumber, isString } from '/@/utils/is';
  import { get } from 'lodash-es';
  import { propTypes } from '/@/utils/propTypes';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { findPath } from '/@/utils/helper/treeHelper';

  export default defineComponent({
    name: 'ApiTreeSelect',
    components: { ATreeSelect: TreeSelect, LoadingOutlined },
    props: {
      value: [Array, String, Number],
      api: { type: Function as PropType<(arg?: Recordable) => Promise<Recordable>> },
      params: { type: Object },
      immediate: { type: Boolean, default: true },
      resultField: propTypes.string.def(''),
      // 搜索字段
      treeNodeFilterProp: propTypes.string.def('title'),
      afterFetch: { type: Function as PropType<Fn> },
      // 仅用于管理页面动态更新
      t: propTypes.number,
    },
    emits: ['options-change', 'change', 'update:value'],
    setup(props, { attrs, emit }) {
      const treeData = ref<Recordable[]>([]);
      const isFirstLoaded = ref<Boolean>(false);
      const loading = ref(false);
      const treeExpandedKeys = ref([]);
      const emitData = ref<any[]>([]);
      const getAttrs = computed(() => {
        return {
          ...(props.api ? { treeData: unref(treeData) } : {}),
          ...attrs,
        };
      });

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      function handleChange(value) {
        emit('update:value', value);
      }

      watch(
        () => props.params,
        () => {
          unref(isFirstLoaded) && fetch();
        },
        { deep: true },
      );

      watch(
        () => props.t,
        () => {
          unref(isFirstLoaded) && fetch();
        },
      );

      watch(
        () => props.immediate,
        (v) => {
          v && unref(isFirstLoaded) && fetch();
        },
      );

      watch(
        () => props.value,
        () => {
          setExpandedKeys();
        },
      );

      onMounted(() => {
        props.immediate && fetch();
      });

      async function fetch() {
        const { api, afterFetch } = props;
        if (!api || !isFunction(api)) return;
        loading.value = true;
        treeData.value = [];
        let result;
        try {
          result = await api(props.params);
        } catch (e) {
          console.error(e);
        }
        if (afterFetch && isFunction(afterFetch)) {
          result = afterFetch(result);
        }
        loading.value = false;
        if (!result) return;
        if (!isArray(result)) {
          result = get(result, props.resultField);
        }
        treeData.value = (result as Recordable[]) || [];
        isFirstLoaded.value = true;
        emit('options-change', treeData.value);
        setExpandedKeys();
      }

      /**
       * 展开选中节点
       */
      function setExpandedKeys() {
        treeExpandedKeys.value = [];

        if (treeData.value.length === 0 || isNullOrUnDef(props.value)) {
          return;
        }

        let pathArray: any[] = [];
        // value 有值
        if (isString(props.value) || isNumber(props.value)) {
          pathArray = findPath(treeData.value, (n) => n.value === props.value);
        } else if (isArray(props.value)) {
          props.value.forEach((item) => {
            pathArray = pathArray.concat(findPath(treeData.value, (n) => n.value === item));
          });
        }
        if (pathArray && pathArray.length > 1) {
          // 去掉最后一级（当前节点不需要展开）
          pathArray = pathArray.slice(0, pathArray.length - 1);
          pathArray.map((item) => {
            // @ts-ignore
            treeExpandedKeys.value.push(item.key);
          });
        }
      }

      function treeExpand(keys) {
        treeExpandedKeys.value = keys;
      }

      return { getAttrs, loading, state, treeExpandedKeys, treeExpand, handleChange };
    },
  });
</script>
