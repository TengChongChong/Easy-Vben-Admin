<template>
  <BasicModal
    @register="register"
    :width="1080"
    title="消息详情"
    :showOkBtn="false"
    cancelText="关闭"
  >
    <div class="message-info">
      <div class="message-info-title">
        <h2>{{ messageInfo?.title }}</h2>
      </div>
      <div class="message-info-property">
        <a-avatar v-if="messageInfo?.avatar" :src="apiUrl + messageInfo?.avatar" />
        <a-avatar v-if="!messageInfo?.avatar">
          {{ messageInfo?.nickname?.substring(0, 1) }}
        </a-avatar>
        {{ messageInfo?.nickname }}

        <a-divider type="vertical" />
        {{ dayjs(messageInfo?.sendDate).format('YYYY-MM-DD HH:mm') }}
      </div>
      <a-divider />
      <div class="message-info-content" v-html="messageInfo?.content"></div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { SysMessage } from '/@/api/sys/model/sysMessageModel';
  import { useGlobSetting } from '/@/hooks/setting';
  import dayjs from 'dayjs';

  export default defineComponent({
    components: { BasicModal },
    setup() {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);

      const messageInfo = ref<Nullable<SysMessage>>();

      const [register, { setModalProps }] = useModalInner((data) => {
        setModalProps({ title: data.title });
        messageInfo.value = data;
      });

      return {
        dayjs,
        apiUrl,
        register,
        messageInfo,
      };
    },
  });
</script>
<style lang="less">
  .message-info {
    .message-info-title {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
    }

    .message-info-property {
      text-align: center;
    }

    .message-info-content {
      .editor-media {
        display: inline-block;
      }
    }
  }
</style>
