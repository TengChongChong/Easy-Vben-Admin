<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:dict:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:dict:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <Authority value="sys:dict:type:save">
          <a-button-link
            path="/sys/dict/type/list"
            text="字典类型管理"
            icon="ant-design:menu-outlined"
          />
        </Authority>
        <Authority value="sys:dict:save">
          <a-button @click="reloadCache">
            <Icon icon="ant-design:reload-outlined" />
            刷新缓存
          </a-button>
        </Authority>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-tag v-if="record.displayType" :color="record.displayType">{{ record.name }}</a-tag>
          <span v-else>{{ record.name }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-tooltip>
              <template #title>新增下级</template>
              <a-button
                auth="sys:dict:save"
                type="link"
                size="small"
                @click="handleCreate(record.id, record.dictType)"
              >
                <template #icon>
                  <Icon icon="ant-design:plus-outlined" />
                </template>
              </a-button>
            </a-tooltip>

            <a-divider type="vertical" />
            <a-button-edit small auth="sys:dict:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:dict:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDictInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, add, get, remove, refresh } from '/@/api/sys/sysDict';
  import { columns } from '/@/views/sys/dict/dict.data';
  import { useDrawer } from '/@/components/Drawer';
  import {
    AButtonAdd,
    AButtonEdit,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonLink,
  } from '/@/components/Button';
  import SysDictInput from '/@/views/sys/dict/Input.vue';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDictStore } from '/@/store/modules/dict';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';
  import { selectAll } from '/@/api/sys/sysDictType';

  export default defineComponent({
    name: 'SysDictList',
    components: {
      PageWrapper,
      Authority,
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

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload, getForm }] = useTable({
        title: '字典',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: [
            {
              field: 'dictType',
              label: '类型',
              component: 'ApiSelect',
              componentProps: {
                api: selectAll,
                onChange: () => {
                  reloadTable();
                },
              },
            },
            {
              field: 'code',
              label: '编码',
              component: 'Input',
            },
            {
              field: 'name',
              label: '名称',
              component: 'Input',
            },
          ],
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
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
      function handleEdit(id: string) {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      }

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
        remove,
        registerDrawer,
        registerTable,
        reload,
        handleCreate,
        handleEdit,
        reloadCache,
      };
    },
  });
</script>
