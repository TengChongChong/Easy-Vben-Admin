<template>
  <PageWrapper contentBackground>
    <a-descriptions :column="2" class="p-4" bordered>
      <a-descriptions-item label="模块">{{ logInfo?.modular }}</a-descriptions-item>
      <a-descriptions-item label="方法">{{ logInfo?.method }}</a-descriptions-item>
      <a-descriptions-item label="url" :span="2">{{ logInfo?.url }}</a-descriptions-item>
      <a-descriptions-item label="操作人">{{ logInfo?.operationUser }}</a-descriptions-item>
      <a-descriptions-item label="操作时间">
        {{ dayjs(logInfo?.operationDate).format('YYYY-MM-DD HH:mm') }}
      </a-descriptions-item>
      <a-descriptions-item label="ip">{{ logInfo?.ip }}</a-descriptions-item>
      <a-descriptions-item label="class">
        {{ logInfo?.clazz }}.{{ logInfo?.methodName }}
      </a-descriptions-item>
      <a-descriptions-item label="参数" :span="2">
        {{ logInfo?.params }}
      </a-descriptions-item>
    </a-descriptions>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { get } from '/@/api/sys/sysLog';
  import { PageWrapper } from '/@/components/Page';
  import dayjs from 'dayjs';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { SysLog } from '/@/api/sys/model/sysLogModel';

  export default defineComponent({
    name: 'SysLogInfo',
    components: { PageWrapper },
    setup() {
      const { setTitle } = useTabs();
      const { currentRoute } = useRouter();
      const id = ref<string>(unref(currentRoute).params?.id as string);
      const logInfo = ref<SysLog>();

      const trace = ref<string[]>([]);

      onMounted(() => {
        getInfo();
      });

      const getInfo = () => {
        get(unref(id)).then((res) => {
          // 设置标题
          setTitle(`详情 > ${res.url}`);

          logInfo.value = res;
        });
      };

      return { dayjs, logInfo, trace };
    },
  });
</script>

<style>
  .ant-descriptions-bordered .ant-descriptions-item-label {
    width: 120px;
  }
</style>
