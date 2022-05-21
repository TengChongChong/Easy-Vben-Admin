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
        <a-button @click="reloadCache">
          <Icon icon="ant-design:reload-outlined" />
          刷新字典缓存
        </a-button>
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
    <SysDictInput @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, add, get, remove, refresh } from '/@/api/sys/sysDict';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/sys/dict/dict.data';
  import { useDrawer } from '/@/components/Drawer';
  import AButtonAdd from '/@/components/Button/src/ButtonAdd.vue';
  import AButtonEdit from '/@/components/Button/src/ButtonEdit.vue';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  import SysDictInput from '/@/views/sys/dict/Input.vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'SysDictList',
    components: {
      Icon,
      SysDictInput,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      const { createMessage } = useMessage();

      // 批量删除按钮状态
      const removeBatchLoading = ref(false);
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm, setProps }] = useTable({
        title: '字典',
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
            schemas: searchFormSchema(reloadTable),
          },
        });
      });

      const handleCreate = (id: string | undefined) => {
        console.log('handleCreate');
        const queryData = getForm().getFieldsValue();
        add(id, queryData.dictType).then((data) => {
          openDrawer(true, {
            data,
            isUpdate: true,
          });
        });
      };
      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, {
            data,
            isUpdate: true,
          });
        });
      };
      const handleRemove = (id: string) => {
        remove(id).then(() => {
          removeBatchLoading.value = false;
          reload();
        });
      };

      const reloadTable = () => {
        nextTick(() => {
          reload();
        });
      };

      const reloadCache = () => {
        refresh().then(() => {
          createMessage.success('刷新成功');
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
        reloadCache,
      };
    },
  });
</script>
