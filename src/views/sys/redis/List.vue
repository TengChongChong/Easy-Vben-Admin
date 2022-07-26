<template>
  <PageWrapper>
    <a-row>
      <a-col :xxl="6" :xl="8" :lg="10" :md="12" :sm="24">
        <div class="mb-4 md:mb-0 md:mr-4">
          <a-menu
            v-model:selectedKeys="currentSelectedKeys"
            mode="inline"
            :border="false"
            @click="handleMenuClick"
          >
            <a-menu-item v-for="item in redisPrefix" :key="item.code">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col :xxl="18" :xl="16" :lg="14" :md="12" :sm="24">
        <a-card title="Keys" :bordered="false">
          <a-alert
            type="info"
            message="请选择左侧Key前缀"
            banner
            v-if="!currentSelectedKeys.length"
          />

          <a-empty v-if="currentSelectedKeys.length && !keys.length && !loading" />

          <a-spin :spinning="loading">
            <div class="flex flex-wrap">
              <div class="xl:w-1/3 lg:w-1/2 p-2" v-for="item in keys" :key="item">
                <a-tooltip :title="item">
                  <a-button
                    @click="handleOpenInfoModal(item)"
                    class="truncate"
                    type="primary"
                    block
                  >
                    <div class="truncate">{{ item }}</div>
                  </a-button>
                </a-tooltip>
              </div>
            </div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>

    <InputModal @register="registerModal" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDictStore } from '/@/store/modules/dict';
  import { SysDict } from '/@/api/sys/model/sysDictModel';
  import { get, selectByPrefix } from '/@/api/sys/sysRedis';
  import { useModal } from '/@/components/Modal';
  import InputModal from './InputModal.vue';

  export default defineComponent({
    name: 'SysRedisList',
    components: {
      PageWrapper,
      InputModal,
    },
    setup() {
      const dictStore = useDictStore();
      const redisPrefix: SysDict[] = dictStore.selectDictArray('redisPrefix');
      const currentSelectedKeys = ref<string[]>([]);
      const loading = ref(false);
      const keys = ref<string[]>([]);

      const [registerModal, { openModal: openInfoModal }] = useModal();

      function handleMenuClick({ key }) {
        reload(key);
      }

      async function reload(key) {
        keys.value = [];
        loading.value = true;
        try {
          if (!key) {
            key = currentSelectedKeys.value[0];
          }
          await selectByPrefix(key).then((res) => {
            keys.value = res;
          });
        } catch (e) {
        } finally {
          loading.value = false;
        }
      }

      function handleOpenInfoModal(key) {
        get(key).then((res) => {
          openInfoModal(true, res);
        });
      }

      return {
        redisPrefix,
        currentSelectedKeys,
        keys,
        loading,
        registerModal,
        reload,
        handleMenuClick,
        handleOpenInfoModal,
      };
    },
  });
</script>
