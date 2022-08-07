<template>
  <PageWrapper title="表单基础示例" contentFullHeight>
    <CollapseContainer title="基础示例">
      <BasicForm
        autoFocusFirstItem
        :labelWidth="200"
        :schemas="schemas"
        :actionColOptions="{ span: 24 }"
        :baseColProps="{ xl: 8, md: 12, sm: 24 }"
        @submit="handleSubmit"
        @reset="handleReset"
      >
        <template #selectA="{ model, field }">
          <a-select
            :options="optionsA"
            mode="multiple"
            v-model:value="model[field]"
            @change="valueSelectA = model[field]"
            allowClear
          />
        </template>
        <template #selectB="{ model, field }">
          <a-select
            :options="optionsB"
            mode="multiple"
            v-model:value="model[field]"
            @change="valueSelectB = model[field]"
            allowClear
          />
        </template>
        <template #localSearch="{ model, field }">
          <ApiSelect
            :api="selectAll"
            showSearch
            v-model:value="model[field]"
            optionFilterProp="label"
          />
        </template>
        <template #remoteSearch="{ model, field }">
          <ApiSelect
            :api="selectAll"
            showSearch
            v-model:value="model[field]"
            :filterOption="false"
            :params="searchParams"
            @search="onSearch"
          />
        </template>
      </BasicForm>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, unref, ref } from 'vue';
  import { BasicForm, FormSchema, ApiSelect } from '/@/components/Form';
  import { CollapseContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';

  import { useDebounceFn } from '@vueuse/core';
  // import { treeOptionsListApi } from '/@/api/demo/tree';
  import { Select } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { selectAll } from '/@/api/sys/sysDictType';

  const valueSelectA = ref<string[]>([]);
  const valueSelectB = ref<string[]>([]);
  const options = ref<Recordable[]>([]);
  for (let i = 1; i < 10; i++) options.value.push({ label: '选项' + i, value: `${i}` });

  const optionsA = computed(() => {
    return cloneDeep(unref(options)).map((op) => {
      op.disabled = unref(valueSelectB).indexOf(op.value) !== -1;
      return op;
    });
  });
  const optionsB = computed(() => {
    return cloneDeep(unref(options)).map((op) => {
      op.disabled = unref(valueSelectA).indexOf(op.value) !== -1;
      return op;
    });
  });

  const provincesOptions = [
    {
      id: 'guangdong',
      label: '广东省',
      value: '1',
      key: '1',
    },
    {
      id: 'jiangsu',
      label: '江苏省',
      value: '2',
      key: '2',
    },
  ];
  const citiesOptionsData = {
    guangdong: [
      {
        label: '珠海市',
        value: '1',
        key: '1',
      },
      {
        label: '深圳市',
        value: '2',
        key: '2',
      },
      {
        label: '广州市',
        value: '3',
        key: '3',
      },
    ],
    jiangsu: [
      {
        label: '南京市',
        value: '1',
        key: '1',
      },
      {
        label: '无锡市',
        value: '2',
        key: '2',
      },
      {
        label: '苏州市',
        value: '3',
        key: '3',
      },
    ],
  };

  const schemas: FormSchema[] = [
    {
      field: 'divider-basic',
      component: 'Divider',
      label: '基础字段',
      colProps: { xl: 24, md: 24 },
    },
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      componentProps: ({ schema, formModel }) => {
        console.log('form:', schema);
        console.log('formModel:', formModel);
        return {
          placeholder: '自定义placeholder',
          onChange: (e: any) => {
            console.log(e);
          },
        };
      },
      renderComponentContent: () => {
        return {
          prefix: () => 'pSlot',
          suffix: () => 'sSlot',
        };
      },
    },
    {
      field: 'field3',
      component: 'DatePicker',
      label: '字段3',
    },
    {
      field: 'field4',
      component: 'Select',
      label: '字段4',
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
            key: '1',
          },
          {
            label: '选项2',
            value: '2',
            key: '2',
          },
        ],
      },
    },
    {
      field: 'field5',
      component: 'CheckboxGroup',
      label: '字段5',
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
    },
    {
      field: 'field7',
      component: 'RadioGroup',
      label: '字段7',
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
    },
    {
      field: 'field8',
      component: 'Checkbox',
      label: '字段8',
      renderComponentContent: 'Check',
    },
    {
      field: 'field9',
      component: 'Switch',
      label: '字段9',
    },
    {
      field: 'field10',
      component: 'RadioButtonGroup',
      label: '字段10',
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
    },
    {
      field: 'field11',
      component: 'Cascader',
      label: '字段11',
      componentProps: {
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                  {
                    value: 'xihu',
                    label: 'West Lake',
                  },
                ],
              },
            ],
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      field: 'divider-api-select',
      component: 'Divider',
      label: '远程下拉演示',
      colProps: { xl: 24, md: 24 },
    },
    {
      field: 'field30',
      component: 'ApiSelect',
      label: '懒加载远程下拉',
      required: true,
      componentProps: {
        api: selectAll,
        onChange: (e) => {
          console.log('selected:', e);
        },
      },
      defaultValue: 'commonStatus',
    },
    {
      field: 'field31',
      component: 'Input',
      label: '下拉本地搜索',
      helpMessage: ['ApiSelect组件', '远程数据源本地搜索', '只发起一次请求获取所有选项'],
      required: true,
      slot: 'localSearch',
      defaultValue: '0',
    },
    {
      field: 'field32',
      component: 'Input',
      label: '下拉远程搜索',
      helpMessage: ['ApiSelect组件', '将关键词发送到接口进行远程搜索'],
      required: true,
      slot: 'remoteSearch',
      defaultValue: '0',
    },
    {
      field: 'field33',
      component: 'ApiTreeSelect',
      label: '远程下拉树',
      helpMessage: ['ApiTreeSelect组件', '使用接口提供的数据生成选项'],
      required: true,
      componentProps: {
        // api: treeOptionsListApi,
        resultField: 'list',
      },
    },
    {
      field: 'field36',
      component: 'ApiTree',
      label: '远程Tree',
      helpMessage: ['ApiTree组件', '使用接口提供的数据生成选项'],
      required: true,
      componentProps: {
        // api: treeOptionsListApi,
        params: {
          count: 2,
        },
        afterFetch: (v) => {
          //do something
          return v;
        },
        resultField: 'list',
      },
    },
    {
      field: 'divider-linked',
      component: 'Divider',
      label: '字段联动',
      colProps: { xl: 24, md: 24 },
    },
    {
      field: 'province',
      component: 'Select',
      label: '省份',
      componentProps: ({ formModel, formActionType }) => {
        return {
          options: provincesOptions,
          placeholder: '省份与城市联动',
          onChange: (e: any) => {
            // console.log(e)
            let citiesOptions =
              e == 1
                ? citiesOptionsData[provincesOptions[0].id]
                : citiesOptionsData[provincesOptions[1].id];
            // console.log(citiesOptions)
            if (e === undefined) {
              citiesOptions = [];
            }
            formModel.city = undefined; //  reset city value
            const { updateSchema } = formActionType;
            updateSchema({
              field: 'city',
              componentProps: {
                options: citiesOptions,
              },
            });
          },
        };
      },
    },
    {
      field: 'city',
      component: 'Select',
      label: '城市',
      componentProps: {
        options: [],
        placeholder: '省份与城市联动',
      },
    },
    {
      field: 'divider-selects',
      component: 'Divider',
      label: '互斥多选',
      helpMessage: ['两个Select共用数据源', '但不可选择对方已选中的项目'],
      colProps: { xl: 24, md: 24 },
    },
    {
      field: 'selectA',
      component: 'Select',
      label: '互斥SelectA',
      slot: 'selectA',
      defaultValue: [],
    },
    {
      field: 'selectB',
      component: 'Select',
      label: '互斥SelectB',
      slot: 'selectB',
      defaultValue: [],
    },
    {
      field: 'divider-deconstruct',
      component: 'Divider',
      label: '字段解构',
      helpMessage: ['如果组件的值是 array 或者 object', '可以根据 ES6 的解构语法分别取值'],
      colProps: { xl: 24, md: 24 },
    },
    {
      field: '[startTime, endTime]',
      label: '时间范围',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
        showTime: { format: 'HH:mm:ss' },
      },
    },
    {
      field: 'divider-others',
      component: 'Divider',
      label: '其它',
      colProps: { xl: 24, md: 24 },
    },
    {
      field: 'field20',
      component: 'InputNumber',
      label: '字段20',
      required: true,
    },
    {
      field: 'field21',
      component: 'Slider',
      label: '字段21',
      componentProps: {
        min: 0,
        max: 100,
        range: true,
        marks: {
          20: '20°C',
          60: '60°C',
        },
      },
    },
    {
      field: 'field22',
      component: 'Rate',
      label: '字段22',
      defaultValue: 3,
      componentProps: {
        disabled: false,
        allowHalf: true,
      },
    },
  ];

  export default defineComponent({
    components: { BasicForm, CollapseContainer, PageWrapper, ApiSelect, ASelect: Select },
    setup() {
      const check = ref(null);
      const { createMessage } = useMessage();
      const keyword = ref<string>('');
      const searchParams = computed<Recordable>(() => {
        return { keyword: unref(keyword) };
      });

      function onSearch(value: string) {
        keyword.value = value;
      }
      return {
        schemas,
        selectAll,
        optionsA,
        optionsB,
        valueSelectA,
        valueSelectB,
        onSearch: useDebounceFn(onSearch, 300),
        searchParams,
        handleReset: () => {
          keyword.value = '';
        },
        handleSubmit: (values: any) => {
          console.log('values', values);
          createMessage.success('click search,values:' + JSON.stringify(values));
        },
        check,
      };
    },
  });
</script>
