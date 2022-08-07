<template>
  <div>
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <template v-if="!record.editable">
            <a-button-edit @click="handleEdit(record)" />
            <a-divider type="vertical" />
            <a-button-remove />
          </template>
          <template v-else>
            <a-button-save @click="handleSave(record)" />
            <a-divider type="vertical" />
            <a-button-cancel @click="handleCancel(record)" />
          </template>
        </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd"> 新增成员 </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, BasicColumn, EditRecordRow } from '/@/components/Table';
  import { AButtonEdit, AButtonRemove, AButtonSave, AButtonCancel } from '/@/components/Button';

  const columns: BasicColumn[] = [
    {
      title: '成员姓名',
      dataIndex: 'name',
      editRow: true,
    },
    {
      title: '工号',
      dataIndex: 'no',
      editRow: true,
    },
    {
      title: '所属部门',
      dataIndex: 'dept',
      editRow: true,
    },
  ];

  const data: any[] = [
    {
      name: 'John Brown',
      no: '00001',
      dept: 'New York No. 1 Lake Park',
    },
    {
      name: 'John Brown2',
      no: '00002',
      dept: 'New York No. 2 Lake Park',
    },
    {
      name: 'John Brown3',
      no: '00003',
      dept: 'New York No. 3Lake Park',
    },
  ];
  export default defineComponent({
    components: {
      AButtonRemove,
      AButtonEdit,
      AButtonSave,
      AButtonCancel,
      BasicTable,
    },
    setup() {
      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        showIndexColumn: false,
        dataSource: data,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
        },
        pagination: false,
      });

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false);
        if (record.isNew) {
          const data = getDataSource();
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
        }
      }

      function handleSave(record: EditRecordRow) {
        record.onEdit?.(false, true);
      }

      function handleEditChange(data: Recordable) {
        console.log(data);
      }

      function handleAdd() {
        const data = getDataSource();
        const addRow: EditRecordRow = {
          name: '',
          no: '',
          dept: '',
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        };
        data.push(addRow);
      }

      return {
        registerTable,
        handleEdit,
        handleSave,
        handleAdd,
        getDataSource,
        handleCancel,
        handleEditChange,
      };
    },
  });
</script>
