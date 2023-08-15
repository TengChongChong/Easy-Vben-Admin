<template>
  <Authority value="cms:article:status">
    <a-divider type="vertical" />
    <a-popconfirm title="确定要撤销吗？" ok-text="是" cancel-text="否" @confirm="handleRevoke">
      <a-tooltip>
        <template #title>撤销</template>
        <a-button type="link" size="small" danger :loading="loading">
          <template #icon>
            <Icon icon="ant-design:rollback-outlined" />
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
  import { revoke } from '/@/api/cms/cmsArticle';

  export default defineComponent({
    name: 'AButtonRemove',
    components: { Authority, Icon },
    props: {
      id: propTypes.string,
    },
    emits: ['success', 'fail'],
    setup(props, { emit }) {
      const loading = ref(false);

      const handleRevoke = async () => {
        loading.value = true;
        let result;
        try {
          result = await revoke([props.id]);
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
        handleRevoke,
      };
    },
  });
</script>
