<template>
  <Authority :value="auth">
    <a-button v-if="!small" :loading="loading" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:search-outlined" />
      </template>
      {{ text }}
    </a-button>
    <a-tooltip v-else>
      <template #title>{{ text }}</template>
      <a-button type="link" :loading="loading" size="small" @click="handleClick">
        <template #icon>
          <Icon icon="ant-design:search-outlined" />
        </template>
      </a-button>
    </a-tooltip>
  </Authority>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { useGo } from '/@/hooks/web/usePage';
  import { Authority } from '/@/components/Authority';
  export default defineComponent({
    name: 'AButtonInfo',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      small: propTypes.bool,
      id: propTypes.string,
      path: propTypes.string,
      loading: propTypes.bool.def(false),
      text: propTypes.string.def('详情'),
    },
    emits: ['click'],
    setup(props, { emit }) {
      const go = useGo();

      const handleClick = () => {
        emit('click', props.id);
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
