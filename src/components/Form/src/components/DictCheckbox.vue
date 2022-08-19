<template>
  <a-checkbox-group
    v-bind="$attrs"
    v-model:value="state"
    :options="getOptions"
    @change="handleChange"
  />
</template>
<script lang="ts">
  import { defineComponent, computed, watch, ref } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { SelectModel } from '/@/api/model/selectModel';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { useDictStore } from '/@/store/modules/dict';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'DictCheckbox',
    props: {
      dictType: propTypes.string,
      value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.array]),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const emitData = ref<any[]>([]);
      const dictStore = useDictStore();
      const dictArray = ref<SysDict[]>([]);

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

      getDictArray();

      function handleChange(value) {
        emitData.value = value;
        emit('update:value', value);
      }

      return { state, getOptions, handleChange };
    },
  });
</script>
