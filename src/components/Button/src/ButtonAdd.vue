<template>
  <Authority :value="auth">
    <a-button v-if="!small" type="primary" :loading="loading" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:plus-outlined" />
      </template>
      {{ text }}
    </a-button>
    <a-tooltip v-else>
      <template #title>{{ text }}</template>
      <a-button type="link" :loading="loading" size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:plus-outlined" />
        </template>
      </a-button>
    </a-tooltip>
  </Authority>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { defineComponent } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';
  export default defineComponent({
    name: 'AButtonAdd',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      path: propTypes.string,
      small: propTypes.bool,
      loading: propTypes.bool.def(false),
      text: propTypes.string.def(t('common.addText')),
    },
    emits: ['click'],
    setup(props, { emit }) {
      const go = useGo();

      const handleClick = () => {
        emit('click');
        if (props.path) {
          go(props.path);
        }
      };

      return {
        handleClick,
      };
    },
  });
</script>
