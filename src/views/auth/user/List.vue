<template>
  <PageWrapper dense>
    <a-row>
      <a-col :xxl="6" :xl="8" :lg="10" :md="12" :sm="24">
        <div class="m-4 md:mr-0 mb-0 overflow-hidden bg-white">
          <DeptTree @select="handleSelect" />
        </div>
      </a-col>
      <a-col :xxl="18" :xl="16" :lg="14" :md="12" :sm="24">
        <!-- 表格 -->
        <BasicTable
          @register="registerTable"
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
              <a-avatar v-if="!record.avatar">{{ record.nickname?.substring(0, 1) }}</a-avatar>
            </template>

            <template v-if="column.key === 'action'">
              <div class="basic-table-action center">
                <Authority value="sys:user:save">
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
                </Authority>
                <a-divider type="vertical" />
                <a-button-edit small auth="sys:user:save" :id="record.id" @click="handleEdit" />
                <a-divider type="vertical" />
                <a-button-remove
                  small
                  auth="sys:user:remove"
                  :id="record.id"
                  :api="remove"
                  @success="reload"
                />
              </div>
            </template>
          </template>
        </BasicTable>
      </a-col>
    </a-row>
    <!-- 表单 -->
    <SysUserInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, add, get, remove, resetPassword } from '/@/api/auth/sysUser';
  import { columns, searchFormSchema } from '/@/views/auth/user/user.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import SysUserInput from '/@/views/auth/user/Input.vue';
  import { PageWrapper } from '/@/components/Page';
  import { DeptTree } from '/@/components/Dept';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Authority } from '/@/components/Authority';
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
      Authority,
    },
    setup() {
      const globSetting = useGlobSetting();
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
          baseColProps: {
            xxl: 8,
            xl: 12,
            lg: 24,
          },
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
      function handleCreate() {
        add(searchInfo.deptId).then((data) => {
          openDrawer(true, data);
        });
      }
      function handleEdit(id: string) {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      }
      const handleResetPassword = (id: string) => {
        resetPassword(id).then((password) => {
          Modal.success({
            title: '重置成功',
            content: `密码已重置为 ${password}，请告知用户使用新密码登录`,
          });
        });
      };

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      return {
        apiUrl: globSetting.apiUrl,
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
