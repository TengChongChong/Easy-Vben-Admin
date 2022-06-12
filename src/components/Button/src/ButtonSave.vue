<template>
  <Authority :value="auth">
    <a-button type="primary" :loading="loading" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:save-outlined" />
      </template>
      {{ text }}
    </a-button>
  </Authority>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';
  export default defineComponent({
    name: 'AButtonSave',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      loading: propTypes.bool.def(false),
      text: propTypes.string.def(t('common.saveText')),
    },
    emits: ['click'],
    setup(_, { emit }) {
      const handleClick = () => {
        emit('click');
      };

      return {
        handleClick,
      };
    },
  });
</script>
