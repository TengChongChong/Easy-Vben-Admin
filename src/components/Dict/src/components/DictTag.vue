<template>
  <template v-if="dictArray.length > 1">
    <span v-for="(dict, index) in dictArray" :key="dict.code">
      {{ index > 0 ? props.separator : '' }}
      <i v-if="props.icon && dict.icon">
        <Icon :icon="dict.icon" :size="12" />
      </i>
      {{ props.icon ? '' : dict.name }}
    </span>
  </template>
  <template v-else>
    <a-tag
      class="dict-tag"
      v-if="dictArray.length === 1 && dictArray[0].displayType"
      :color="dictArray[0].displayType"
    >
      <template #icon v-if="props.icon && dictArray[0].icon">
        <Icon :icon="dictArray[0].icon" :size="12" />
      </template>
      {{ props.icon ? '' : dictArray[0].name }}
    </a-tag>
    <span v-else>
      {{
        dictArray.length === 1 ? dictArray[0].name : `无效字典（${props.dictType}-${props.value}）`
      }}
    </span>
  </template>
</template>
<script lang="ts" setup>
  import { useDictStore } from '/@/store/modules/dict';
  import { onMounted, ref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { isArray, isNumber, isString } from '/@/utils/is';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { propTypes } from '/@/utils/propTypes';

  const dictStore = useDictStore();
  const dictArray = ref<SysDict[]>([]);
  const props = defineProps({
    dictType: propTypes.string,
    value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.array]),
    // 是否使用图标
    icon: propTypes.bool.def(false),
    // 当有多个字典时，字典与字典直接的分隔符
    separator: propTypes.string.def(' /'),
  });

  /**
   * 设置字典
   */
  function setDictArray() {
    const dictCodeArray = convertDictCode();
    const dictionaryArray: SysDict[] = [];
    dictCodeArray.map((item) => {
      const code = isNumber(item) ? (item as number).toString() : (item as string);
      const dictionary = dictStore.getDict(props.dictType, code);
      if (dictionary) {
        dictionaryArray.push(dictionary);
      } else {
        console.warn(`转换字典类型：${props.dictType}，字典编码：${code} 时未找到相应字典`);
      }
    });
    dictArray.value = dictionaryArray;
  }

  /**
   * 处理传入的字典编码，转为['1', '2', '3']数据
   */
  function convertDictCode() {
    let dictCodeArray: string[] = [];
    if (isNumber(props.value)) {
      dictCodeArray = [props.value.toString()];
    } else if (isString(props.value)) {
      if (props.value.indexOf(',') > -1) {
        dictCodeArray = props.value.split(',');
      } else {
        dictCodeArray = [props.value];
      }
    } else if (isArray(props.value)) {
      dictCodeArray = props.value;
    } else {
      console.warn(`不支持的字典编码类型：${props.value}`);
    }

    return dictCodeArray;
  }

  onMounted(() => {
    setDictArray();
  });

  watch(
    [props],
    () => {
      setDictArray();
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
