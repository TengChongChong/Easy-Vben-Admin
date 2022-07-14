<template>
  <Select
    show-search
    :allowClear="true"
    option-filter-prop="label"
    @change="handleChange"
    :options="options"
    :disabled="disabled"
    v-model:value="currentValue"
    style="width: 160px"
  >
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { getTableInfo } from '/@/api/generator/generator';
  import { SelectModel } from '/@/api/model/selectModel';

  export default defineComponent({
    name: 'TableFieldSelect',
    components: {
      Select,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      value: propTypes.string,
      table: propTypes.string,
      disabled: propTypes.bool.def(false),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const options = ref<SelectModel[]>([]);
      const loading = ref(false);
      const currentValue = ref<string>();

      watch(
        () => props.table,
        () => loadOption(),
      );

      watch(
        () => props.value,
        () => (currentValue.value = props.value),
      );

      onMounted(() => {
        loadOption();
        currentValue.value = props.value;
      });

      function loadOption() {
        if (!props.table) {
          options.value = [];
          return;
        }
        try {
          loading.value = true;
          getTableInfo('master', props.table).then((res) => {
            const optionArray: SelectModel[] = [];
            res.fields.map((item) => {
              optionArray.push({
                value: item.name,
                label: `${item.name} - ${item.comment}`,
              });
            });
            options.value = optionArray;
          });
        } catch (e) {
        } finally {
          loading.value = false;
        }
      }

      function handleChange(value) {
        emit('update:value', value);
      }

      return { currentValue, options, loading, handleChange };
    },
  });
</script>
