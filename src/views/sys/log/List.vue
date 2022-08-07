<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-info small :path="`/sys/log/info/${record.id}`" />
          </div>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select } from '/@/api/sys/sysLog';
  import { columns, searchFormSchema } from '/@/views/sys/log/log.data';
  import { PageWrapper } from '/@/components/Page';
  import { AButtonInfo } from '/@/components/Button';

  export default defineComponent({
    name: 'SysLogList',
    components: {
      AButtonInfo,
      PageWrapper,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '访问日志',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
          actionColOptions: { xxl: 12, xl: 24, md: 24 },
        },
        actionColumn: {
          width: 80,
          title: '操作',
          key: 'action',
        },
      });

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        registerTable,
        reload,
      };
    },
  });
</script>
