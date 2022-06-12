<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:dept:type:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:dept:type:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <Authority value="sys:dept:type:save">
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
          <a-button-add-sub auth="sys:dept:type:save" :id="record.id" @click="handleCreate" />
          <a-divider type="vertical" />
          <a-button-edit auth="sys:dept:type:save" :id="record.id" @click="handleEdit" />
          <a-divider type="vertical" />
          <a-button-remove
            auth="sys:dept:type:remove"
            :id="record.id"
            :api="remove"
            @success="reload"
          />
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDeptTypeInput @register="registerDrawer" @success="reload" />
    <SysDeptTypeOrder @register="registerOrderDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, add, get, remove } from '/@/api/auth/sysDeptType';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/auth/dept/type/dept-type.data';
  import { useDrawer } from '/@/components/Drawer';
  import AButtonAdd from '/@/components/Button/src/ButtonAdd.vue';
  import AButtonEdit from '/@/components/Button/src/ButtonEdit.vue';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  import { Icon } from '/@/components/Icon';
  import { clearTreeEmptyChildren, listToTree } from '/@/utils/helper/treeHelper';
  import SysDeptTypeInput from '/@/views/auth/dept/type/Input.vue';
  import SysDeptTypeOrder from '/@/views/auth/dept/type/Order.vue';
  import AButtonAddSub from '/@/components/Button/src/ButtonAddSub.vue';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'AuthDeptTypeList',
    components: {
      PageWrapper,
      Authority,
      AButtonAddSub,
      SysDeptTypeOrder,
      SysDeptTypeInput,
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
        title: '部门类型',
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
        add(id).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      };

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