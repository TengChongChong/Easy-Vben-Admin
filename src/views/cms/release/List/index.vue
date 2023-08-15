<template>
  <PageWrapper>
    <a-card
      style="width: 100%"
      :tab-list="[
        {
          key: 'release',
          tab: '网站发布',
        },
        {
          key: 'release-history',
          tab: '发布历史',
        },
      ]"
      :active-tab-key="activeTabKey"
      @tab-change="handleTabChange"
    >
      <Release v-if="activeTabKey === 'release'" />
      <List v-if="activeTabKey === 'release-history'" />
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import List from './components/List.vue';
  import Release from './components/Release/index.vue';

  export default defineComponent({
    name: 'CmsReleaseListIndex',
    components: {
      PageWrapper,
      Release,
      List,
    },
    setup() {
      const activeTabKey = ref('release');
      function handleTabChange(key) {
        activeTabKey.value = key;
      }
      return { activeTabKey, handleTabChange };
    },
  });
</script>
