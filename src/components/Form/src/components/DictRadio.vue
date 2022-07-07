<template>
  <a-radio-group v-bind="$attrs" v-model:value="value" @change="handleChange">
    <a-radio-button v-for="item in getOptions" :key="`${item.value}`" :value="item.value">
      {{ item.label }}
    </a-radio-button>
  </a-radio-group>
</template>
<script lang="ts">
  import { defineComponent, computed, watch, ref, unref } from 'vue';
  import { dictProps } from '/@/components/Dict/props';
  import { SelectModel } from '/@/api/model/selectModel';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { useDictStore } from '/@/store/modules/dict';

  export default defineComponent({
    name: 'DictRadio',
    props: dictProps,
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const dictStore = useDictStore();
      const dictArray = ref<SysDict[]>([]);
      const value = ref<string>();

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
          value.value = props.value;
        },
      );

      function getDictArray() {
        dictArray.value = dictStore.selectDictArray(props.dictType);
      }

      getDictArray();

      function handleChange() {
        emit('change', unref(value));
        emit('update:value', unref(value));
      }

      return { value, getOptions, handleChange };
    },
  });
</script>
