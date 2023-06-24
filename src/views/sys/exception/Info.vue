<template>
  <PageWrapper contentBackground>
    <a-descriptions :column="2" class="p-4" bordered>
      <a-descriptions-item label="异常类型">{{ exceptionInfo?.type }}</a-descriptions-item>
      <a-descriptions-item label="错误码">{{ exceptionInfo?.code }}</a-descriptions-item>
      <a-descriptions-item label="url" :span="2">{{ exceptionInfo?.url }}</a-descriptions-item>
      <a-descriptions-item label="触发用户">{{ exceptionInfo?.nickname }}</a-descriptions-item>
      <a-descriptions-item label="触发时间">
        {{ dayjs(exceptionInfo?.triggerTime).format('YYYY-MM-DD HH:mm') }}
      </a-descriptions-item>
      <a-descriptions-item label="错误信息" :span="2">
        {{ exceptionInfo?.message }}
      </a-descriptions-item>
      <a-descriptions-item label="调用栈" :span="2">
        <div :key="index" v-for="(item, index) in trace">
          <a-typography-text :type="item.startsWith('com.easy.admin') ? 'danger' : ''">
            {{ item }}
          </a-typography-text>
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { get } from '/@/api/sys/sysException';
  import { SysException } from '/@/api/sys/model/sysExceptionModel';
  import { PageWrapper } from '/@/components/Page';
  import dayjs from 'dayjs';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    name: 'SysExceptionInfo',
    components: { PageWrapper },
    setup() {
      const { setTitle } = useTabs();
      const { currentRoute } = useRouter();
      const { id } = unref(currentRoute).params;
      const exceptionInfo = ref<SysException>();

      const trace = ref<string[]>([]);

      onMounted(() => {
        getInfo();
      });

      const getInfo = () => {
        get(id as string).then((res) => {
          // 设置标题
          setTitle(`详情 > ${res.url}`);

          exceptionInfo.value = res;
          trace.value = [];
          // 栈转为数组
          res.trace.split('\n\t').forEach((item) => {
            trace.value.push(item);
          });
        });
      };

      return { dayjs, exceptionInfo, trace };
    },
  });
</script>

<style>
  .ant-descriptions-bordered .ant-descriptions-item-label {
    width: 120px;
  }
</style>
