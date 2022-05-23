<template>
  <a-tooltip>
    <template #title>{{ text }}</template>
    <a-button type="link" size="small" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:plus-outlined" />
      </template>
    </a-button>
  </a-tooltip>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    name: 'AButtonAddSub',
    components: { Icon },
    props: {
      id: propTypes.string,
      path: propTypes.string,
      text: propTypes.string.def('新增下级'),
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
