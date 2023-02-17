<template>
  <e-iframe :frame-src="`/static/activiti-editor/modeler.html?modelId=${id}&token=${token}`" />
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import EIframe from '/@/views/sys/iframe/index.vue';
  import { useRouter } from 'vue-router';
  import { getToken } from '/@/utils/auth';

  export default defineComponent({
    name: 'ActivitiModelEdit',
    components: { EIframe },
    setup() {
      const { currentRoute } = useRouter();
      const id = ref<string>(unref(currentRoute).params?.id as string);

      const token = getToken();

      return {
        id,
        token,
      };
    },
  });
</script>

<style scoped></style>
