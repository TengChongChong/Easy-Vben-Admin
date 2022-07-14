<template>
  <Authority :value="auth">
    <a-button type="primary" @click="handleClick">
      <template #icon>
        <Icon icon="ant-design:upload-outlined" />
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
    name: 'AButtonImport',
    components: { Authority, Icon },
    props: {
      auth: propTypes.string,
      text: propTypes.string.def('导入'),
      importCode: propTypes.string,
    },
    emits: ['click'],
    setup(props, { emit }) {
      const go = useGo();

      const handleClick = () => {
        emit('click');
        go(`/sys/import/excel/data/view/${props.importCode}`);
      };

      return {
        handleClick,
      };
    },
  });
</script>
