<template>
  <div>
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    />
    <div class="footer-button">
      <a-button type="primary" @click="handleStepPrev">
        <template #icon>
          <Icon icon="ant-design:left-outlined" />
        </template>
        上一步
      </a-button>
      <a-button type="primary" @click="handleStepNext" :loading="nextBtnLoading">
        <template #icon>
          <Icon icon="ant-design:right-outlined" />
        </template>
        下一步
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import { useTable } from '/@/components/Table';
  import { select } from '/@/api/sys/sysConfig';

  export default defineComponent({
    components: { Icon },
    props: {
      sysImportExcelTemplate: {
        type: Object as PropType<SysImportExcelTemplate>,
      },
    },
    emits: ['prev', 'next'],
    setup(props, { emit }) {
      const downloadBtnLoading = ref<boolean>(false);
      const nextBtnLoading = ref<boolean>(false);
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      /**
       * 初始化表格
       */
      const [registerTable] = useTable({
        title: '系统参数',
        api: select,
        columns: [],
        useSearchForm: true,
        formConfig: {
          schemas: [],
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      function handleStepPrev() {
        emit('prev');
      }
      async function handleStepNext() {
        emit('next');
        // if (!file.value || file.value.length === 0) {
        //   message.warn('请上传文件后重试');
        //   return;
        // }
        // nextBtnLoading.value = true;
        // try {
        //   await analysis(
        //     props.sysImportExcelTemplate?.id as string,
        //     file.value[0].path as string,
        //   ).then((res) => {
        //     if (res) {
        //       emit('next');
        //     }
        //   });
        // } catch (e) {
        // } finally {
        //   nextBtnLoading.value = false;
        // }
      }

      return {
        downloadBtnLoading,
        nextBtnLoading,
        registerTable,
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>

<style lang="less">
  @import '../view.less';
</style>
