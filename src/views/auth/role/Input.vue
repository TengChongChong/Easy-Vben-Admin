<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="角色"
    width="30%"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          class="tree-sm"
          v-model:value="model[field]"
          :treeData="treeData"
          :height="500"
          ref="treeRef"
          @check="onTreeSelectChange"
          checkable
          toolbar
          title="选择工具"
        />
      </template>
    </BasicForm>

    <template #appendFooter>
      <a-button type="primary" @click="handleSaveAndAdd">
        <Icon icon="ant-design:plus-outlined" />
        保存并新增
      </a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save } from '/@/api/auth/sysRole';
  import { Icon } from '/@/components/Icon';
  import { SysRole } from '/@/api/auth/model/sysRoleModel';
  import { BasicTree } from '/@/components/Tree';
  import { TreeActionType, TreeItem } from '/@/components/Tree/src/type/tree';
  import { selectAll } from '/@/api/auth/sysPermission';
  import { convertCheckedKeys, listToTree } from '/@/utils/helper/treeHelper';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'AuthRoleInput',
    components: { BasicTree, Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const allSelectedNodes = ref<String[]>([]);
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'name',
            label: '名称',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'code',
            label: '标识',
            component: 'Input',
            required: true,
            rules: [{ max: 64, message: '编码不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'sys',
            label: '是否系统',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
            },
            itemProps: { validateTrigger: 'blur' },
            auth: RoleEnum.SYS_ADMIN,
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
            label: '菜单',
            field: 'permissionIds',
            slot: 'menu',
            component: 'Input',
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
        unref(treeRef)?.expandAll(false);
        // 重置表单
        await resetFields();
        await selectAll().then((res) => {
          treeData.value = listToTree(res);
        });
        allSelectedNodes.value = data.permissionIds;
        data.permissionIds = convertCheckedKeys(unref(treeData), data.permissionIds);

        await setFieldsValue(data);

        changeLoading(false);
      });

      function onTreeSelectChange(selectedKeys, info) {
        allSelectedNodes.value = selectedKeys.concat(info.halfCheckedKeys);
      }

      async function handleSubmit(callback: (_: SysRole) => any) {
        try {
          changeLoading(true);
          await validate();
          const values = getFieldsValue();
          // 设置选中节点
          if (unref(allSelectedNodes)?.length) {
            values.permissionIds = unref(allSelectedNodes);
          }
          await save(values as SysRole).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      async function handleSave() {
        await handleSubmit((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
          add().then(async (data) => {
            // 重置表单
            await resetFields();
            await setFieldsValue(data);
            changeLoading(false);
          });
        });
      }

      return {
        treeRef,
        treeData,
        registerDrawer,
        registerForm,
        handleSave,
        handleSaveAndAdd,
        onTreeSelectChange,
      };
    },
  });
</script>
