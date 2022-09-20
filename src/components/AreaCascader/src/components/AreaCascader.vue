<template>
  <a-cascader
    allow-clear
    v-model:value="currentValue"
    :options="options"
    @change="handleChange"
    style="width: 100%"
  />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { AREA } from './data';

  export default defineComponent({
    name: 'AreaCascader',
    props: {
      value: [Array],
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const currentValue = ref();

      watch(
        () => props.value,
        () => {
          currentValue.value = props.value;
        },
      );

      onMounted(() => {
        currentValue.value = props.value;
      });

      function handleChange(value) {
        currentValue.value = value;
        emit('change', value);
        emit('update:value', value);
      }

      return {
        options: AREA,
        currentValue,
        handleChange,
      };
    },
  });
</script>
