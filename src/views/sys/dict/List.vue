<template>
  <div>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add @click="handleCreate" />
        <a-button-remove-batch
          :id="checkedKeys"
          @click="handleRemove"
          v-model:loading="removeBatchLoading"
        />
        <a-button-link
          path="/sys/dict/type/list"
          text="字典类型管理"
          icon="ant-design:menu-outlined"
        />
        <a-button @click="reloadCache">
          <Icon icon="ant-design:reload-outlined" />
          刷新字典缓存
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-tooltip>
            <template #title>新增下级</template>
            <a-button type="link" size="small" @click="handleCreate(record.id, record.dictType)">
              <template #icon>
                <Icon icon="ant-design:plus-outlined" />
              </template>
            </a-button>
          </a-tooltip>

          <a-divider type="vertical" />
          <a-button-edit :id="record.id" @click="handleEdit" />
          <a-divider type="vertical" />
          <a-button-remove :id="record.id" @click="handleRemove" />
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDictInput @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, add, get, remove, refresh } from '/@/api/sys/sysDict';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/sys/dict/dict.data';
  import { useDrawer } from '/@/components/Drawer';
  import AButtonAdd from '/@/components/Button/src/ButtonAdd.vue';
  import AButtonEdit from '/@/components/Button/src/ButtonEdit.vue';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  import SysDictInput from '/@/views/sys/dict/Input.vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AButtonLink from '/@/components/Button/src/ButtonLink.vue';
  import { useDictStore } from '/@/store/modules/dict';

  export default defineComponent({
    name: 'SysDictList',
    components: {
      AButtonLink,
      Icon,
      SysDictInput,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      const { createMessage } = useMessage();

      // 按钮状态
      const removeBatchLoading = ref(false);
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm, setProps }] = useTable({
        title: '字典',
        api: select,
        columns,
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      nextTick(() => {
        // 设置表格查询条件
        setProps({
          useSearchForm: true,
          formConfig: {
            schemas: searchFormSchema(reloadTable),
          },
        });
      });

      /**
       * 新增
       *
       * @param id 上级id
       * @param dictType 字典类型
       */
      const handleCreate = (id: string | undefined, dictType: string | undefined) => {
        if (!dictType) {
          const queryData = getForm().getFieldsValue();
          dictType = queryData.dictType;
        }

        add(id, dictType).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleRemove = (id: string) => {
        remove(id).then(() => {
          removeBatchLoading.value = false;
          reload();
        });
      };

      const reloadTable = () => {
        nextTick(() => {
          reload();
        });
      };

      /**
       * 刷新redis缓存和本地缓存
       */
      const reloadCache = () => {
        refresh().then(() => {
          const dictStore = useDictStore();
          dictStore.initDict(true, () => {
            createMessage.success('刷新成功');
            reloadTable();
          });
        });
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        removeBatchLoading,
        registerDrawer,
        registerTable,
        reload,
        handleCreate,
        handleEdit,
        handleRemove,
        reloadCache,
      };
    },
  });
</script>
