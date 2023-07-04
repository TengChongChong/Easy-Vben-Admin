<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="菜单"
    width="45%"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm" />

    <template #appendFooter>
      <a-button-save @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save, selectAll } from '/@/api/auth/sysPermission';
  import { isArray } from '/@/utils/is';
  import { SysPermission } from '/@/api/auth/model/sysPermissionModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { TreeNode } from '/@/api/model/treeModel';
  import { AButtonSave } from '/@/components/Button';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'AuthPermissionInput',
    components: { AButtonSave, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [
        registerForm,
        { resetFields, setFieldsValue, validate, updateSchema, getFieldsValue },
      ] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'type',
            label: '类型',
            component: 'DictRadio',
            componentProps: {
              dictType: 'permissionType',
            },
            required: true,
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'parentId',
            label: '上级菜单',
            component: 'ApiTreeSelect',
            componentProps: {
              api: selectAll,
              afterFetch: (res) => {
                const treeNodes: TreeNode[] = [] as TreeNode[];
                res.map((item) => {
                  const { id, parentId, title } = item;
                  treeNodes.push({
                    id,
                    parentId,
                    title,
                    value: id,
                    key: id,
                  });
                });
                return listToTree(treeNodes);
              },
            },
          },
          {
            field: 'title',
            label: '标题',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'code',
            label: '权限标识',
            component: 'Input',
            helpMessage: 'Controller中定义的权限标识',
            rules: [{ max: 64, message: '编码不能超过64个字符', trigger: 'blur' }],
            show: ({ values }) => values.external !== '1',
          },
          {
            field: 'icon',
            label: '图标',
            component: 'IconPicker',
            show: ({ values }) => values.type !== 'button',
          },
          {
            field: 'path',
            label: 'Path',
            component: 'Input',
            rules: [{ max: 255, message: '编码不能超过255个字符', trigger: 'blur' }],
            show: ({ values }) => values.type === 'menu',
          },
          {
            field: 'component',
            label: '组件路径',
            component: 'Input',
            componentProps: {
              prefix: '/views',
            },
            rules: [{ max: 255, message: '编码不能超过255个字符', trigger: 'blur' }],
            show: ({ values }) => values.type === 'menu' && values.external !== '1',
          },
          {
            field: 'name',
            label: '组件Name',
            component: 'Input',
            helpMessage: '如不填写将根据组件路径转为首字母大写驼峰规则自动生成',
            rules: [{ max: 64, message: '编码不能超过64个字符', trigger: 'blur' }],
            show: ({ values }) => values.type === 'menu' && values.external !== '1',
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
            field: 'display',
            label: '显示',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'external',
            label: '外链',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'external',
            },
            itemProps: { validateTrigger: 'blur' },
            show: ({ values }) => values.type === 'menu',
          },
          {
            field: 'openMode',
            label: '打开方式',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'openMode',
            },
            itemProps: { validateTrigger: 'blur' },
            show: ({ values }) => values.type === 'menu',
          },
          {
            field: 'status',
            label: '状态',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            itemProps: { validateTrigger: 'blur' },
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

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        changeLoading(true);
        await updateParentMenu();
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      async function updateParentMenu() {
        await updateSchema({
          field: 'parentId',
          componentProps: {
            t: new Date().getTime(),
          },
        });
      }

      async function handleSubmit(callback: (_: SysPermission) => any) {
        try {
          changeLoading(true);
          await validate();
          const values = getFieldsValue();
          if (values && isArray(values.parentCode)) {
            values.parentCode = values.parentCode[values.parentCode.length - 1];
          } else {
            values.parentCode = '';
          }
          await save(values).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } finally {
          changeLoading(false);
        }
      }

      async function handleSave() {
        await handleSubmit((_) => {
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit((res) => {
          nextTick(() => {
            updateParentMenu();
            add(res.parentId).then(async (data) => {
              // 重置表单
              await resetFields();
              await setFieldsValue(data);
            });
          });
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
