<template>
  <!-- 此处添加`a-form-item-rest`为解决警告问题 -->
  <a-form-item-rest>
    <BasicModal :width="960" v-bind="$attrs" @register="register" title="选择用户" @ok="handleSave">
      <div class="user-modal-select">
        <a-row>
          <a-col :xxl="8" :xl="10" :lg="12" :md="24">
            <div class="vben-border overflow-hidden mr-4 bg-white">
              <DeptTree @select="handleDeptSelect" />
            </div>
          </a-col>
          <a-col :xxl="16" :xl="14" :lg="12" :md="24">
            <a-form :model="queryInfo" layout="inline">
              <a-form-item label="用户名">
                <a-input v-model:value="queryInfo.username" />
              </a-form-item>
              <a-form-item label="昵称">
                <a-input v-model:value="queryInfo.nickname" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="handleSelectUser">查询</a-button>
              </a-form-item>
            </a-form>

            <a-alert class="!mt-4" type="info" show-icon banner>
              <template #message>
                <template v-if="checkedKeys.length === 0">未选中任何数据</template>
                <template v-else>
                  已选中{{ checkedKeys.length }}条记录
                  {{ selectionType === 'checkbox' ? '，可跨页或跨部门选择' : '' }}
                  <a-button type="link" @click="checkedKeys = []">清空</a-button>
                </template>
              </template>
            </a-alert>
            <a-table
              class="mt-4"
              size="middle"
              row-key="id"
              :bordered="true"
              :dataSource="dataSource"
              :columns="columns"
              :pagination="pagination"
              :row-selection="{
                type: selectionType,
                preserveSelectedRowKeys: true,
                selectedRowKeys: checkedKeys,
                onChange: onSelectChange,
              }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'username'">
                  <a-avatar v-if="record.avatar" :src="apiUrl + record.avatar" />
                  <a-avatar v-if="!record.avatar">{{ record.nickname?.substring(0, 1) }}</a-avatar>
                  {{ record.username }}
                </template>
                <template v-if="column.dataIndex === 'sex'">
                  <dict-tag dictType="sex" :value="record.sex" />
                </template>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </div>
    </BasicModal>
  </a-form-item-rest>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { select } from '/@/api/auth/sysUser';
  import { DeptTree } from '/@/components/Dept';
  import { SysUser } from '/@/api/auth/model/sysUserModel';
  import { useGlobSetting } from '/@/hooks/setting';
  import DictTag from '/@/components/Dict/src/components/DictTag.vue';
  import { isArray } from '/@/utils/is';

  export default defineComponent({
    components: { DictTag, DeptTree, BasicModal },
    setup(_, { emit }) {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);

      const queryInfo = ref<SysUser>({});
      const columns = ref([
        {
          title: '用户名',
          dataIndex: 'username',
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
      ]);
      const selectionType = ref<string>('checkbox');
      const dataSource = ref([]);
      const pagination = ref({
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
      });

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      function handleSelectUser() {
        select(unref(queryInfo), unref(pagination)).then((res) => {
          if (res && res.records) {
            const { total, current, pageSize } = res;
            // @ts-ignore
            dataSource.value = res.records;
            // @ts-ignore
            pagination.value = { ...pagination.value, total, current, pageSize };
          }
        });
      }

      function handleSave() {
        emit('update', checkedKeys.value);
        closeModal();
      }

      function handleDeptSelect(deptId = '') {
        queryInfo.value.deptId = deptId;
        handleSelectUser();
      }

      const [register, { closeModal }] = useModalInner(({ selectKeys, multiple }) => {
        selectionType.value = multiple ? 'checkbox' : 'radio';
        if (selectKeys) {
          if (isArray(selectKeys)) {
            checkedKeys.value = selectKeys;
          } else {
            checkedKeys.value = [selectKeys];
          }
        } else {
          checkedKeys.value = [];
        }
      });

      return {
        apiUrl,
        columns,
        dataSource,
        queryInfo,
        pagination,
        checkedKeys,
        selectionType,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        register,
        handleSelectUser,
        handleDeptSelect,
        handleSave,
      };
    },
  });
</script>
