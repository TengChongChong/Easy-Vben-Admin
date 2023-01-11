<template>
  <div :class="getClass" :style="getWrapperStyle">
    <img
      v-show="isReady"
      ref="imgElRef"
      :src="src"
      :alt="alt"
      :crossorigin="crossorigin"
      :style="getImageStyle"
    />
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, onMounted, ref, unref, computed, onUnmounted } from 'vue';
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useDebounceFn } from '@vueuse/shared';

  type Options = Cropper.Options;

  const defaultOptions: Options = {
    aspectRatio: 1,
    viewMode: 1,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    autoCrop: true,
    background: true,
    highlight: true,
    center: true,
    responsive: true,
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    scalable: true,
    modal: true,
    guides: true,
    movable: true,
    rotatable: true,
  };

  const props = {
    src: { type: String, required: true },
    alt: { type: String },
    circled: { type: Boolean, default: false },
    realTimePreview: { type: Boolean, default: true },
    height: { type: [String, Number], default: '360px' },
    crossorigin: {
      type: String as PropType<'' | 'anonymous' | 'use-credentials' | undefined>,
      default: undefined,
    },
    imageStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    options: { type: Object as PropType<Options>, default: () => ({}) },
  };

  export default defineComponent({
    name: 'CropperImage',
    props,
    emits: ['cropend', 'ready', 'cropendError'],
    setup(props, { attrs, emit }) {
      const imgElRef = ref<ElRef<HTMLImageElement>>();
      const cropper = ref<Nullable<Cropper>>();
      const isReady = ref(false);

      const { prefixCls } = useDesign('cropper-image');
      const debounceRealTimeCroppered = useDebounceFn(realTimeCroppered, 80);

      const getImageStyle = computed((): CSSProperties => {
        return {
          height: props.height,
          maxWidth: '100%',
          ...props.imageStyle,
        };
      });

      const getClass = computed(() => {
        return [
          prefixCls,
          attrs.class,
          {
            [`${prefixCls}--circled`]: props.circled,
          },
        ];
      });

      const getWrapperStyle = computed((): CSSProperties => {
        return { height: `${props.height}`.replace(/px/, '') + 'px' };
      });

      onMounted(init);

      onUnmounted(() => {
        cropper.value?.destroy();
      });

      async function init() {
        const imgEl = unref(imgElRef);
        if (!imgEl) {
          return;
        }
        cropper.value = new Cropper(imgEl, {
          ...defaultOptions,
          ready: () => {
            isReady.value = true;
            realTimeCroppered();
            emit('ready', cropper.value);
          },
          crop() {
            debounceRealTimeCroppered();
          },
          zoom() {
            debounceRealTimeCroppered();
          },
          cropmove() {
            debounceRealTimeCroppered();
          },
          ...props.options,
        });
      }

      // Real-time display preview
      function realTimeCroppered() {
        props.realTimePreview && croppered();
      }

      // event: return base64 and width and height information after cropping
      function croppered() {
        if (!cropper.value) {
          return;
        }
        let imgInfo = cropper.value.getData();
        const canvas = cropper.value.getCroppedCanvas();
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }
          let fileReader: FileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onloadend = (e) => {
            emit('cropend', {
              imgBase64: e.target?.result ?? '',
              imgInfo,
            });
          };
          fileReader.onerror = () => {
            emit('cropendError');
          };
        }, 'image/png');
      }

      return { getClass, imgElRef, getWrapperStyle, getImageStyle, isReady, croppered };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-cropper-image';

  .@{prefix-cls} {
    &--circled {
      .cropper-view-box,
      .cropper-face {
        border-radius: 50%;
      }
    }
  }
</style>
