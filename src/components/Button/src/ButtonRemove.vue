<template>
  <a-tooltip>
    <template #title>{{ text }}</template>
    <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handleRemove">
      <a-button type="link" danger size="small" :loading="loading">
        <template #icon>
          <Icon icon="ant-design:delete-outlined" />
        </template>
      </a-button>
    </a-popconfirm>
  </a-tooltip>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'AButtonRemove',
    components: { Icon },
    props: {
      id: propTypes.string,
      text: propTypes.string.def(t('common.delText')),
    },
    emits: ['click'],
    setup(props, { emit }) {
      const loading = ref(false);

      const handleRemove = () => {
        loading.value = true;
        emit('click', props.id);
      };

      return {
        loading,
        handleRemove,
      };
    },
  });
</script>
