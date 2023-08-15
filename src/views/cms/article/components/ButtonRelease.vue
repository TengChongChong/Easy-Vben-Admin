<template>
  <Authority value="cms:article:status">
    <a-divider type="vertical" />
    <a-popconfirm title="确定要发布吗？" ok-text="是" cancel-text="否" @confirm="handleRelease">
      <a-tooltip>
        <template #title>发布</template>
        <a-button type="link" size="small" :loading="loading">
          <template #icon>
            <Icon icon="ant-design:check-outlined" />
          </template>
        </a-button>
      </a-tooltip>
    </a-popconfirm>
  </Authority>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';
  import { release } from '/@/api/cms/cmsArticle';

  export default defineComponent({
    name: 'AButtonRemove',
    components: { Authority, Icon },
    props: {
      id: propTypes.string,
    },
    emits: ['success', 'fail'],
    setup(props, { emit }) {
      const loading = ref(false);

      const handleRelease = async () => {
        loading.value = true;
        let result;
        try {
          result = await release([props.id]);
        } catch (e) {
          console.error(e);
        } finally {
          loading.value = false;
        }
        if (result) {
          emit('success', props.id);
        } else {
          emit('fail', props.id);
        }
      };

      return {
        loading,
        handleRelease,
      };
    },
  });
</script>
