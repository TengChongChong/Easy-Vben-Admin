<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-remove-batch
          auth="sys:exception:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-info small :path="`/sys/exception/info/${record.id}`" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:exception:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, remove } from '/@/api/sys/sysException';
  import { columns, searchFormSchema } from '/@/views/sys/exception/exception.data';
  import { AButtonRemove, AButtonRemoveBatch, AButtonInfo } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SysExceptionList',
    components: {
      AButtonInfo,
      PageWrapper,
      AButtonRemoveBatch,
      AButtonRemove,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '异常日志',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
          actionColOptions: { xxl: 6, xl: 8, md: 24 },
        },
        actionColumn: {
          width: 100,
          title: '操作',
          key: 'action',
        },
      });

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        registerTable,
        reload,
      };
    },
  });
</script>
