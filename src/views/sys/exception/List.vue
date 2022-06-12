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
          <a-tooltip>
            <template #title>详情</template>
            <a-button-link
              type="link"
              size="small"
              :path="`/sys/exception/info/${record.id}`"
              icon="ant-design:search-outlined"
            />
          </a-tooltip>

          <a-divider type="vertical" />
          <a-button-remove
            auth="sys:exception:remove"
            :id="record.id"
            :api="remove"
            @success="reload"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, remove } from '/@/api/sys/sysException';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/sys/exception/exception.data';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  import { PageWrapper } from '/@/components/Page';
  import AButtonLink from '/@/components/Button/src/ButtonLink.vue';

  export default defineComponent({
    name: 'SysExceptionList',
    components: {
      AButtonLink,
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
