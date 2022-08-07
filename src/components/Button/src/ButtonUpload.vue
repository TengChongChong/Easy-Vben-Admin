<template>
  <a-button v-if="!small" type="primary">
    <template #icon>
      <Icon icon="ant-design:upload-outlined" />
    </template>
    {{ text }}
  </a-button>
  <a-tooltip v-else>
    <template #title>{{ text }}</template>
    <a-button type="link" size="small">
      <template #icon>
        <Icon icon="ant-design:upload-outlined" />
      </template>
    </a-button>
  </a-tooltip>
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
      small: propTypes.bool,
      text: propTypes.string.def('上传'),
    },
    setup() {},
  });
</script>
