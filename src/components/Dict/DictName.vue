<template>
  <span>{{ dict?.name || props.value }}</span>
</template>
<script lang="ts" setup>
  import { useDictStore } from '/@/store/modules/dict';
  import { dictProps } from '/@/components/Dict/props';
  import { ref, watch } from 'vue';

  const dictStore = useDictStore();
  const dict = ref();

  const props = defineProps(dictProps);

  dict.value = dictStore.getDict(props.dictType, props.value);
  watch(
    [props],
    () => {
      dict.value = dictStore.getDict(props.dictType, props.value);
    },
    { deep: true },
  );
</script>
