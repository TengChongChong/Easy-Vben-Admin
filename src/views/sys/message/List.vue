<template>
  <div class="sys-message-list">
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-remove-batch v-if="canEdit" :id="checkedKeys" :api="remove" @success="reload" />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <span style="cursor: pointer" @click="handleOpenInfoModel(record.id)">
            {{ record.title }}
          </span>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-tooltip>
              <template #title>发送</template>
              <a-popconfirm
                title="发送后无法修改或删除，确定要立即发送吗？"
                ok-text="是"
                cancel-text="否"
                @confirm="handleSend(record.id)"
              >
                <a-button type="link" size="small">
                  <template #icon>
                    <Icon icon="ant-design:send-outlined" />
                  </template>
                </a-button>
              </a-popconfirm>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-button-edit small :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove small :id="record.id" :api="remove" @success="reload" />
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
  import { SysMessageStatus } from '/@/views/sys/message/message.data';
  import { Icon } from '/@/components/Icon';
  import { AButtonRemove, AButtonRemoveBatch, AButtonEdit } from '/@/components/Button';
  import { select, send, remove, info } from '/@/api/sys/sysMessage';
  import { propTypes } from '/@/utils/propTypes';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import InfoModal from '/@/views/sys/message/InfoModal.vue';

  export default defineComponent({
    name: 'SysMessageList',
    components: {
      InfoModal,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      BasicTable,
      Icon,
    },
    props: {
      status: propTypes.string,
    },
    emits: ['edit-message'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      // 查询条件
      const searchInfo = reactive<Recordable>({ status: props.status });
      const canEdit = ref<boolean>(SysMessageStatus.HAS_BEEN_SENT !== props.status);

      const [registerModal, { openModal: openInfoModal }] = useModal();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '消息',
        api: select,
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
            sorter: true,
            width: 400,
          },
          {
            title: '发送时间',
            dataIndex: 'sendDate',
            sorter: true,
            width: 160,
            format: 'date|YYYY-MM-DD HH:mm',
            ifShow: () => SysMessageStatus.HAS_BEEN_SENT === props.status,
          },
          {
            title: '创建时间',
            dataIndex: 'createDate',
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
              label: '发送时间',
              component: 'RangePicker',
              componentProps: {
                allowEmpty: [true, true],
                ranges: {
                  今天: [dayjs().startOf('day'), dayjs().endOf('day')],
                  本周: [dayjs().startOf('week'), dayjs().endOf('week')],
                  本月: [dayjs().startOf('month'), dayjs().endOf('month')],
                },
              },
              ifShow: () => SysMessageStatus.HAS_BEEN_SENT === props.status,
            },
          ],
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
          // 已发送不允许修改或删除
          ifShow: () => SysMessageStatus.HAS_BEEN_SENT !== props.status,
        },
      });

      function handleEdit(id: string) {
        emit('edit-message', id);
      }

      const handleSend = (id: string) => {
        send(id).then(() => {
          createMessage.success('发送成功');
          reload();
        });
      };

      function handleOpenInfoModel(id: string) {
        info(null, id).then((res) => {
          openInfoModal(true, res);
        });
      }

      return {
        checkedKeys,
        searchInfo,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        registerModal,
        registerTable,
        handleEdit,
        handleSend,
        handleOpenInfoModel,
        reload,
        canEdit,
      };
    },
  });
</script>
<style lang="less">
  .sys-message-list {
    .@{namespace}-basic-table {
      padding-top: 0;
    }
  }
</style>
