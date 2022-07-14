<template>
  <a-select
    style="width: 100%"
    show-search
    v-bind="$attrs"
    @change="handleChange"
    :options="options"
    v-model:value="state"
  />
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { SelectModel } from '/@/api/model/selectModel';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'ComponentSelect',
    inheritAttrs: false,
    props: {
      value: propTypes.string,
      onChange: propTypes.func,
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const COMPONENT_TYPE = [
        'Input',
        'InputGroup',
        'InputPassword',
        'InputSearch',
        'InputTextArea',
        'InputNumber',
        'InputCountDown',
        'Select',
        'ApiSelect',
        'TreeSelect',
        'ApiTree',
        'ApiTreeSelect',
        'ApiRadioGroup',
        'RadioButtonGroup',
        'RadioGroup',
        'Checkbox',
        'CheckboxGroup',
        'AutoComplete',
        'ApiCascader',
        'Cascader',
        'DatePicker',
        'MonthPicker',
        'RangePicker',
        'WeekPicker',
        'TimePicker',
        'Switch',
        'StrengthMeter',
        'Upload',
        'IconPicker',
        'Render',
        'Slider',
        'Rate',
        'DictSelect',
        'DictCascader',
        'DictRadio',
        'DictCheckbox',
        'Divider',
      ];
      const emitData = ref<any[]>([]);
      const options = ref<SelectModel[]>([]);
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      onMounted(() => {
        initOptions();
      });

      const initOptions = () => {
        let opt: SelectModel[] = [];
        COMPONENT_TYPE.map((item) => {
          opt.push({
            label: item,
            value: item,
          });
        });
        options.value = opt;
      };

      function handleChange(value, ...args) {
        emitData.value = args;
        emit('update:value', value);
      }

      return { state, options, handleChange };
    },
  });
</script>
