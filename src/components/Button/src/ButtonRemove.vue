<template>
  <Authority :value="auth">
    <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handleRemove">
      <a-button v-if="!small" type="danger" :loading="loading">
        <template #icon>
          <Icon icon="ant-design:delete-outlined" />
        </template>
        {{ text }}
      </a-button>
      <a-tooltip v-else>
        <template #title>{{ text }}</template>
        <a-button type="link" danger size="small" :loading="loading">
          <template #icon>
            <Icon icon="ant-design:delete-outlined" />
          </template>
        </a-button>
      </a-tooltip>
    </a-popconfirm>
  </Authority>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    name: 'AButtonRemove',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      small: propTypes.bool,
      id: propTypes.string,
      text: propTypes.string.def(t('common.delText')),
      // 删除api
      api: { type: Function as PropType<(id: string) => Promise<boolean>> },
      // 成功回调
      success: { type: Function as PropType<(id: string) => Promise<boolean>> },
      // 失败回调
      fail: { type: Function as PropType<(id: string) => Promise<boolean>> },
    },
    emits: ['success', 'fail'],
    setup(props, { emit }) {
      const loading = ref(false);

      const handleRemove = async () => {
        const { api } = props;
        if (!api || !isFunction(api)) return;

        loading.value = true;
        let result;
        try {
          result = await api(props.id);
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
        handleRemove,
      };
    },
  });
</script>
