<template>
  <Authority :value="auth">
    <a-tooltip>
      <template #title>{{ text }}</template>
      <a-button type="link" :loading="loading" size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:edit-outlined" />
        </template>
      </a-button>
    </a-tooltip>
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
    name: 'AButtonEdit',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      id: propTypes.string,
      text: propTypes.string.def(t('common.editText')),
      loading: propTypes.bool.def(false),
    },
    emits: ['click'],
    setup(props, { emit }) {
      const handleClick = () => {
        emit('click', props.id);
      };

      return {
        handleClick,
      };
    },
  });
</script>
