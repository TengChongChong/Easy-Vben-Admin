<template>
  <Authority :value="auth">
    <a-button :type="type" :size="size" @click="handleClick">
      <template v-if="icon" #icon>
        <Icon :icon="icon" />
      </template>
      {{ text }}
    </a-button>
  </Authority>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  import { Authority } from '/@/components/Authority';

  export default defineComponent({
    name: 'AButtonLink',
    components: { Authority, Icon },
    props: {
      type: propTypes.string,
      size: propTypes.string,
      auth: propTypes.string,
      icon: propTypes.string,
      path: propTypes.string.isRequired,
      text: propTypes.string,
    },
    setup(props) {
      const go = useGo();

      return {
        handleClick: () => {
          go(props.path);
        },
      };
    },
  });
</script>
