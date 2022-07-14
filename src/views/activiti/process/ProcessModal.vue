<template>
  <BasicModal
    v-bind="$attrs"
    :width="960"
    :min-height="260"
    @register="registerModel"
    title="流程图"
  >
    <img class="process-img" alt="" :src="imgSrc" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  export default defineComponent({
    name: 'ActivitiProcessModal',
    components: { BasicModal },
    emits: ['register'],
    setup() {
      const imgSrc = ref<string>();
      const [registerModel] = useModalInner(async (url) => {
        imgSrc.value = url;
      });

      return {
        imgSrc,
        registerModel,
      };
    },
  });
</script>
<style scoped>
  .process-img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
</style>
