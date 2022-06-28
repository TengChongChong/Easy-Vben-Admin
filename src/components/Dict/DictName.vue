<template>
  <span>{{ dict?.name || `无效字典（${props.dictType}-${props.value}）` }}</span>
</template>
<script lang="ts" setup>
  import { useDictStore } from '/@/store/modules/dict';
  import { dictProps } from '/@/components/Dict/props';
  import { onMounted, ref, watch } from 'vue';

  const dictStore = useDictStore();
  const dict = ref();

  const props = defineProps(dictProps);

  onMounted(() => {
    dict.value = dictStore.getDict(props.dictType, props.value as string);
  });

  watch(
    [props],
    () => {
      dict.value = dictStore.getDict(props.dictType, props.value as string);
    },
    { deep: true },
  );
</script>
