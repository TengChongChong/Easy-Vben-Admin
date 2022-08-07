<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-remove small auth="sample:general:remove" :id="record.id" />
          </div>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { select } from '/@/api/sample/sampleGeneral';
  import { AButtonRemove } from '/@/components/Button';

  const columns: BasicColumn[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: true,
      width: 160,
      fixed: 'left',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      sorter: true,
      width: 150,
      format: 'dict|sex',
      filters: 'dict|sex',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      sorter: true,
      width: 160,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      sorter: true,
      width: 160,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      width: 460,
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      width: 150,
      format: 'dict|commonStatus',
      filters: 'dict|commonStatus',
    },
    {
      title: '编辑人',
      dataIndex: 'editUser',
      sorter: true,
      width: 160,
    },
    {
      title: '编辑时间',
      dataIndex: 'editDate',
      sorter: true,
      width: 160,
      format: 'date|YYYY-MM-DD HH:mm',
    },
  ];
  export default defineComponent({
    components: { AButtonRemove, BasicTable },
    setup() {
      const [registerTable] = useTable({
        title: '固定列示例',
        api: select,
        columns: columns,
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });
      return {
        registerTable,
      };
    },
  });
</script>
