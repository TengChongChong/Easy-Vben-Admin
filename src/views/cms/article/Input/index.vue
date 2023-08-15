<template>
  <PageWrapper>
    <Loading :loading="loading || saveBtnLoading" tip="加载中..." />
    <a-row :gutter="16">
      <a-col :xl="18" :lg="24">
        <Content
          ref="content"
          :cms-article="cmsArticle"
          :save-btn-loading="saveBtnLoading"
          :is-change-site="isChangeSite"
          @save="handleSave"
          @save-and-add="handleSaveAndAdd"
        />
      </a-col>
      <a-col :xl="6" :lg="24">
        <a-card :tab-list="tabList" :active-tab-key="tabActiveKey" @tab-change="handleTabChange">
          <BasicInfo ref="basicInfo" :cms-article="cmsArticle" v-show="tabActiveKey === 'basic'" />
          <SEO ref="seo" :cms-article="cmsArticle" v-show="tabActiveKey === 'seo'" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, unref, ref, nextTick, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { CmsArticle } from '/@/api/cms/model/cmsArticleModel';
  import { get, add, save } from '/@/api/cms/cmsArticle';
  import Content from './components/Content.vue';
  import SEO from './components/SEO.vue';
  import BasicInfo from './components/BasicInfo.vue';
  import { message } from 'ant-design-vue';
  import { useCmsStore } from '/@/store/modules/cms';
  import { Loading } from '/@/components/Loading';
  import { isArray } from '/@/utils/is';
  export default defineComponent({
    name: 'CmsArticleInputIndex',
    components: { Loading, BasicInfo, SEO, Content, PageWrapper },
    setup() {
      const { setTitle } = useTabs();
      const { currentRoute } = useRouter();
      const { id, siteId, columnId } = unref(currentRoute).query;
      const content = ref();
      const basicInfo = ref();
      const seo = ref();

      const cmsArticle = ref<CmsArticle>({});
      const loading = ref(false);
      const saveBtnLoading = ref(false);

      const isChangeSite = ref(false);

      // 监听切换站点
      const cmsStore = useCmsStore();

      watch(
        () => cmsStore.getCurrentSite,
        () => {
          isChangeSite.value = true;
        },
      );

      onMounted(async () => {
        loading.value = true;
        try {
          if (id) {
            cmsArticle.value = await get(id as string);
            await setTitle((cmsArticle.value.title as string) || '编辑文章');
          } else {
            await setAddInfo();
          }
        } catch (e) {
          console.error(e);
        } finally {
          loading.value = false;
        }
      });

      const tabList = [
        {
          key: 'basic',
          tab: '基本信息',
        },
        {
          key: 'seo',
          tab: 'SEO',
        },
      ];
      const tabActiveKey = ref('basic');

      async function setAddInfo() {
        await setTitle('新增文章');
        cmsArticle.value = await add();
        cmsArticle.value = {
          ...cmsArticle.value,
          siteId: siteId as string,
          columnId: columnId ? (columnId as string) : undefined,
        };
      }

      async function handleSubmit(callback: (_: CmsArticle) => any) {
        try {
          saveBtnLoading.value = true;
          await unref(content).validate();
          await unref(basicInfo).validate();
          const data = {
            ...unref(content).getFieldsValue(),
            ...unref(basicInfo).getFieldsValue(),
            ...unref(seo).getFieldsValue(),
          };
          if (data.tags && isArray(data.tags)) {
            data.tags = data.tags.join(',');
          }
          await save(data).then((res) => {
            message.success('保存成功');
            cmsArticle.value = res;
            callback(res);
          });
        } catch (e) {
          console.error(e);
        } finally {
          saveBtnLoading.value = false;
        }
      }

      async function handleSave() {
        await handleSubmit(() => {});
      }

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
          nextTick(async () => {
            loading.value = true;
            await setAddInfo();
            loading.value = false;
          });
        });
      }

      function handleTabChange(key) {
        tabActiveKey.value = key;
      }

      return {
        content,
        basicInfo,
        seo,
        loading,
        saveBtnLoading,
        cmsArticle,
        tabList,
        tabActiveKey,
        isChangeSite,
        handleTabChange,
        handleSave,
        handleSaveAndAdd,
      };
    },
  });
</script>
