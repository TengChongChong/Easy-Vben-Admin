<template>
  <PageWrapper title="滚动组件示例" content="基于el-scrollbar">
    <a-row :gutter="[16, 16]">
      <a-col :xl="12" :lg="24">
        <a-card title="基础示例" :bordered="false">
          <div class="scroll-wrap">
            <ScrollContainer>
              <ul>
                <template v-for="index in 100" :key="index">
                  <li class="p-2"> 列表项 {{ index }} </li>
                </template>
              </ul>
            </ScrollContainer>
          </div>
        </a-card>
      </a-col>

      <a-col :xl="12" :lg="24">
        <a-card title="滚动函数" :bordered="false">
          <a-space>
            <a-button @click="scrollTo(100)"> 滚动到100px位置 </a-button>
            <a-button @click="scrollTo(800)"> 滚动到800px位置 </a-button>
            <a-button @click="scrollTo(0)"> 滚动到顶部 </a-button>
            <a-button @click="scrollBottom()"> 滚动到底部 </a-button>
          </a-space>
          <div class="scroll-wrap mt-4" style="height: 250px">
            <ScrollContainer ref="scrollRef">
              <ul>
                <template v-for="index in 100" :key="index">
                  <li class="p-2"> 列表项 {{ index }} </li>
                </template>
              </ul>
            </ScrollContainer>
          </div>
        </a-card>
      </a-col>
      <a-col :xl="12" :lg="24">
        <a-card title="即使不可见，也预先加载50条数据，防止空白" :bordered="false">
          <div class="scroll-wrap p-4">
            <VScroll :itemHeight="41" :items="data" :height="300" :bench="50">
              <template #default="{ item }">
                <div class="virtual-scroll-demo__item">
                  {{ item.title }}
                </div>
              </template>
            </VScroll>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { ScrollActionType, ScrollContainer } from '/@/components/Container';
  import { VScroll } from '/@/components/VirtualScroll';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { ScrollContainer, VScroll, PageWrapper },
    setup() {
      const data: Recordable[] = (() => {
        const arr: Recordable[] = [];
        for (let index = 1; index < 20000; index++) {
          arr.push({
            title: '列表项' + index,
          });
        }
        return arr;
      })();

      const scrollRef = ref<Nullable<ScrollActionType>>(null);
      const getScroll = () => {
        const scroll = unref(scrollRef);
        if (!scroll) {
          throw new Error('scroll is Null');
        }
        return scroll;
      };

      function scrollTo(top: number) {
        getScroll().scrollTo(top);
      }
      function scrollBottom() {
        getScroll().scrollBottom();
      }
      return {
        data,
        scrollTo,
        scrollRef,
        scrollBottom,
      };
    },
  });
</script>
<style lang="less" scoped>
  .scroll-wrap {
    height: 300px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
  }
</style>
