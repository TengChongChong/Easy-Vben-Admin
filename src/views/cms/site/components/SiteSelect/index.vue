<template>
  <div class="site-tools">
    <a-tooltip>
      <template #title>点击切换站点</template>
      <button
        class="ant-btn ant-btn-primary"
        type="button"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        @click="openSiteModal"
      >
        <span class="app-iconify anticon" style="display: inline-flex">
          <Icon icon="humbleicons:exchange-horizontal" />
        </span>
        {{ showText ? getCurrentSite?.name || '未选择站点' : ' ' }}
      </button>
    </a-tooltip>

    <SiteModal @register="register" @change="handleChange" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import SiteModal from './components/SiteModal.vue';
  import { useCmsStore } from '/@/store/modules/cms';
  import { CmsSite } from '/@/api/cms/model/cmsSiteModel';
  import { getUserActiveSite } from '/@/api/cms/cmsSite';
  export default defineComponent({
    name: 'SiteSelect',
    components: { Icon, SiteModal },
    emits: ['change'],
    setup(_, { emit }) {
      const [register, { openModal }] = useModal();
      const cmsStore = useCmsStore();

      const getCurrentSite = computed(() => {
        return cmsStore.getCurrentSite;
      });

      onMounted(() => {
        if (getCurrentSite.value == null) {
        }
        if (getCurrentSite.value == null) {
          // 如果本地没有设置过当前编辑站点，尝试到服务端获取
          getUserActiveSite().then((site) => {
            if (site) {
              cmsStore.setCurrentSite(site);
            } else {
              openSiteModal();
            }
          });
        }
      });

      const showText = ref(false);

      function handleChange(site: CmsSite) {
        emit('change', site);
      }

      function openSiteModal() {
        openModal(true, {});
      }

      function handleMouseenter() {
        showText.value = true;
      }
      function handleMouseleave() {
        showText.value = false;
      }

      return {
        getCurrentSite,
        showText,
        register,
        handleChange,
        handleMouseenter,
        handleMouseleave,
        openSiteModal,
      };
    },
  });
</script>
<style lang="less" scoped>
  .site-tools {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    z-index: 10;

    .ant-btn {
      width: 48px;
      height: auto;
      padding: 12px;
      overflow: hidden;
      border-radius: 30px;

      &:hover {
        width: 160px;
      }
    }
  }
</style>
