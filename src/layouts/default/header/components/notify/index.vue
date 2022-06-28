<template>
  <div :class="prefixCls">
    <a-popover title="" trigger="click" :overlayClassName="`${prefixCls} ${prefixCls}__overlay`">
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
            <MessageList :list="messageList" />
          </a-tab-pane>
          <a-tab-pane key="to-do">
            <template #tab>
              待办
              <span v-if="toDoList.length">({{ toDoList.length }})</span>
            </template>
            todo: 待开发
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
  import { useDesign } from '/@/hooks/web/useDesign';
  import { SysMessage } from '/@/api/sys/model/sysMessageModel';
  import { selectReceive, selectUnreadCount } from '/@/api/sys/sysMessage';
  import { SysMessageDetailsStatus } from '/@/views/sys/message/message.data';
  import { getByKey } from '/@/api/sys/sysConfig';

  export default defineComponent({
    components: { BellOutlined, MessageList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      let timeStamp: Nullable<number> = null;

      // 消息检查定时任务
      let messageCheckTimeout: Nullable<TimeoutHandle> = null;

      onMounted(async () => {
        if (timeStamp == null) {
          try {
            // 获取后台配置的 新消息检查间隔时长
            getByKey('messageCheckInterval').then((res) => {
              timeStamp = Number(res.value) * 1000;
            });
          } catch (e) {
            timeStamp = 1000 * 60 * 5;
          } finally {
            if (messageCheckTimeout == null) {
              refreshMessage();
            }
          }
        }
      });

      // 未读消息
      const messageList = ref<SysMessage[]>([]);
      // 待办任务
      const toDoList = ref<SysMessage[]>([]);

      const count = computed(() => {
        return messageList.value.length + toDoList.value.length;
      });

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
          }
        });

        if (timeStamp) {
          messageCheckTimeout = setTimeout(() => {
            refreshMessage();
          }, timeStamp);
        }
      }

      return {
        prefixCls,
        messageList,
        toDoList,
        count,
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
