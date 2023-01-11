<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="t('component.cropper.modalTitle')"
    width="800px"
    :canFullscreen="false"
    @ok="handleOk"
    :okText="t('component.cropper.okText')"
  >
    <div :class="prefixCls">
      <div :class="`${prefixCls}-left`">
        <div :class="`${prefixCls}-cropper`">
          <CropperImage
            v-if="src"
            :src="src"
            height="300px"
            :options="{ aspectRatio: aspectRatio }"
            :circled="circled"
            @cropend="handleCropend"
            @ready="handleReady"
          />
        </div>

        <div :class="`${prefixCls}-toolbar`">
          <Upload :fileList="[]" accept="image/*" :beforeUpload="handleBeforeUpload">
            <a-tooltip :title="t('component.cropper.selectImage')" placement="bottom">
              <a-button size="small" type="primary">
                <template #icon>
                  <Icon icon="ant-design:upload-outlined" />
                </template>
              </a-button>
            </a-tooltip>
          </Upload>
          <Space>
            <a-tooltip :title="t('component.cropper.btn_reset')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('reset')"
              >
                <template #icon>
                  <Icon icon="ant-design:reload-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="t('component.cropper.btn_rotate_left')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('rotate', -45)"
              >
                <template #icon>
                  <Icon icon="ant-design:rotate-left-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="t('component.cropper.btn_rotate_right')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('rotate', 45)"
              >
                <template #icon>
                  <Icon icon="ant-design:rotate-right-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="t('component.cropper.btn_scale_x')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('scaleX')"
              >
                <template #icon>
                  <Icon icon="vaadin:arrows-long-h" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="t('component.cropper.btn_scale_y')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('scaleY')"
              >
                <template #icon>
                  <Icon icon="vaadin:arrows-long-v" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="t('component.cropper.btn_zoom_in')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('zoom', 0.1)"
              >
                <template #icon>
                  <Icon icon="ant-design:zoom-in-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="t('component.cropper.btn_zoom_out')" placement="bottom">
              <a-button
                type="primary"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('zoom', -0.1)"
              >
                <template #icon>
                  <Icon icon="ant-design:zoom-out-outlined" />
                </template>
              </a-button>
            </a-tooltip>
          </Space>
        </div>
      </div>
      <div :class="`${prefixCls}-right`">
        <div
          :class="`${prefixCls}-preview ${prefixCls}-preview--${circled ? 'circled' : 'square'} `"
        >
          <img :src="previewSource" v-if="previewSource" :alt="t('component.cropper.preview')" />
        </div>
        <template v-if="previewSource">
          <div :class="`${prefixCls}-group`">
            <a-avatar
              :shape="circled ? 'circle' : 'square'"
              :src="previewSource"
              :style="{ width: '48px', height: `${48 / aspectRatio}px` }"
            />
            <a-avatar
              :shape="circled ? 'circle' : 'square'"
              :src="previewSource"
              :style="{ width: '64px', height: `${64 / aspectRatio}px` }"
            />
            <a-avatar
              :shape="circled ? 'circle' : 'square'"
              :src="previewSource"
              :style="{ width: '80px', height: `${80 / aspectRatio}px` }"
            />
          </div>
        </template>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import type { CropendResult, Cropper } from './typing';

  import { defineComponent, ref } from 'vue';
  import CropperImage from './Cropper.vue';
  import { Space, Upload } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { dataURLtoBlob } from '/@/utils/file/base64Conver';
  import { isFunction } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { upload } from '/@/api/file/upload';
  import { Icon } from '/@/components/Icon';

  type apiFunParams = { file: Blob; name: string; filename: string };

  const props = {
    circled: { type: Boolean, default: false },
    aspectRatio: { type: Number, default: 1 },
    uploadApi: {
      type: Function as PropType<(params: apiFunParams) => Promise<any>>,
    },
  };

  export default defineComponent({
    name: 'CropperModal',
    components: { BasicModal, Space, CropperImage, Upload, Icon },
    props,
    emits: ['uploadSuccess', 'register'],
    setup(props, { emit }) {
      let filename = '';
      const src = ref('');
      const previewSource = ref('');
      const cropper = ref<Cropper>();
      let scaleX = 1;
      let scaleY = 1;

      const { prefixCls } = useDesign('cropper-am');
      const [register, { closeModal, setModalProps }] = useModalInner();
      const { t } = useI18n();

      // Block upload
      function handleBeforeUpload(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        src.value = '';
        previewSource.value = '';
        reader.onload = function (e) {
          src.value = (e.target?.result as string) ?? '';
          filename = file.name;
        };
        return false;
      }

      function handleCropend({ imgBase64 }: CropendResult) {
        previewSource.value = imgBase64;
      }

      function handleReady(cropperInstance: Cropper) {
        cropper.value = cropperInstance;
      }

      function handlerToolbar(event: string, arg?: number) {
        if (event === 'scaleX') {
          scaleX = arg = scaleX === -1 ? 1 : -1;
        }
        if (event === 'scaleY') {
          scaleY = arg = scaleY === -1 ? 1 : -1;
        }
        cropper?.value?.[event]?.(arg);
      }

      async function handleOk() {
        const blob = dataURLtoBlob(previewSource.value);
        try {
          setModalProps({ confirmLoading: true });
          const uploadApi = props.uploadApi;
          let result;
          if (uploadApi && isFunction(uploadApi)) {
            result = await uploadApi({ name: 'file', file: blob, filename });
            emit('uploadSuccess', { source: previewSource.value, data: result });
          } else {
            // @ts-ignore
            result = await upload({ name: 'file', file: blob, filename });
            emit('uploadSuccess', { source: previewSource.value, data: result.data });
          }
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        t,
        prefixCls,
        src,
        register,
        previewSource,
        handleBeforeUpload,
        handleCropend,
        handleReady,
        handlerToolbar,
        handleOk,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-cropper-am';

  .@{prefix-cls} {
    display: flex;

    &-left,
    &-right {
      height: 340px;
    }

    &-left {
      width: 55%;
    }

    &-right {
      width: 45%;
    }

    &-cropper {
      height: 300px;
      background: #eee;
      background-image: linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        ),
        linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        );
      background-position: 0 0, 12px 12px;
      background-size: 24px 24px;
    }

    &-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    &-preview {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 220px;
      margin: 0 auto;
      padding: 10px;
      overflow: hidden;

      &--circled {
        img {
          border-radius: 50%;
        }
      }

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    &-group {
      display: flex;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid @border-color-base;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>
