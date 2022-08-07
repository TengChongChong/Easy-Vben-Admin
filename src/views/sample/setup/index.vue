<template>
  <PageWrapper title="引导页" content="用于给用户的指引操作">
    <a-card title="引导页" :bordered="false">
      <a-button type="primary" @click="handleStart">开始</a-button>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import intro from 'intro.js';
  import 'intro.js/minified/introjs.min.css';

  export default defineComponent({
    components: { PageWrapper },
    setup() {
      const { prefixVar } = useDesign('');

      function handleStart() {
        intro()
          .setOptions({
            prevLabel: '上一步',
            nextLabel: '下一步',
            doneLabel: '完成',
            buttonClass: 'ant-btn',
            steps: [
              {
                title: '引导页',
                intro: '欢迎使用欢迎使用引导页! 👋',
              },
              {
                title: '收起/展开菜单',
                element: document.querySelector(`.${prefixVar}-layout-header-trigger`)!,
                intro: '点击此处可以将菜单收起或展开。',
              },
              {
                title: '工具条',
                element: document.querySelector(`.${prefixVar}-layout-header-action`)!,
                intro: '菜单搜索、消息、待办、全屏、个人信息、设置等',
              },
            ],
          })
          .start();
      }
      return { handleStart };
    },
  });
</script>
