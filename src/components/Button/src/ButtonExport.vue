<template>
  <Authority :value="auth">
    <a-button :loading="loading" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:cloud-download-outlined" />
      </template>
      {{ text }}
    </a-button>
  </Authority>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';
  export default defineComponent({
    name: 'AButtonExport',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      text: propTypes.string.def('导出'),
      loading: propTypes.bool.def(false),
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
