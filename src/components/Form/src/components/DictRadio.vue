<template>
  <a-radio-group v-bind="attrs" v-model:value="state">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <a-radio-button :value="item.value">
        {{ item.label }}
      </a-radio-button>
    </template>
  </a-radio-group>
</template>
<script lang="ts">
  import { defineComponent, computed, watch, ref } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { dictProps } from '/@/components/Dict/props';
  import { SelectModel } from '/@/api/model/selectModel';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { useDictStore } from '/@/store/modules/dict';

  export default defineComponent({
    name: 'DictRadio',
    inheritAttrs: false,
    props: dictProps,
    emits: ['change', 'update:value'],
    setup(props) {
      const attrs = useAttrs();
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

      return { state, getOptions, attrs };
    },
  });
</script>
