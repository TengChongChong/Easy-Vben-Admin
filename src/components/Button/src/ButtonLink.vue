<template>
  <a-button type="primary" @click="handleClick">
    <template v-if="icon" #icon>
      <Icon :icon="icon" />
    </template>
    {{ text }}
  </a-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'AButtonLink',
    components: { Icon },
    props: {
      icon: propTypes.string,
      path: propTypes.string.isRequired,
      text: propTypes.string,
    },
    emits: ['click'],
    setup(props, { emit }) {
      const go = useGo();

      return {
        handleClick: () => {
          emit('click');
          go(props.path);
        },
      };
    },
  });
</script>
