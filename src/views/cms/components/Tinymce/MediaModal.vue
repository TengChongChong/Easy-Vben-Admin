<template>
  <BasicModal v-bind="$attrs" @register="register" :width="1200" title="资源库">
    <div class="form-query-wrapper mb-4">
      <a-form-item-rest>
        <a-space>
          <a-radio-group v-model:value="type" @change="handleSearch">
            <a-radio-button v-for="item in mediaTypeDictArray" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-radio-button>
          </a-radio-group>

          <a-input-search
            style="width: 260px"
            v-model:value="name"
            placeholder="输入资源名称查询"
            enter-button
            @search="handleSearch"
          />
        </a-space>
      </a-form-item-rest>
    </div>

    <div class="media-items-wrapper">
      <div class="py-8" v-if="!mediaList.length">
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </div>
      <div class="media-items">
        <div
          :class="['media-item', isActive(item) ? 'active' : '']"
          v-for="item in mediaList"
          :key="item.id"
          @click="handleMediaActive(item)"
          @dblclick.stop="handleInsert(item)"
        >
          <a-tooltip>
            <template #title>双击可快速插入</template>
            <div class="media-item-preview">
              <template v-if="item.type === 'image'">
                <img :alt="item.name" :src="apiUrl + item.fileUrl" />
              </template>
              <template v-if="item.type === 'audio'">
                <Icon icon="ph:file-audio-bold" :size="48" />
              </template>
              <template v-if="item.type === 'video'">
                <Icon icon="ph:file-video-bold" :size="48" />
              </template>
              <template v-if="item.type === 'doc'">
                <Icon icon="ph:file-doc-bold" :size="48" />
              </template>
              <template v-if="item.type === 'other'">
                <Icon icon="ph:file-bold" :size="48" />
              </template>

              <div class="media-item-suffix">
                <a-tag>
                  {{ item.fileUrl?.substring(item.fileUrl?.lastIndexOf('.') + 1) }}
                </a-tag>
              </div>
            </div>
            <div class="media-item-name text-center truncate">{{ item.name }}</div>
          </a-tooltip>
        </div>
      </div>
    </div>

    <div class="media-pagination text-right" v-if="mediaList.length">
      <span class="mr-2">共 {{ pager.total }} 条数据</span>
      <a-pagination
        style="display: inline-flex"
        size="small"
        show-quick-jumper
        show-size-changer
        v-model:current="pager.current"
        v-model:page-size="pager.pageSize"
        :total="pager.total"
        @change="handlePaginationChange"
      />
    </div>
    <template #footer>
      <a-typography-text class="mr-4" type="secondary"> 选择资源后点击插入按钮 </a-typography-text>

      <a-button-cancel text="关闭" @click="closeModal" />
      <a-button type="primary" @click="handleInsert(null)">
        <template #icon>
          <Icon icon="ant-design:plus-outlined" />
        </template>
        插入
      </a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { AButtonCancel } from '/@/components/Button';
  import { Icon } from '/@/components/Icon';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { useDictStore } from '/@/store/modules/dict';
  import { CmsMedia } from '/@/api/cms/model/cmsMediaModel';
  import { Empty, message, Pagination } from 'ant-design-vue';
  import { Page } from '/@/api/model/pageModel';
  import { select } from '/@/api/cms/cmsMedia';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getHtml } from './util';
  export default defineComponent({
    components: { Icon, AButtonCancel, BasicModal, APagination: Pagination },
    setup(_, { emit }) {
      const globSetting = useGlobSetting();

      const type = ref<string>('');
      const name = ref<Nullable<string>>();
      const mediaTypeDictArray = ref<SysDict[]>([]);

      const mediaList = ref<CmsMedia[]>([]);

      const pager = ref<Page<CmsMedia>>({ current: 1, pageSize: 15, total: 100 });

      const dictStore = useDictStore();

      const activeMediaList = ref<CmsMedia[]>([]);

      onMounted(() => {
        mediaTypeDictArray.value = [
          // @ts-ignore
          { code: '', name: '全部' },
          ...dictStore.selectDictArray('cmsMediaType'),
        ];
      });

      const [register, { closeModal, redoModalHeight }] = useModalInner(() => {
        type.value = '';
        name.value = null;
        pager.value.current = 1;
        pager.value.pageSize = 15;
        activeMediaList.value = [];
        handleSearch();
      });

      function handleInsert(media: Nullable<CmsMedia>) {
        if (media == null && activeMediaList.value.length === 0) {
          message.warn('请选择资源后重试');
          return;
        }

        if (media) {
          emit('insert', getHtml(media.type!, media.name!, globSetting.apiUrl + media.fileUrl));
        } else {
          const htmlArray: string[] = [];
          for (let i = 0; i < activeMediaList.value.length; i++) {
            htmlArray.push(
              getHtml(
                activeMediaList.value[i].type!,
                activeMediaList.value[i].name!,
                globSetting.apiUrl + activeMediaList.value[i].fileUrl,
              ),
            );
          }
          emit('insert', htmlArray.join(''));
        }
        closeModal();
      }
      async function handleSearch() {
        pager.value = await select(
          { type: type.value, name: name.value! },
          { current: pager.value.current, pageSize: pager.value.pageSize },
        );
        mediaList.value = pager.value.records!;
        nextTick(() => {
          redoModalHeight();
        });
      }

      function handlePaginationChange() {
        handleSearch();
      }

      function handleMediaActive(media: CmsMedia) {
        let isChose = false;
        for (let i = 0; i < activeMediaList.value.length; i++) {
          if (activeMediaList.value[i].id === media.id) {
            isChose = true;
            // 移除
            activeMediaList.value.splice(i, 1);
          }
        }
        if (!isChose) {
          activeMediaList.value.push(media);
        }
      }

      function isActive(media: CmsMedia) {
        for (let i = 0; i < activeMediaList.value.length; i++) {
          if (activeMediaList.value[i].id === media.id) {
            return true;
          }
        }
        return false;
      }

      return {
        apiUrl: globSetting.apiUrl,
        Empty,
        type,
        name,
        mediaTypeDictArray,
        mediaList,
        pager,
        register,
        closeModal,
        handleInsert,
        handleSearch,
        handlePaginationChange,
        isActive,
        handleMediaActive,
      };
    },
  });
</script>
<style scoped lang="less">
  .media-items {
    display: flex;
    flex-wrap: wrap;

    .media-item {
      width: 20%;
      padding: 8px;
      cursor: pointer;

      &.active {
        .media-item-name {
          color: #fff;
          background: @primary-color;
        }

        .media-item-preview {
          border: 1px solid @primary-color;
        }
      }

      .media-item-preview {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        padding: 8px;
        border: 1px solid #fff;
        background-position: 0 0, 10px 10px;
        background-size: 20px 20px;
        background-image: linear-gradient(
            45deg,
            #eee 25%,
            transparent 0,
            transparent 75%,
            #eee 0,
            #eee
          ),
          linear-gradient(45deg, #eee 25%, #fff 0, #fff 75%, #eee 0, #eee);

        img {
          max-width: 100%;
          max-height: 100%;
        }

        .media-item-suffix {
          position: absolute;
          top: 2px;
          left: 2px;
          opacity: 0.6;
        }
      }

      .media-item-name {
        padding: 4px 8px;
      }
    }
  }
</style>
