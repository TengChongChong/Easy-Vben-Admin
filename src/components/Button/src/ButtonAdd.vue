<template>
  <a-button type="primary" @click="handleClick">
    <template #icon>
      <Icon icon="ant-design:plus-outlined" />
    </template>
    {{ text }}
  </a-button>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  import { defineComponent } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'AButtonAdd',
    components: { Icon },
    props: {
      path: propTypes.string,
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
