<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="用户"
    width="30%"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm">
      <template #role="{ model, field }">
        <BasicTree
          class="tree-sm"
          v-model:value="model[field]"
          :treeData="treeData"
          ref="treeRef"
          @check="onTreeSelectChange"
          checkable
          toolbar
          title="选择工具"
        />
      </template>
    </BasicForm>

    <template #appendFooter>
      <a-button-save @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree } from '/@/components/Tree';
  import { add, save } from '/@/api/auth/sysUser';
  import { SysUser } from '/@/api/auth/model/sysUserModel';
  import { TreeActionType, TreeItem } from '/@/components/Tree/src/tree';
  import { convertCheckedKeys, listToTree } from '/@/utils/helper/treeHelper';
  import { selectAll as selectAllRole } from '/@/api/auth/sysRole';
  import { AButtonSave } from '/@/components/Button';

  export default defineComponent({
    name: 'SysUserInput',
    components: { AButtonSave, BasicForm, BasicDrawer, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const deptId = ref();
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const allSelectedNodes = ref<String[]>([]);

      const [
        registerForm,
        { resetFields, setFieldsValue, validate, updateSchema, getFieldsValue },
      ] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'nickname',
            label: '昵称',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '昵称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'username',
            label: '账号',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'password',
            label: '密码',
            component: 'InputPassword',
            helpMessage: '如不填写将使用平台默认密码',
            rules: [{ max: 32, message: '密码不能超过32个字符', trigger: 'blur' }],
            componentProps: {
              autocomplete: 'new-password',
            },
          },
          {
            field: 'roleIdList',
            label: '角色',
            slot: 'role',
            required: true,
            component: 'Input',
          },
          {
            field: 'sex',
            label: '性别',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'sex',
            },
            itemProps: { validateTrigger: 'blur' },
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
            field: 'phoneNumber',
            label: '手机号',
            component: 'Input',
            rules: [{ max: 32, message: '手机号不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'email',
            label: '邮箱',
            component: 'Input',
            rules: [{ max: 32, message: '邮箱不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'birthday',
            label: '生日',
            component: 'DatePicker',
          },
          {
            field: 'source',
            label: '来源',
            component: 'Input',
            rules: [{ max: 32, message: '来源不能超过32个字符', trigger: 'blur' }],
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
        deptId.value = data?.deptId;
        await selectAllRole().then((res) => {
          treeData.value = listToTree(res);
        });

        allSelectedNodes.value = data.roleIdList;
        data.roleIdList = convertCheckedKeys(unref(treeData), data.roleIdList);

        if (data.value) {
          // 不允许在此页面修改密码
          await updateSchema({
            field: 'password',
            ifShow: false,
          });
        } else {
          await updateSchema({
            field: 'password',
            ifShow: true,
          });
        }

        await setFieldsValue(data);
        changeLoading(false);
      });

      function onTreeSelectChange(selectedKeys, info) {
        allSelectedNodes.value = selectedKeys.concat(info.halfCheckedKeys);
      }

      async function handleSubmit(callback: (_: SysUser) => any) {
        try {
          changeLoading(true);
          await validate();
          const values = getFieldsValue();
          // 设置选中节点
          if (unref(allSelectedNodes)?.length) {
            values.roleIdList = unref(allSelectedNodes);
          }
          await save({
            ...values,
            deptId: unref(deptId),
          }).then((res) => {
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
        await handleSubmit((res) => {
          add(res.deptId!).then(async (data) => {
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
