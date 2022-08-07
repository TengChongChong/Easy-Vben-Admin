<template>
  <PageWrapper>
    <a-card title="头像裁剪" :bordered="false" class="!mb-4">
      <CropperAvatar :value="avatar" />
    </a-card>

    <a-card title="矩形裁剪" :bordered="false" class="!mb-4">
      <div class="container p-4">
        <div class="cropper-container mr-10">
          <CropperImage ref="refCropper" :src="img" @cropend="handleCropend" style="width: 40vw" />
        </div>
        <img :src="cropperImg" class="croppered" v-if="cropperImg" alt="" />
      </div>
      <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
    </a-card>

    <a-card title="圆形裁剪" :bordered="false">
      <div class="container p-4">
        <div class="cropper-container mr-10">
          <CropperImage
            ref="refCropper"
            :src="img"
            @cropend="handleCircleCropend"
            style="width: 40vw"
            circled
          />
        </div>
        <img :src="circleImg" class="croppered" v-if="circleImg" />
      </div>
      <p v-if="circleImg">裁剪后图片信息：{{ circleInfo }}</p>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { CropperImage, CropperAvatar } from '/@/components/Cropper';
  import img from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    components: {
      PageWrapper,
      CropperImage,
      CropperAvatar,
    },
    setup() {
      const info = ref('');
      const cropperImg = ref('');
      const circleInfo = ref('');
      const circleImg = ref('');
      const userStore = useUserStore();
      const avatar = ref(userStore.getCurrentUser?.avatar || '');
      function handleCropend({ imgBase64, imgInfo }) {
        info.value = imgInfo;
        cropperImg.value = imgBase64;
      }

      function handleCircleCropend({ imgBase64, imgInfo }) {
        circleInfo.value = imgInfo;
        circleImg.value = imgBase64;
      }

      return {
        img,
        info,
        circleInfo,
        cropperImg,
        circleImg,
        handleCropend,
        handleCircleCropend,
        avatar,
      };
    },
  });
</script>

<style scoped>
  .container {
    display: flex;
    width: 100vw;
    align-items: center;
  }

  .cropper-container {
    width: 40vw;
  }

  .croppered {
    height: 360px;
  }

  p {
    margin: 10px;
  }
</style>
