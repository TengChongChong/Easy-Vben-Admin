<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="部门"
    width="30%"
    @ok="handleSave"
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
  import { defineComponent, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save, selectAll } from '/@/api/auth/sysDept';
  import { selectAll as selectAllDeptType } from '/@/api/auth/sysDeptType';

  import { Icon } from '/@/components/Icon';
  import { SysDept } from '/@/api/auth/model/sysDeptModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { TreeNode } from '/@/api/model/treeModel';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'AuthDeptInput',
    components: { Icon, BasicForm, BasicDrawer },
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
            field: 'parentId',
            label: '上级部门',
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
            field: 'typeCode',
            label: '类型',
            component: 'ApiTreeSelect',
            required: true,
            componentProps: {
              api: selectAllDeptType,
              afterFetch: (res) => {
                const treeNodes: TreeNode[] = [] as TreeNode[];
                res.map((item) => {
                  const { id, parentId, title, key } = item;
                  treeNodes.push({
                    id,
                    parentId,
                    key,
                    title,
                    value: key,
                  });
                });
                return listToTree(treeNodes);
              },
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'simpleName',
            label: '简称',
            component: 'Input',
            rules: [{ max: 32, message: '简称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'code',
            label: '代码',
            component: 'Input',
            rules: [{ max: 32, message: '代码不能超过32个字符', trigger: 'blur' }],
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
        // 重置表单
        await resetFields();
        await updateParent();

        await setFieldsValue(data);
        changeLoading(false);
      });

      async function updateParent() {
        await updateSchema({
          field: 'parentId',
          componentProps: {
            t: new Date().getTime(),
          },
        });
      }

      async function handleSubmit(callback: (_: SysDept) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue()).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
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
            add(res.parentId, res.typeCode).then(async (data) => {
              // 重置表单
              await resetFields();
              await updateParent();
              await setFieldsValue(data);
            });
          });
        });
      }

      return {
        registerDrawer,
        registerForm,
        handleSave,
        handleSaveAndAdd,
      };
    },
  });
</script>
