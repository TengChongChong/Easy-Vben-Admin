<template>
  <a-tag class="dict-tag" v-if="dict && dict?.displayType" :color="dict.displayType">
    <template #icon v-if="props.icon && dict.icon">
      <Icon :icon="dict.icon" :size="12" />
    </template>
    {{ props.icon ? '' : dict.name }}
  </a-tag>
  <span v-else>{{ dict?.name || `无效字典（${props.dictType}-${props.value}）` }}</span>
</template>
<script lang="ts" setup>
  import { useDictStore } from '/@/store/modules/dict';
  import { dictProps } from '../props';
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { isNumber } from '/@/utils/is';

  const dictStore = useDictStore();
  const dict = ref();

  const props = defineProps(dictProps);

  defineComponent(Icon);

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

<style>
  .dict-tag > .anticon + span,
  .dict-tag > span + .anticon {
    margin: 0;
  }
</style>
