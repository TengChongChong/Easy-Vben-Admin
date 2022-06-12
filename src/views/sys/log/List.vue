<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-tooltip>
            <template #title>详情</template>
            <a-button-link
              type="link"
              size="small"
              :path="`/sys/log/info/${record.id}`"
              icon="ant-design:search-outlined"
            />
          </a-tooltip>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select } from '/@/api/sys/sysLog';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/sys/log/log.data';
  import { PageWrapper } from '/@/components/Page';
  import AButtonLink from '/@/components/Button/src/ButtonLink.vue';

  export default defineComponent({
    name: 'SysLogList',
    components: {
      AButtonLink,
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
