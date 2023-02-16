<template>
  <div class="sys-message-list">
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-remove-batch :id="checkedKeys" :api="removeByIds" @success="reload" />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <span
            @click="handleOpenInfoModel(record.id, record.messageId)"
            :class="['message-title', record.readDate == null ? 'unread' : '']"
          >
            {{ record.title }}
          </span>
        </template>
        <template v-if="column.key === 'nickname'">
          <a-avatar v-if="record.avatar" :src="apiUrl + record.avatar" />
          <a-avatar v-if="!record.avatar">{{ record.nickname?.substring(0, 1) }}</a-avatar>
          {{ record.nickname }}
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-remove small :id="record.id" :api="removeByIds" @success="reload" />
          </div>
        </template>
      </template>
    </BasicTable>
    <InfoModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import { selectReceive, info } from '/@/api/sys/sysMessage';
  import { removeByIds } from '/@/api/sys/sysMessageDetail';
  import { propTypes } from '/@/utils/propTypes';
  import dayjs from 'dayjs';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useModal } from '/@/components/Modal';
  import InfoModal from './InfoModal.vue';

  export default defineComponent({
    name: 'SysMessageReceiveList',
    components: {
      AButtonRemoveBatch,
      AButtonRemove,
      BasicTable,
      InfoModal,
    },
    props: {
      status: propTypes.string,
    },
    emits: ['editMessage'],
    setup(props) {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);
      const [registerModal, { openModal: openInfoModal }] = useModal();

      // 查询条件
      const searchInfo = reactive<Recordable>({ detailsStatus: props.status });

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '消息',
        api: selectReceive,
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
            sorter: true,
            width: 400,
          },
          {
            title: '状态',
            dataIndex: 'detailsStatus',
            sorter: true,
            width: 150,
            format: 'dict|messageStatus',
            filters: 'dict|messageStatus',
          },
          {
            title: '发送人',
            dataIndex: 'nickname',
            sorter: true,
            width: 160,
          },
          {
            title: '收信时间',
            dataIndex: 'sendDate',
            sorter: true,
            width: 160,
            format: 'date|YYYY-MM-DD HH:mm',
          },
          {
            title: '类型',
            dataIndex: 'type',
            sorter: true,
            width: 150,
            format: 'dict|messageType',
            filters: 'dict|messageType',
          },
        ],
        useSearchForm: true,
        formConfig: {
          schemas: [
            {
              field: 'title',
              label: '标题',
              component: 'Input',
            },
            {
              field: '[startSendDate, endSendDate]',
              label: '收信时间',
              component: 'RangePicker',
              componentProps: {
                allowEmpty: [true, true],
                ranges: {
                  今天: [dayjs().startOf('day'), dayjs().endOf('day')],
                  本周: [dayjs().startOf('week'), dayjs().endOf('week')],
                  本月: [dayjs().startOf('month'), dayjs().endOf('month')],
                },
              },
            },
          ],
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      function handleOpenInfoModel(id: string, messageId: string) {
        info(id, messageId).then((res) => {
          openInfoModal(true, res);
          reload();
        });
      }

      return {
        checkedKeys,
        searchInfo,
        apiUrl,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        removeByIds,
        registerModal,
        registerTable,
        reload,
        handleOpenInfoModel,
      };
    },
  });
</script>
<style lang="less">
  .sys-message-list {
    .@{namespace}-basic-table {
      padding-top: 0;
    }

    .message-title {
      cursor: pointer;

      &.unread {
        font-weight: bold;
      }
    }
  }
</style>
