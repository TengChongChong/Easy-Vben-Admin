<template>
  <a-select
    show-search
    v-bind="$attrs"
    option-filter-prop="label"
    @change="handleChange"
    :options="getOptions"
    v-model:value="state"
    style="width: 100%"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </a-select>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, watch } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useDictStore } from '/@/store/modules/dict';
  import { SelectModel } from '/@/api/model/selectModel';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'DictSelect',
    inheritAttrs: false,
    props: {
      dictType: propTypes.string,
      value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.array]),
    },
    emits: ['options-change', 'change', 'update:value'],
    setup(props, { emit }) {
      const emitData = ref<any[]>([]);
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

      function getDictArray() {
        dictArray.value = dictStore.selectDictArray(props.dictType);
      }

      function handleChange(value, ...args) {
        emitData.value = args;
        emit('update:value', value);
      }

      getDictArray();

      return { state, getOptions, handleChange };
    },
  });
</script>
