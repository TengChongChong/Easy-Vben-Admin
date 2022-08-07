<template>
  <Authority :value="auth">
    <a-button v-if="!small" :loading="loading" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:download-outlined" />
      </template>
      {{ text }}
    </a-button>
    <a-tooltip v-else>
      <template #title>{{ text }}</template>
      <a-button type="link" :loading="loading" size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:download-outlined" />
        </template>
      </a-button>
    </a-tooltip>
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
      small: propTypes.bool,
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
