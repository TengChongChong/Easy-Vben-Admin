<template>
  <a-tooltip>
    <template #title>{{ text }}</template>
    <a-button :loading="loading" type="link" size="small" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:edit-outlined" />
      </template>
    </a-button>
  </a-tooltip>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { defineComponent } from 'vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'AButtonEdit',
    components: { Icon },
    props: {
      id: propTypes.string,
      loading: propTypes.bool.def(false),
      text: propTypes.string.def(t('common.editText')),
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
