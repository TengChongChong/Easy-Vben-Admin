<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:dept:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:dept:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <a-button-link
          auth="sys:dept:type:save"
          icon="ant-design:menu-outlined"
          path="/auth/dept/type/list"
          text="部门类型管理"
        />
        <Authority value="sys:dept:save">
          <a-button @click="handleOrder">
            <template #icon> <Icon icon="ant-design:ordered-list-outlined" /> </template> 排序
          </a-button>
        </Authority>

        <a-button @click="expandAll">
          <template #icon> <Icon icon="ant-design:plus-outlined" /> </template> 展开全部
        </a-button>
        <a-button @click="collapseAll">
          <template #icon> <Icon icon="ant-design:minus-outlined" /> </template>折叠全部
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-add-sub small auth="sys:dept:save" :id="record.id" @click="handleCreate" />
            <a-divider type="vertical" />
            <a-button-edit small auth="sys:dept:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:dept:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDeptInput @register="registerDrawer" @success="reload" />
    <SysDeptOrder @register="registerOrderDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, add, get, remove } from '/@/api/auth/sysDept';
  import { columns, searchFormSchema } from '/@/views/auth/dept/dept.data';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonEdit,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonAddSub,
    AButtonLink,
  } from '/@/components/Button';
  import { Icon } from '/@/components/Icon';
  import { clearTreeEmptyChildren, listToTree } from '/@/utils/helper/treeHelper';
  import SysDeptInput from '/@/views/auth/dept/Input.vue';
  import SysDeptOrder from '/@/views/auth/dept/Order.vue';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'AuthDeptList',
    components: {
      PageWrapper,
      AButtonLink,
      Authority,
      AButtonAddSub,
      SysDeptOrder,
      SysDeptInput,
      Icon,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      // 部门类型排序
      const [registerOrderDrawer, { openDrawer: openOrderDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, expandAll, collapseAll }] = useTable({
        title: '部门',
        api: select,
        afterFetch: (items) => {
          const tree = listToTree(items);
          return clearTreeEmptyChildren(tree, 'children');
        },
        isTreeTable: true,
        pagination: false,
        showIndexColumn: false,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
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
        add(id, undefined).then((data) => {
          openDrawer(true, data);
        });
      };
      function handleEdit(id: string) {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      }

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
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
      };
    },
  });
</script>
