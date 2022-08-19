<template>
  <a-radio-group v-bind="$attrs" v-model:value="currentValue" @change="handleChange">
    <a-radio-button v-for="item in getOptions" :key="`${item.value}`" :value="item.value">
      {{ item.label }}
    </a-radio-button>
  </a-radio-group>
</template>
<script lang="ts">
  import { defineComponent, computed, watch, ref, unref } from 'vue';
  import { SelectModel } from '/@/api/model/selectModel';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { useDictStore } from '/@/store/modules/dict';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'DictRadio',
    props: {
      dictType: propTypes.string,
      value: propTypes.string,
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const dictStore = useDictStore();
      const dictArray = ref<SysDict[]>([]);
      const currentValue = ref<string>(props.value);

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

      watch(
        () => props.value,
        () => {
          // @ts-ignore
          currentValue.value = props.value;
        },
      );

      function getDictArray() {
        dictArray.value = dictStore.selectDictArray(props.dictType);
      }

      getDictArray();

      function handleChange() {
        emit('change', unref(currentValue));
        emit('update:value', unref(currentValue));
      }

      return { currentValue, getOptions, handleChange };
    },
  });
</script>
