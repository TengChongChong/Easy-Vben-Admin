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
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button-edit :id="record.id" @click="handleEdit" />
          <a-divider type="vertical" />
          <a-button-remove :id="record.id" @click="handleRemove" />
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDictTypeInput @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, add, get, remove } from '/@/api/sys/sysDictType';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/sys/dict/type/dict-type.data';
  import { useDrawer } from '/@/components/Drawer';
  import SysDictTypeInput from '/@/views/sys/dict/type/Input.vue';
  import AButtonAdd from '/@/components/Button/src/ButtonAdd.vue';
  import AButtonEdit from '/@/components/Button/src/ButtonEdit.vue';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  export default defineComponent({
    name: 'SysDictTypeList',
    components: {
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      SysDictTypeInput,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      // 按钮状态
      const removeBatchLoading = ref(false);

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, setProps }] = useTable({
        title: '字典类型',
        api: select,
        columns,
        actionColumn: {
          width: 100,
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

      const handleCreate = () => {
        add().then((data) => {
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
        reload,
        handleCreate,
        handleEdit,
        handleRemove,
      };
    },
  });
</script>
