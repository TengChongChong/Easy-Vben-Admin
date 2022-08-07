<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:role:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:role:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="sys:role:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:role:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysRoleInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, add, get, remove } from '/@/api/auth/sysRole';
  import { columns, searchFormSchema } from '/@/views/auth/role/role.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import SysRoleInput from '/@/views/auth/role/Input.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'AuthRoleList',
    components: {
      PageWrapper,
      SysRoleInput,
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
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '角色',
        api: select,
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
       * 新增
       */
      function handleCreate() {
        add().then((data) => {
          openDrawer(true, data);
        });
      }
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
        reload,
        handleCreate,
        handleEdit,
      };
    },
  });
</script>
