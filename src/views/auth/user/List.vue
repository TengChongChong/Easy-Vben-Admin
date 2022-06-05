<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add v-if="searchInfo.deptId" auth="sys:user:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:user:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <a-avatar v-if="record.avatar" :src="apiUrl + record.avatar" />
          <a-avatar v-if="!record.avatar">{{ record.nickname.substring(0, 1) }}</a-avatar>
        </template>

        <template v-if="column.key === 'action'">
          <a-tooltip>
            <template #title>重置密码</template>
            <a-popconfirm
              title="确定要重置为默认密码吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleResetPassword(record.id)"
            >
              <a-button type="link" danger size="small">
                <template #icon>
                  <Icon icon="ant-design:redo-outlined" />
                </template>
              </a-button>
            </a-popconfirm>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-button-edit auth="sys:user:save" :id="record.id" @click="handleEdit" />
          <a-divider type="vertical" />
          <a-button-remove auth="sys:user:remove" :id="record.id" :api="remove" @success="reload" />
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysUserInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { useTable } from '/@/components/Table';
  import { select, add, get, remove, resetPassword } from '/@/api/auth/sysUser';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { columns, searchFormSchema } from '/@/views/auth/user/user.data';
  import { useDrawer } from '/@/components/Drawer';
  import AButtonAdd from '/@/components/Button/src/ButtonAdd.vue';
  import AButtonEdit from '/@/components/Button/src/ButtonEdit.vue';
  import AButtonRemove from '/@/components/Button/src/ButtonRemove.vue';
  import AButtonRemoveBatch from '/@/components/Button/src/ButtonRemoveBatch.vue';
  import SysUserInput from '/@/views/auth/user/Input.vue';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from '/@/views/auth/user/DeptTree.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Icon } from '/@/components/Icon';
  import { Modal } from 'ant-design-vue';

  export default defineComponent({
    name: 'AuthUserList',
    components: {
      Icon,
      DeptTree,
      PageWrapper,
      SysUserInput,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      const searchInfo = reactive<Recordable>({});

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '用户',
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

      /**
       * 新增
       */
      const handleCreate = () => {
        add(searchInfo.deptId).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      };
      const handleResetPassword = (id: string) => {
        resetPassword(id).then((password) => {
          Modal.success({
            title: '重置成功',
            content: `密码已重置为 ${password}`,
          });
        });
      };

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      return {
        apiUrl,
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        searchInfo,
        handleSelect,
        registerDrawer,
        registerTable,
        reload,
        handleCreate,
        handleEdit,
        handleResetPassword,
      };
    },
  });
</script>
