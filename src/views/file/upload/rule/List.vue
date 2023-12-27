<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="file:upload:rule:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="file:upload:rule:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'fileSizeLimit'">
          {{ formatSize(record.lowerLimit * 1024, 1) }} ~
          {{ formatSize(record.upperLimit * 1024, 1) }}
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="file:upload:rule:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="file:upload:rule:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <FileUploadRuleInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/file/upload/rule/rule.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import { add, remove, select, get } from '/@/api/file/fileUploadRule';
  import FileUploadRuleInput from '/@/views/file/upload/rule/Input.vue';
  import { formatSize } from '/@/utils/file/format';

  export default defineComponent({
    name: 'FileUploadRuleList',
    components: {
      PageWrapper,
      FileUploadRuleInput,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      const [registerDrawer, { openDrawer }] = useDrawer();

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '文件上传规则',
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

      const handleCreate = () => {
        add().then((data) => {
          openDrawer(true, data);
        });
      };

      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        searchInfo,
        remove,
        registerDrawer,
        registerTable,
        handleCreate,
        handleEdit,
        reload,
        formatSize,
      };
    },
  });
</script>
