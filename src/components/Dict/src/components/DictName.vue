<template>
  <span>{{ dict?.name || `无效字典（${props.dictType}-${props.value}）` }}</span>
</template>
<script lang="ts" setup>
  import { useDictStore } from '/@/store/modules/dict';
  import { dictProps } from '../props';
  import { onMounted, ref, watch } from 'vue';
  import { isNumber } from '/@/utils/is';

  const dictStore = useDictStore();
  const dict = ref();

  const props = defineProps(dictProps);

  function getDict() {
    const code = isNumber(props.value) ? props.value.toString() : (props.value as string);
    dict.value = dictStore.getDict(props.dictType, code);
  }

  onMounted(() => {
    getDict();
  });

  watch(
    [props],
    () => {
      getDict();
    },
    { deep: true },
  );
</script>
