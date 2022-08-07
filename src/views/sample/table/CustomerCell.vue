<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'editUser'">
          <a-avatar>
            {{ record.editUser?.substring(0, 1) }}
          </a-avatar>
          {{ record.editUser }}
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select } from '/@/api/sample/sampleGeneral';
  import { getBasicColumns } from '/@/views/sample/table/tableData';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      const [registerTable] = useTable({
        title: '自定义列内容',
        titleHelpMessage: '自定义编辑人列',
        api: select,
        columns: getBasicColumns(),
        bordered: true,
        showTableSetting: true,
      });

      return {
        registerTable,
      };
    },
  });
</script>
