<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="cms:media:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="cms:media:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'preview'">
          <div class="media-preview">
            <template v-if="record.type === 'image'">
              <ImagePreview :imageList="[apiUrl + record.fileUrl]" />
            </template>
            <template v-if="record.type === 'audio'">
              <Icon icon="ph:file-audio-bold" :size="32" />
            </template>
            <template v-if="record.type === 'video'">
              <Icon icon="ph:file-video-bold" :size="32" />
            </template>
            <template v-if="record.type === 'doc'">
              <Icon icon="ph:file-doc-bold" :size="32" />
            </template>
            <template v-if="record.type === 'other'">
              <Icon icon="ph:file-bold" :size="32" />
            </template>
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="cms:media:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="cms:media:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>下载</template>
              <a-button
                type="link"
                size="small"
                @click="downloadSysFile(record.id, null, record.name)"
              >
                <template #icon>
                  <Icon icon="ant-design:download-outlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip>
              <template #title>预览</template>
              <a-button type="link" size="small" @click="handlePreview(apiUrl + record.fileUrl)">
                <template #icon>
                  <Icon icon="ant-design:eye-outlined" />
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <CmsMediaInput @register="registerModal" @success="reload" />

    <!--  站点切换工具  -->
    <SiteSelect />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, watch, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/cms/media/media.data';
  import { useModal } from '/@/components/Modal';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import { add, remove, select, get } from '/@/api/cms/cmsMedia';
  import CmsMediaInput from '/@/views/cms/media/Input.vue';
  import SiteSelect from '/@/views/cms/site/components/SiteSelect/index.vue';
  import { useCmsStore } from '/@/store/modules/cms';
  import { ImagePreview } from '/@/components/Preview';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { downloadSysFile } from '/@/utils/file/download';

  export default defineComponent({
    name: 'CmsMediaList',
    components: {
      Icon,
      ImagePreview,
      SiteSelect,
      PageWrapper,
      CmsMediaInput,
      AButtonAdd,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      BasicTable,
    },
    setup() {
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      const [registerModal, { openModal }] = useModal();
      const globSetting = useGlobSetting();

      // 监听切换站点
      const cmsStore = useCmsStore();
      const getCurrentSite = computed(() => cmsStore.getCurrentSite);

      watch(
        () => cmsStore.getCurrentSite,
        () => {
          if (getCurrentSite.value) {
            // 刷新表格数据
            reload();
          }
        },
      );

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '资源',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      const handleCreate = () => {
        add().then((data) => {
          openModal(true, { ...data, siteId: getCurrentSite.value?.id });
        });
      };

      const handleEdit = (id: string) => {
        get(id).then((data) => {
          openModal(true, data);
        });
      };

      function handlePreview(url: string) {
        window.open(url);
      }

      return {
        apiUrl: globSetting.apiUrl,
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        searchInfo,
        remove,
        downloadSysFile,
        registerModal,
        registerTable,
        handleCreate,
        handleEdit,
        reload,
        handlePreview,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.media-preview) {
    .ant-image-img {
      max-height: 60px;
      max-width: 120px;
    }
  }
</style>
