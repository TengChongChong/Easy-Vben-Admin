<template>
  <div>
    <a-list bordered>
      <template v-for="item in getData" :key="item.id">
        <a-list-item class="list-item">
          <a-list-item-meta>
            <template #title>
              <div @click="handleOpenDrawer(item.id)" class="title" :title="item.businessTitle">
                <a-tag color="green">{{ item.processDefinitionName }}</a-tag>
                {{ item.businessTitle }}
              </div>
            </template>

            <template #description>
              {{ item.applyUser }}
              <a-divider type="vertical" />
              {{ formatToNow(item.createTime) }}
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <ActivitiTaskInput @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, ref } from 'vue';
  import { SysMessage } from '/@/api/sys/model/sysMessageModel';
  import { useGlobSetting } from '/@/hooks/setting';
  import { formatToNow } from '/@/utils/dateUtil';
  import ActivitiTaskInput from '/@/views/activiti/task/Input.vue';
  import { useDrawer } from '/@/components/Drawer';

  export default defineComponent({
    components: { ActivitiTaskInput },
    props: {
      list: {
        type: Array as PropType<SysMessage[]>,
        default: () => [],
      },
    },
    emits: ['hide', 'success'],
    setup(props, { emit }) {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);

      const getData = computed(() => {
        return props.list;
      });

      const [registerDrawer, { openDrawer }] = useDrawer();

      function handleOpenDrawer(id: string) {
        emit('hide');
        openDrawer(true, id);
      }

      function handleSuccess() {
        emit('success');
      }

      return { formatToNow, apiUrl, getData, registerDrawer, handleOpenDrawer, handleSuccess };
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
