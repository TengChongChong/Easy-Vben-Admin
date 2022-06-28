<template>
  <PageWrapper>
    <a-row>
      <a-col :xxl="4" :xl="6" :lg="8" :md="10">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          :border="false"
          @click="handleMenuClick"
        >
          <a-menu-item :key="item.key" v-for="item in menuData">
            <template #icon>
              <Icon :icon="`ant-design:${item.icon}`" />
            </template>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col :xxl="20" :xl="18" :lg="16" :md="14">
        <!-- 写消息 -->
        <div v-if="selectedKeys[0] === 'add'" class="sys-message-wrapper">
          <div class="bg-white p-4">
            <sys-message-input :id="id" />
          </div>
        </div>

        <!-- 收信箱 -->
        <sys-message-receive-list v-if="selectedKeys[0] === 'receive'" />

        <!-- 草稿箱 -->
        <sys-message-list
          v-if="selectedKeys[0] === 'draft'"
          :status="SysMessageStatus.DRAFT"
          @edit-message="editMessage"
        />
        <!-- 已发送 -->
        <sys-message-list
          v-if="selectedKeys[0] === 'has-been-sent'"
          :status="SysMessageStatus.HAS_BEEN_SENT"
          @edit-message="editMessage"
        />
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import SysMessageList from '/@/views/sys/message/List.vue';
  import { useRouter } from 'vue-router';
  import { SysMessageDetailsStatus, SysMessageStatus } from '/@/views/sys/message/message.data';
  import SysMessageInput from '/@/views/sys/message/Input.vue';
  import SysMessageReceiveList from '/@/views/sys/message/ReceiveList.vue';

  export default defineComponent({
    name: 'SysMessageView',
    components: { SysMessageReceiveList, SysMessageInput, SysMessageList, PageWrapper, Icon },
    setup() {
      const menuData = [
        { key: 'add', title: '写消息', icon: 'edit-outlined' },
        { key: 'receive', title: '收信箱', icon: 'mail-outlined' },
        { key: 'draft', title: '草稿箱', icon: 'container-outlined' },
        { key: 'has-been-sent', title: '已发送', icon: 'check-circle-outlined' },
      ];

      const { currentRoute } = useRouter();
      const selectedKeys = ref<string[]>(['receive']);

      const id = ref<Nullable<string>>();

      const pageKey = ref<string>(unref(currentRoute).params?.key as string);
      if (pageKey.value) {
        selectedKeys.value = [unref(pageKey)];
      }

      function handleMenuClick({ key }) {
        if ('add' === key) {
          id.value = null;
        }
      }

      function editMessage(key) {
        id.value = key;
        selectedKeys.value = ['add'];
      }

      return {
        id,
        selectedKeys,
        menuData,
        SysMessageStatus,
        SysMessageDetailsStatus,
        editMessage,
        handleMenuClick,
      };
    },
  });
</script>

<style lang="less" scoped>
  .sys-message-wrapper {
    padding-left: 1rem;
  }
</style>
