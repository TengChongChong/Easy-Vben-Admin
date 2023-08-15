<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable :searchInfo="searchInfo" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'receipt'">
          <a-popover title="错误信息" v-if="record.receipt">
            <template #content>
              <p v-for="(line, index) in convertTraceInfo(record.receipt)" :key="index">
                {{ line }}
              </p>
            </template>
            {{ record.receipt }}
          </a-popover>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center"> </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchFormSchema, columns } from '/@/views/cms/release/queue/queue.data';
  import { select } from '/@/api/cms/cmsReleaseQueue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'CmsReleaseQueueList',
    components: {
      PageWrapper,
      BasicTable,
    },
    setup() {
      const { currentRoute } = useRouter();
      const { parentId } = unref(currentRoute).query;

      // 查询条件
      const searchInfo = reactive<Recordable>({ parentId });

      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '发布列队详情',
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

      function convertTraceInfo(str: string) {
        console.log(str.split('\n'));
        const trace: string[] = [];
        // 栈转为数组
        str.split('\n').forEach((item) => {
          trace.push(item);
        });
        return trace;
      }

      return {
        searchInfo,
        registerTable,
        reload,
        convertTraceInfo,
      };
    },
  });
</script>
