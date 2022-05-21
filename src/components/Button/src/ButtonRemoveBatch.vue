<template>
  <a-button v-if="id.length" type="danger" :loading="loading" @click="handleRemove">
    <template #icon>
      <Icon icon="ant-design:delete-outlined" />
    </template>
    {{ text }}
  </a-button>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { createVNode, defineComponent } from 'vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Modal } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'AButtonRemoveBatch',
    components: { Icon },
    props: {
      id: propTypes.arrayOf(propTypes.string).def([]),
      text: propTypes.string.def(t('common.delText')),
      loading: propTypes.bool,
    },
    emits: ['click', 'update:loading'],
    setup(props, { emit }) {
      const handleRemove = () => {
        Modal.confirm({
          title: `确定要删除选中 ${props.id.length} 条数据吗?`,
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode('div', { class: 'danger-tip' }, '删除后无法恢复，请谨慎操作'),
          onOk() {
            emit('update:loading', true);
            // 把数组转成String，如有多项使用 , 拼接
            emit('click', props.id.join(','));
          },
        });
      };

      return {
        handleRemove,
      };
    },
  });
</script>
