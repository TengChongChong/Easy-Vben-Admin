<template>
  <div class="personal-center-binding">
    <a-list class="demo-loadmore-list" item-layout="horizontal">
      <a-list-item>
        <a-list-item-meta description="使用QQ快捷登录">
          <template #title>QQ</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:qq-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="todo">绑定</a-button>
        </template>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta description="使用微信快捷登录">
          <template #title>微信</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:wechat-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="todo">绑定</a-button>
        </template>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta description="使用微博快捷登录">
          <template #title>微博</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:weibo-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="todo">绑定</a-button>
        </template>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta description="使用GitHub快捷登录">
          <template #title>GitHub</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:github-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="todo">绑定</a-button>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { Icon },
    setup() {
      const { createMessage } = useMessage();

      function todo() {
        createMessage.warn('待开发');
      }
      return { todo };
    },
  });
</script>

<style lang="less">
  .personal-center-binding {
    .ant-list-item-meta-avatar {
      margin: 10px 20px;
    }
  }
</style>
