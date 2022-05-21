<template>
  <a-select
    show-search
    option-filter-prop="label"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    v-model:value="state"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </a-select>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, watch } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { dictProps } from '/@/components/Dict/props';
  import { useDictStore } from '/@/store/modules/dict';
  import { SelectModel } from '/@/api/model/selectModel';
  import { SysDict } from '/@/api/sys/model/sysDictModel';

  export default defineComponent({
    name: 'DictSelect',
    inheritAttrs: false,
    props: dictProps,
    emits: ['options-change', 'change'],
    setup(props) {
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const dictStore = useDictStore();
      const dictArray = ref<SysDict[]>([]);

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      const getOptions = computed(() => {
        let options: SelectModel[] = [];
        dictArray.value.map((item) => {
          options.push({
            label: item.name,
            value: item.code,
          });
        });
        return options;
      });

      watch(
        () => props.dictType,
        () => {
          getDictArray();
        },
      );

      // watch(
      //   () => props.value,
      //   () => {
      //     handleChange(null, props.value);
      //   },
      // );

      function getDictArray() {
        dictArray.value = dictStore.selectDictArray(props.dictType);
      }

      function handleChange(_, ...args) {
        emitData.value = args;
      }

      getDictArray();

      return { state, attrs, getOptions, handleChange };
    },
  });
</script>
