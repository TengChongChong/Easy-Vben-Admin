<template>
  <PageWrapper>
    <a-card title="文件下载" :bordered="false">
      <ImagePreview :imageList="imgList" />
      <a-button @click="openImg" type="primary">无预览图</a-button>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { createImgPreview, ImagePreview } from '/@/components/Preview';
  import { PageWrapper } from '/@/components/Page';

  const imgList: string[] = [
    'https://picsum.photos/id/66/346/216',
    'https://picsum.photos/id/67/346/216',
    'https://picsum.photos/id/68/346/216',
  ];
  export default defineComponent({
    name: 'SampleFeatImgPreviewIndex',
    components: { PageWrapper, ImagePreview },
    setup() {
      function openImg() {
        const onImgLoad = ({ index, url, dom }) => {
          console.log(`第${index + 1}张图片已加载，URL为：${url}`, dom);
        };
        // 可以使用createImgPreview返回的 PreviewActions 来控制预览逻辑，实现类似幻灯片、自动旋转之类的骚操作
        createImgPreview({ imageList: imgList, defaultWidth: 700, rememberState: true, onImgLoad });
      }
      return { imgList, openImg };
    },
  });
</script>
