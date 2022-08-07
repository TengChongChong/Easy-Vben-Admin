<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getMultipleHeaderColumns } from './tableData';
  import { select } from '/@/api/sample/sampleGeneral';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      const [registerTable] = useTable({
        title: '多级表头示例',
        api: select,
        columns: getMultipleHeaderColumns(),
      });

      return {
        registerTable,
      };
    },
  });
</script>
