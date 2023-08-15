<template>
  <Loading :loading="loading" tip="加载中..." />
  <a-row type="flex" justify="center">
    <a-col :lg="18" :md="20">
      <a-steps :current="currentStep">
        <a-step title="选择资源" description="选择需要发布的资源" />
        <a-step title="发布中" description="生成静态资源" />
        <a-step title="完成" description="发布列队统计" />
      </a-steps>

      <ChoseResources
        v-if="currentStep === 0"
        @show-loading="showLoading"
        @close-loading="closeLoading"
        @release="handleRelease"
      />
      <Progress :cms-release="release!" ref="progress" v-else @end="handleEnd" @back="handleBack" />
    </a-col>
  </a-row>
  <!--  站点切换工具  -->
  <SiteSelect />
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref, unref } from 'vue';
  import { Steps } from 'ant-design-vue';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';
  import { Loading } from '/@/components/Loading';
  import ChoseResources from './ChoseResources.vue';
  import Progress from './Progress.vue';
  import { CmsRelease } from '/@/api/cms/model/cmsReleaseModel';

  export default defineComponent({
    components: {
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      ChoseResources,
      Progress,
      Loading,
      SiteSelect,
    },
    setup() {
      const loading = ref(false);
      const currentStep = ref(0);

      const progress = ref();
      const release = ref<Nullable<CmsRelease>>();

      /**
       * 开始发布
       *
       * @param cmsRelease 发布列队
       */
      function handleRelease(cmsRelease: CmsRelease) {
        release.value = cmsRelease;
        setCurrentStep(1);
        nextTick(() => {
          unref(progress).handleStart();
        });
      }

      function handleEnd() {
        setCurrentStep(2);
      }

      function handleBack() {
        setCurrentStep(0);
      }

      function showLoading() {
        loading.value = true;
      }

      function closeLoading() {
        loading.value = false;
      }

      function setCurrentStep(step) {
        currentStep.value = step;
      }

      return {
        loading,
        currentStep,
        progress,
        release,
        showLoading,
        closeLoading,
        handleRelease,
        handleEnd,
        handleBack,
      };
    },
  });
</script>
