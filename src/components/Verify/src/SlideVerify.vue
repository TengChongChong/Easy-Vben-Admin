<template>
  <div class="verify-slide">
    <div class="verify-slide-originals">
      <a-button class="btn-refresh" type="link" @click="handleRefresh">
        <template #icon>
          <Icon icon="ant-design:reload-outlined" :size="20" />
        </template>
      </a-button>

      <a-spin :spinning="state.loading">
        <!-- 占位 -->
        <div
          v-if="state.loading"
          :style="{ width: `${captchaSize.width}px`, height: `${captchaSize.height}px` }"
        ></div>
      </a-spin>

      <img
        v-if="!state.loading"
        :src="'data:image/png;base64,' + captchaVO.originalImageBase64"
        alt="背景"
      />

      <div v-if="!state.loading" class="verify-slide-originals-slider" :style="state.imgStyle">
        <img :src="'data:image/png;base64,' + captchaVO.jigsawImageBase64" alt="滑块" />
      </div>

      <span
        v-if="state.showTip"
        :class="['verify-slide-originals-img__tip', state.isPassing ? 'success' : 'error']"
      >
        {{ state.isPassing ? `验证成功，耗时${state.time.toFixed(1)}秒！` : '验证失败！' }}
      </span>
    </div>
    <BaseDragVerify
      ref="basicRef"
      v-model:value="state.isPassing"
      :width="310"
      success-text=""
      :text="state.text"
      :is-slot="true"
      @start="handleStart"
      @move="handleDragBarMove"
      @end="handleDragEnd"
    />
  </div>
</template>
<script lang="ts">
  import type { MoveData } from './typing';
  import { defineComponent, reactive, watch, ref, unref } from 'vue';
  import BaseDragVerify from '/@/components/Verify/src/DragVerify.vue';
  import { checkCaptcha, getCaptcha } from '/@/api/sys/sysCaptcha';
  import { Icon } from '/@/components/Icon';
  import { CaptchaVO } from '/@/api/sys/model/sysCaptchaModel';
  import { DragVerifyActionType } from './typing';
  import { AesEncryption } from '/@/utils/cipher';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'SlideVerify',
    components: { BaseDragVerify, Icon },
    inheritAttrs: false,
    props: {
      // 服务端二次验证所属参数
      value: propTypes.string,
    },
    emits: ['success', 'change', 'update:value'],
    setup(_, { emit }) {
      // 拖动条
      const basicRef = ref<Nullable<DragVerifyActionType>>(null);
      // 验证码数据
      const captchaVO = ref<Nullable<CaptchaVO>>();

      // 验证码尺寸
      const captchaSize = {
        width: 310,
        height: 155,
      };

      const state = reactive({
        loading: true,
        showTip: false,
        captcha: {},
        isPassing: false,
        text: '加载中...',
        left: 0,
        imgStyle: {},
        startTime: 0,
        endTime: 0,
        time: 0,
      });

      watch(
        () => state.isPassing,
        (isPassing) => {
          emit('change', isPassing);
          emit('update:value', captchaVO.value?.captchaVerification);
          if (isPassing) {
            const { startTime, endTime } = state;
            state.time = (endTime - startTime) / 1000;
            emit('success', { isPassing, time: state.time });
          }
        },
      );

      /**
       * 请求背景图片和验证图片
       */
      async function initCaptcha() {
        state.loading = true;
        state.text = '加载中...';
        try {
          captchaVO.value = await getCaptcha();
        } catch (e) {
        } finally {
          state.loading = false;
          state.text = '向右拖动滑块填充拼图';
        }
      }

      initCaptcha();

      /**
       * 刷新
       */
      function handleRefresh() {
        state.showTip = false;
        const basicEl = unref(basicRef);
        if (!basicEl) {
          return;
        }
        state.imgStyle = {};
        state.left = 0;
        state.isPassing = false;
        initCaptcha();
        basicEl.resume();
      }

      function handleStart() {
        state.startTime = new Date().getTime();
      }

      /**
       * 拖动
       *
       * @param data
       */
      function handleDragBarMove(data: MoveData) {
        const moveX = Math.min(Math.max(data.moveX, 0), captchaSize.width - 40);
        state.imgStyle = {
          left: `${moveX}px`,
        };
        state.left = moveX;
      }

      /**
       * 拖动结束
       */
      async function handleDragEnd() {
        let pointJson = JSON.stringify({ x: state.left, y: 5 });
        if (captchaVO.value?.secretKey) {
          // 坐标加密
          const encryption = new AesEncryption({ key: captchaVO.value?.secretKey });
          pointJson = encryption.encryptByAES(pointJson);
        }

        try {
          await checkCaptcha(
            {
              token: captchaVO.value?.token,
              pointJson,
            },
            'none',
          ).then((res) => {
            if (captchaVO.value) {
              captchaVO.value.captchaVerification = res.captchaVerification;
            }
          });

          state.endTime = new Date().getTime();
          state.isPassing = true;
        } catch (e) {
          state.isPassing = false;
          setTimeout(() => {
            handleRefresh();
          }, 1000);
        } finally {
          state.showTip = true;
        }
      }

      return {
        captchaSize,
        basicRef,
        captchaVO,
        state,
        handleStart,
        handleDragBarMove,
        handleDragEnd,
        handleRefresh,
      };
    },
  });
</script>
<style lang="less">
  .verify-slide {
    width: 310px;

    &-originals {
      position: relative;
      margin-bottom: 10px;

      .btn-refresh {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #fff;
      }

      img {
        width: 100%;
        height: 155px;
        display: block;
      }

      > img {
        width: 310px;
      }

      &-slider {
        position: absolute;
        top: 0;
        left: 0;
      }

      &-img__tip {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: block;
        width: 100%;
        height: 30px;
        font-size: 12px;
        line-height: 30px;
        color: @white;
        text-align: center;

        &.success {
          background-color: fade(@success-color, 60%);
        }

        &.error {
          background-color: fade(@error-color, 60%);
        }

        &.normal {
          background-color: rgb(0 0 0 / 30%);
        }
      }
    }
  }
</style>
