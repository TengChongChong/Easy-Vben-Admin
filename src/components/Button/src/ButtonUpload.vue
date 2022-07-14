<template>
  <a-button type="primary">
    <template #icon>
      <Icon icon="ant-design:upload-outlined" />
    </template>
    {{ text }}
  </a-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'AButtonUpload',
    components: { Icon },
    props: {
      auth: propTypes.string,
      text: propTypes.string.def('上传'),
    },
    setup() {},
  });
</script>
