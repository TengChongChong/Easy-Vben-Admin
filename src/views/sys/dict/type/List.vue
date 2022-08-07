<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:dict:type:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:dict:type:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="sys:dict:type:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:dict:type:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDictTypeInput @register="registerModal" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, add, get, remove } from '/@/api/sys/sysDictType';
  import { columns, searchFormSchema } from '/@/views/sys/dict/type/dict-type.data';
  import SysDictTypeInput from '/@/views/sys/dict/type/Input.vue';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  export default defineComponent({
    name: 'SysDictTypeList',
    components: {
      PageWrapper,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      SysDictTypeInput,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerModal, { openModal }] = useModal();
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '字典类型',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 100,
          title: '操作',
          key: 'action',
        },
      });

      function handleCreate() {
        add().then((data) => {
          openModal(true, data);
        });
      }
      function handleEdit(id: string) {
        get(id).then((data) => {
          openModal(true, data);
        });
      }

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        registerModal,
        registerTable,
        reload,
        handleCreate,
        handleEdit,
      };
    },
  });
</script>
