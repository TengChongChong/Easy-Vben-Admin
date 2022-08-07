<template>
  <PageWrapper>
    <a-card title="Global WaterMark" :bordered="false">
      <a-button type="primary" class="mr-2" @click="setWatermark('WaterMark Info')">
        Create
      </a-button>
      <a-button color="error" class="mr-2" @click="clear"> Clear </a-button>
      <a-button color="warning" class="mr-2" @click="setWatermark('WaterMark Info New')">
        Reset
      </a-button>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useWatermark } from '/@/hooks/web/useWatermark';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SampleFeatWatermarkIndex',
    components: { PageWrapper },
    setup() {
      const areaRef = ref<Nullable<HTMLElement>>(null);
      const { setWatermark, clear } = useWatermark();
      return {
        setWatermark,
        clear,
        areaRef,
      };
    },
  });
</script>
