<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      row-key="sessionId"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <a-avatar v-if="record.avatar" :src="apiUrl + record.avatar" />
          <a-avatar v-if="!record.avatar">{{ record.nickname?.substring(0, 1) }}</a-avatar>
        </template>

        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <Authority value="sys:online:force">
              <a-tooltip>
                <template #title>强制退出</template>
                <a-popconfirm
                  title="确定要强制退出吗？"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="handleForceLogin(record.sessionId)"
                >
                  <a-button type="link" danger size="small">
                    <template #icon>
                      <Icon icon="ant-design:logout-outlined" />
                    </template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </Authority>
          </div>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from '/@/views/auth/user/online/online.data';
  import { PageWrapper } from '/@/components/Page';
  import { select, forceLogin } from '/@/api/auth/sysUserOnline';
  import { Authority } from '/@/components/Authority';
  import { Icon } from '/@/components/Icon';
  import { SysUserOnline } from '/@/api/auth/model/sysUserOnlineModel';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    name: 'AuthUserOnlineList',
    components: {
      PageWrapper,
      BasicTable,
      Authority,
      Icon,
    },
    setup() {
      const globSetting = useGlobSetting();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      onMounted(() => {
        reload();
      });

      /**
       * 初始化表格
       */
      const [registerTable, { setProps, getForm }] = useTable({
        title: '在线用户',
        columns,
        useSearchForm: true,
        tableSetting: {
          redo: false,
        },
        formConfig: {
          submitFunc: () => {
            return new Promise(function (resolve) {
              reload();
              resolve();
            });
          },
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 100,
          title: '操作',
          key: 'action',
        },
      });

      function reload() {
        select(getForm().getFieldsValue() as SysUserOnline).then((res) => {
          setProps({
            dataSource: res,
          });
        });
      }

      function handleForceLogin(sessionId) {
        forceLogin(sessionId).then(() => {
          reload();
        });
      }

      return {
        apiUrl: globSetting.apiUrl,
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        registerTable,
        handleForceLogin,
      };
    },
  });
</script>
