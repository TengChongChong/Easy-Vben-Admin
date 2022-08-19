<template>
  <div>
    <a-list bordered>
      <template v-for="item in getData" :key="item.id">
        <a-list-item class="list-item">
          <a-list-item-meta>
            <template #title>
              <div
                @click="handleOpenInfoModel(item.id, item.messageId)"
                class="title"
                :title="item.title"
              >
                {{ item.title }}
              </div>
            </template>

            <template #avatar>
              <a-avatar :size="50" v-if="item.avatar" :src="apiUrl + item.avatar" />
              <a-avatar :size="50" v-if="!item.avatar">
                {{ item.nickname?.substring(0, 1) }}
              </a-avatar>
            </template>

            <template #description>
              <dict-tag dictType="messageType" :value="item.type" />
              {{ formatToNow(item.sendDate) }}
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <InfoModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, ref } from 'vue';
  import { SysMessage } from '/@/api/sys/model/sysMessageModel';
  import { useGlobSetting } from '/@/hooks/setting';
  import { DictTag } from '/@/components/Dict';
  import { formatToNow } from '/@/utils/dateUtil';
  import { info } from '/@/api/sys/sysMessage';
  import { useModal } from '/@/components/Modal';
  import InfoModal from '/@/views/sys/message/InfoModal.vue';

  export default defineComponent({
    components: { InfoModal, DictTag },
    props: {
      list: {
        type: Array as PropType<SysMessage[]>,
        default: () => [],
      },
    },
    emits: ['read'],
    setup(props, { emit }) {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);

      const getData = computed(() => {
        return props.list;
      });

      const [registerModal, { openModal: openInfoModal }] = useModal();

      function handleOpenInfoModel(id: string, messageId: string) {
        info(id, messageId).then((res) => {
          openInfoModal(true, res);
          emit('read');
        });
      }

      return { formatToNow, apiUrl, getData, registerModal, handleOpenInfoModel };
    },
  });
</script>
<style lang="less" scoped>
  .list-item {
    padding: 6px;
    overflow: hidden;
    transition: all 0.3s;

    .title {
      cursor: pointer;
      margin-bottom: 5px;
      font-weight: normal;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;

      .avatar {
        margin-top: 4px;
      }

      .description {
        font-size: 12px;
        line-height: 18px;
      }

      .datetime {
        margin-top: 4px;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
</style>
