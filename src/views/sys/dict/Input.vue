<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="字典"
    width="30%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />

    <template #appendFooter>
      <a-button type="primary" @click="handleSaveAndAdd">
        <Icon icon="ant-design:plus-outlined" />
        保存并新增
      </a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save } from '/@/api/sys/sysDict';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { selectAll } from '/@/api/sys/sysDictType';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { isArray, isString } from '/@/utils/is';
  import { useDictStore } from '/@/store/modules/dict';

  export default defineComponent({
    name: 'SysDictInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const dictStore = useDictStore();

      // 数据是否更改
      const isUpdate = ref(true);
      const id = ref();
      const version = ref();

      const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'dictType',
            label: '类型',
            component: 'ApiSelect',
            componentProps: {
              api: selectAll,
              onChange(value) {
                changeDictType(value);
              },
            },
            required: true,
          },
          {
            field: 'parentCode',
            label: '上级字典',
            component: 'DictCascader',
            componentProps: {
              dictType: '',
            },
          },
          {
            field: 'code',
            label: '编码',
            component: 'Input',
            required: true,
            rules: [{ max: 64, message: '编码不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            rules: [{ max: 64, message: '名称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'status',
            label: '状态',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
          },
          {
            field: 'orderNo',
            label: '排序值',
            component: 'InputNumber',
            required: true,
            rules: [
              { type: 'number', max: 999, message: '排序值不能大于999', trigger: 'blur' },
              { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' },
            ],
          },
          {
            field: 'displayType',
            label: '颜色',
            component: 'DictSelect',
            componentProps: {
              dictType: 'tagColor',
            },
          },
          {
            field: 'icon',
            label: '图标',
            component: 'IconPicker',
          },
          {
            field: 'remarks',
            label: '备注',
            component: 'InputTextArea',
            rules: [{ max: 900, message: '备注不能超过900个字符', trigger: 'blur' }],
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        // 重置表单
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        id.value = data.data?.id || null;
        version.value = data.data?.version || 0;

        if (unref(isUpdate)) {
          changeDictType(data.data.dictType);

          if (isString(data.data.parentCode)) {
            data.data.parentCode = dictStore.getPath(data.data.dictType, data.data.parentCode);
          }

          await setFieldsValue({
            ...data.data,
          });
        }
      });

      /**
       * 更改字典类型
       *
       * @param dictType 字典类型
       */
      function changeDictType(dictType: string) {
        // 更新上级字典
        updateSchema({
          field: 'parentCode',
          componentProps: {
            dictType: dictType,
          },
        });
        // 清空值
        // setFieldsValue({
        //   parentCode: [],
        // });
      }

      async function handleSave(callback: (_: SysDict) => any) {
        try {
          const values = await validate();
          if (values && isArray(values.parentCode)) {
            values.parentCode = values.parentCode[values.parentCode.length - 1];
          } else {
            values.parentCode = '';
          }
          setDrawerProps({ confirmLoading: true });
          save({ ...values, id: id.value, version: version.value }).then((res) => {
            emit('success');
            callback(res);
          });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function handleSubmit() {
        await handleSave((_) => {
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSave((res) => {
          nextTick(() => {
            add(undefined, res.dictType).then(async (data) => {
              // 重置表单
              await resetFields();
              id.value = null;

              if (isString(res.parentCode)) {
                data.parentCode = dictStore.getPath(res.dictType, res.parentCode);
              }

              await setFieldsValue({
                ...data,
              });
            });
          });
        });
      }

      return { registerDrawer, registerForm, handleSubmit, handleSaveAndAdd };
    },
  });
</script>
