<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sample:slave:general:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sample:slave:general:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit
              small
              auth="sample:slave:general:save"
              :id="record.id"
              @click="handleEdit"
            />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sample:slave:general:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SampleSlaveGeneralInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { add, remove, select, get } from '/@/api/sample/slave/sampleSlaveGeneral';
  import { searchFormSchema, columns } from '/@/views/sample/page/slave/general/general.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonRemove, AButtonRemoveBatch, AButtonEdit } from '/@/components/Button';
  import SampleSlaveGeneralInput from '/@/views/sample/page/slave/general/Input.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SamplePageSlaveGeneralList',
    components: {
      PageWrapper,
      SampleSlaveGeneralInput,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
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
        title: '从库示例',
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
        handleCreate,
        handleEdit,
        reload,
      };
    },
  });
</script>
