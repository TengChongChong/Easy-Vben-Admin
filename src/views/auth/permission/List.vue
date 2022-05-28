<template>
  <div>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add @click="handleCreate" />
        <a-button-remove-batch
          :id="checkedKeys"
          @click="handleRemove"
          v-model:loading="removeBatchLoading"
        />

        <a-button @click="handleOrder">
          <template #icon> <Icon icon="ant-design:ordered-list-outlined" /> </template> 排序
        </a-button>
        <a-button @click="expandAll">
          <template #icon> <Icon icon="ant-design:plus-outlined" /> </template> 展开全部
        </a-button>
        <a-button @click="collapseAll">
          <template #icon> <Icon icon="ant-design:minus-outlined" /> </template>折叠全部
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button-add-sub :id="record.id" @click="handleCreate" />
          <a-divider type="vertical" />
          <a-button-edit :id="record.id" @click="handleEdit" />
          <a-divider type="vertical" />
          <a-button-remove :id="record.id" @click="handleRemove" />
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysPermissionInput @register="registerDrawer" @success="reload" />
    <SysPermissionOrder @register="registerOrderDrawer" @success="reload" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, add, get, remove } from '/@/api/auth/sysPermission';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/auth/permission/permission.data';
  import { useDrawer } from '/@/components/Drawer';
  import AButtonAdd from '/@/components/Button/src/ButtonAdd.vue';
  import AButtonEdit from '/@/components/Button/src/ButtonEdit.vue';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { clearTreeEmptyChildren, listToTree } from '/@/utils/helper/treeHelper';
  import SysPermissionInput from '/@/views/auth/permission/Input.vue';
  import SysPermissionOrder from '/@/views/auth/permission/Order.vue';
  import AButtonAddSub from '/@/components/Button/src/ButtonAddSub.vue';

  export default defineComponent({
    name: 'SysPermissionList',
    components: {
      AButtonAddSub,
      SysPermissionOrder,
      SysPermissionInput,
      Icon,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      // 按钮状态
      const removeBatchLoading = ref(false);

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      // 菜单排序
      const [registerOrderDrawer, { openDrawer: openOrderDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, setProps, expandAll, collapseAll }] = useTable({
        title: '菜单',
        api: select,
        afterFetch: (items) => {
          const tree = listToTree(items);
          return clearTreeEmptyChildren(tree, 'children');
        },
        isTreeTable: true,
        pagination: false,
        showIndexColumn: false,
        columns,
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      nextTick(() => {
        // 设置表格查询条件
        setProps({
          useSearchForm: true,
          formConfig: {
            schemas: searchFormSchema(),
          },
        });
      });

      /**
       * 排序
       */
      const handleOrder = () => {
        openOrderDrawer(true, {});
      };

      /**
       * 新增
       *
       * @param id 上级id
       */
      const handleCreate = (id: string | undefined) => {
        add(id).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleRemove = (id: string) => {
        remove(id).then(() => {
          removeBatchLoading.value = false;
          reload();
        });
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        removeBatchLoading,
        registerDrawer,
        registerTable,
        registerOrderDrawer,
        openOrderDrawer,
        reload,
        expandAll,
        collapseAll,
        handleOrder,
        handleCreate,
        handleEdit,
        handleRemove,
      };
    },
  });
</script>
