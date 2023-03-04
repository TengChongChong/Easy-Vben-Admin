<template>
  <div :class="prefixCls">
    <a-popover
      v-model:visible="visible"
      trigger="click"
      :overlayClassName="`${prefixCls} ${prefixCls}__overlay`"
    >
      <a-badge :count="count" dot>
        <BellOutlined />
      </a-badge>
      <template #content>
        <a-tabs>
          <a-tab-pane key="message">
            <template #tab>
              消息
              <span v-if="messageList.length">({{ messageList.length }})</span>
            </template>
            <MessageList :list="messageList" @read="refreshMessage" />
          </a-tab-pane>
          <a-tab-pane key="to-do">
            <template #tab>
              待办
              <span v-if="toDoList.length">({{ toDoList.length }})</span>
            </template>
            <ToDoList :list="toDoList" @success="refreshTask" @hide="hidePopover" />
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import MessageList from './MessageList.vue';
  import ToDoList from './ToDoList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { SysMessage } from '/@/api/sys/model/sysMessageModel';
  import { selectReceive, selectUnreadCount } from '/@/api/sys/sysMessage';
  import { SysMessageDetailsStatus } from '/@/views/sys/message/message.data';
  import { getByKey } from '/@/api/sys/sysConfig';
  import { select as selectTask } from '/@/api/activiti/activitiTask';
  import { ActivitiTask } from '/@/api/activiti/model/activitiTaskModel';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    components: { BellOutlined, MessageList, ToDoList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      let timeStamp: Nullable<number> = null;

      const visible = ref<boolean>(false);

      const userStore = useUserStore();

      const hidePopover = () => {
        visible.value = false;
      };

      // 消息检查定时任务
      let messageCheckTimeout: Nullable<TimeoutHandle> = null;

      onMounted(async () => {
        refreshMessage();
        refreshTask();
        if (timeStamp == null) {
          try {
            // 获取后台配置的 新消息检查间隔时长
            await getByKey('messageCheckInterval').then((res) => {
              timeStamp = Number(res.value) * 1000;
            });
          } catch (e) {
            timeStamp = 1000 * 60 * 5;
          } finally {
            if (messageCheckTimeout == null) {
              refreshData();
            }
          }
        }
      });

      // 未读消息
      const messageList = ref<SysMessage[]>([]);
      // 待办任务
      const toDoList = ref<ActivitiTask[]>([]);

      const count = computed(() => {
        return messageList.value.length + toDoList.value.length;
      });

      function refreshData() {
        if (timeStamp) {
          messageCheckTimeout = setTimeout(() => {
            if (checkAuth()) {
              refreshMessage();
              refreshTask();
            }
          }, timeStamp);
        }
      }

      function refreshMessage() {
        selectUnreadCount().then((res) => {
          if (res > 0) {
            // 有未读消息
            selectReceive(
              { detailsStatus: SysMessageDetailsStatus.RECEIVE_STATUS_UNREAD },
              { pageSize: 20 },
            ).then((res) => {
              messageList.value = res.records as SysMessage[];
            });
          } else {
            messageList.value = [];
          }
        });
      }

      function refreshTask() {
        selectTask({ status: 'claimed' }, { pageSize: 20 }).then((res) => {
          toDoList.value = res.records!;
        });
      }

      /**
       * 检查是否已登录
       */
      function checkAuth() {
        if (userStore.getToken) {
          return true;
        } else {
          if (messageCheckTimeout) {
            clearTimeout(messageCheckTimeout);
          }
          return false;
        }
      }

      return {
        visible,
        prefixCls,
        messageList,
        toDoList,
        count,
        hidePopover,
        refreshTask,
        refreshMessage,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    &__overlay {
      max-width: 360px;

      .ant-popover-inner-content {
        padding-top: 0;
      }
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
