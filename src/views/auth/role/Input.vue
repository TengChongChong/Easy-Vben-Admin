<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="角色"
    width="30%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          ref="treeRef"
          @check="onBusinessSelectChange"
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
  import { defineComponent, nextTick, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { add, save } from '/@/api/auth/sysRole';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { SysRole } from '/@/api/auth/model/sysRoleModel';
  import BasicTree from '/@/components/Tree/src/Tree.vue';
  import { TreeActionType, TreeItem } from '/@/components/Tree/src/tree';
  import { selectAll } from '/@/api/auth/sysPermission';
  import { findNode, listToTree, treeToList } from '/@/utils/helper/treeHelper';
  import { isArray } from '/@/utils/is';

  export default defineComponent({
    name: 'SysRoleInput',
    components: { BasicTree, Icon, BasicForm, BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const id = ref();
      const version = ref();
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const allSelectedNodes = ref<String[]>([]);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: [
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
        id.value = data?.id || null;
        version.value = data?.version || 0;
        await selectAll().then((res) => {
          treeData.value = listToTree(res);
        });

        data.permissionIds = convertCheckedKeys(data.permissionIds);
        allSelectedNodes.value = data.permissionIds.checked.concat(
          data.permissionIds.halfCheckedKeys,
        );
        await setFieldsValue({
          ...data,
        });

        changeLoading(false);
      });

      function convertCheckedKeys(checkedKeys: string[]) {
        if (!checkedKeys || !isArray(checkedKeys) || checkedKeys.length === 0) {
          return [];
        }
        const checked: {
          halfCheckedKeys: string[];
          checked: string[];
        } = {
          halfCheckedKeys: [],
          checked: [],
        };

        checkedKeys.map((key) => {
          const currentNode = findNode(unref(treeData), (n) => n.key === key);
          if (currentNode) {
            if (currentNode.children && currentNode.children.length) {
              const childrenArray = treeToList(currentNode.children);
              let hav = true;
              for (let i = 0; i < childrenArray.length; i++) {
                if (checkedKeys.indexOf(childrenArray[i].key) === -1) {
                  // 子节点未全部选中
                  hav = false;
                }
              }
              if (hav) {
                checked.checked.push(key);
              } else {
                checked.halfCheckedKeys.push(key);
              }
            } else {
              checked.checked.push(key);
            }
          }
        });

        return checked;
      }

      function onBusinessSelectChange(selectedKeys, info) {
        allSelectedNodes.value = selectedKeys.concat(info.halfCheckedKeys);
      }

      async function handleSave(callback: (_: SysRole) => any) {
        try {
          changeLoading(true);
          const values = await validate();
          // 设置选中节点
          if (unref(allSelectedNodes)?.length) {
            values.permissionIds = unref(allSelectedNodes);
          }

          await save({ ...values, id: id.value, version: version.value }).then((res) => {
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      async function handleSubmit() {
        await handleSave((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSave(() => {
          nextTick(() => {
            add().then(async (data) => {
              // 重置表单
              await resetFields();
              id.value = null;
              await setFieldsValue({
                ...data,
              });
              changeLoading(false);
            });
          });
        });
      }

      return {
        treeRef,
        treeData,
        registerDrawer,
        registerForm,
        handleSubmit,
        handleSaveAndAdd,
        onBusinessSelectChange,
      };
    },
  });
</script>
