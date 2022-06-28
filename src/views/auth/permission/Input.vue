<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="菜单"
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
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save, selectAll } from '/@/api/auth/sysPermission';
  import { Icon } from '/@/components/Icon';
  import { isArray } from '/@/utils/is';
  import { SysPermission } from '/@/api/auth/model/sysPermissionModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { TreeNode } from '/@/api/model/treeModel';

  export default defineComponent({
    name: 'AuthPermissionInput',
    components: { Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const id = ref();
      const version = ref();

      const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: [
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
            ifShow: ({ values }) => values.external !== '1',
          },
          {
            field: 'icon',
            label: '图标',
            component: 'IconPicker',
            ifShow: ({ values }) => values.type !== 'button',
          },
          {
            field: 'path',
            label: 'Path',
            component: 'Input',
            rules: [{ max: 255, message: '编码不能超过255个字符', trigger: 'blur' }],
            ifShow: ({ values }) => values.type === 'menu',
          },
          {
            field: 'component',
            label: '组件路径',
            component: 'Input',
            componentProps: {
              prefix: '/views/',
            },
            rules: [{ max: 255, message: '编码不能超过255个字符', trigger: 'blur' }],
            ifShow: ({ values }) => values.type === 'menu' && values.external !== '1',
          },
          {
            field: 'name',
            label: '组件Name',
            component: 'Input',
            helpMessage: '如不填写将根据组件路径转为首字母大写驼峰规则自动生成',
            rules: [{ max: 64, message: '编码不能超过64个字符', trigger: 'blur' }],
            ifShow: ({ values }) => values.type === 'menu' && values.external !== '1',
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
            ifShow: ({ values }) => values.type === 'menu',
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
            ifShow: ({ values }) => values.type === 'menu',
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
        id.value = data?.id;
        version.value = data?.version || 0;

        await setFieldsValue({
          ...data,
        });
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

      async function handleSave(callback: (_: SysPermission) => any) {
        try {
          changeLoading(true);
          const values = await validate();
          if (values && isArray(values.parentCode)) {
            values.parentCode = values.parentCode[values.parentCode.length - 1];
          } else {
            values.parentCode = '';
          }
          await save({ ...values, id: id.value, version: version.value }).then((res) => {
            emit('success');
            callback(res);
          });
        } finally {
          changeLoading(false);
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
            updateParentMenu();
            add(res.parentId).then(async (data) => {
              // 重置表单
              await resetFields();
              id.value = null;
              version.value = null;
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
