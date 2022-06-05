<template>
  <Authority :value="auth">
    <a-button v-if="id.length" type="danger" :loading="loading" @click="handleRemove">
      <template #icon>
        <Icon icon="ant-design:delete-outlined" />
      </template>
      {{ text }}
    </a-button>
  </Authority>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { createVNode, defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Modal } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    name: 'AButtonRemoveBatch',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      id: propTypes.arrayOf(propTypes.string).def([]),
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
      const handleRemove = () => {
        Modal.confirm({
          title: `确定要删除选中 ${props.id.length} 条数据吗?`,
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode('div', { class: 'danger-tip' }, '删除后无法恢复，请谨慎操作'),
          onOk: async () => {
            const { api } = props;
            if (!api || !isFunction(api)) return;

            loading.value = true;
            let result;
            try {
              result = await api(props.id.join(','));
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
          },
        });
      };

      return {
        loading,
        handleRemove,
      };
    },
  });
</script>
