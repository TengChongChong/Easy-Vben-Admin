<template>
  <div>
    <BasicTable
      style="padding: 0"
      :inset="true"
      :searchInfo="searchInfo"
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'verificationResults'">
          <template v-if="record.verificationStatus === '1'">
            <a-typography-text type="success">验证通过</a-typography-text>
          </template>
          <template v-else>
            <a-tooltip color="red">
              <template #title>
                <template
                  v-for="(item, index) in record.verificationResults.split(';')"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </template>
              </template>
              <div class="truncate">
                <a-typography-text type="danger">
                  {{ record.verificationResults }}
                </a-typography-text>
              </div>
            </a-tooltip>
          </template>
        </template>
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-remove small :id="record.id" :api="remove" @success="removeCallback" />
          </div>
        </template>
      </template>
    </BasicTable>
    <div class="footer-button">
      <a-popconfirm
        title="确定要放弃当前导入数据吗？"
        ok-text="是"
        cancel-text="否"
        @confirm="handleStepPrev"
      >
        <a-button type="primary" :loading="prevBtnLoading">
          <template #icon>
            <Icon icon="ant-design:left-outlined" />
          </template>
          上一步
        </a-button>
      </a-popconfirm>
      <a-button
        v-if="importSummary?.fail"
        @click="handleExportVerificationFailData"
        :loading="downloadBtnLoading"
      >
        <template #icon>
          <Icon icon="ant-design:download-outlined" />
        </template>
        下载验证失败数据
      </a-button>
      <a-button
        type="primary"
        v-if="importSummary?.success"
        @click="handleStepNext"
        :loading="nextBtnLoading"
      >
        <template #icon>
          <Icon icon="ant-design:right-outlined" />
        </template>
        导入验证通过数据
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import { select, remove, cleanMyImport } from '/@/api/sys/sysImportExcelTemporary';
  import { SysImportExcelTemplateDetail } from '/@/api/sys/model/sysImportExcelTemplateDetailModel';
  import { AButtonRemove } from '/@/components/Button';
  import {
    exportVerificationFailData,
    insertData,
    selectSummary,
    SysImportSummary,
  } from '/@/api/sys/sysImportExcelData';
  import { downloadFileById } from '/@/utils/file/download';

  export default defineComponent({
    components: { AButtonRemove, BasicTable, Icon },
    props: {
      sysImportExcelTemplate: {
        type: Object as PropType<SysImportExcelTemplate>,
        request: true,
      },
    },
    emits: ['prev', 'next', 'update'],
    setup(props, { emit }) {
      const downloadBtnLoading = ref<boolean>(false);
      const prevBtnLoading = ref<boolean>(false);
      const nextBtnLoading = ref<boolean>(false);
      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);
      // 查询条件
      const searchInfo = reactive<Recordable>({});
      // 验证结果汇总
      const importSummary = ref<SysImportSummary>();

      onMounted(() => {
        searchInfo.templateId = props.sysImportExcelTemplate?.id;
        initTable();
        loadSummary();
      });

      watch(
        () => props.sysImportExcelTemplate,
        () => {
          searchInfo.templateId = props.sysImportExcelTemplate?.id;
          initTable();
        },
      );

      /**
       * 初始化表格
       */
      const [registerTable, { setProps, getForm, setColumns, reload }] = useTable({
        title: '导入预览',
        api: select,
        columns: [],
        showTableSetting: false,
        useSearchForm: true,
        formConfig: {
          schemas: [],
        },
        actionColumn: {
          width: 80,
          title: '操作',
          key: 'action',
        },
      });

      // 默认列
      const DEFAULT_COLUMN: BasicColumn[] = [
        {
          title: '验证结果',
          dataIndex: 'verificationResults',
          sorter: true,
          width: 160,
          fixed: 'right',
        },
      ];

      /**
       * 初始化表格
       */
      function initTable() {
        const columns: BasicColumn[] = [];
        const formSchemas: FormSchema[] = [];
        if (
          props.sysImportExcelTemplate?.detailList &&
          props.sysImportExcelTemplate?.detailList.length
        ) {
          props.sysImportExcelTemplate?.detailList.map((item, index) => {
            columns.push({
              title: item.title,
              dataIndex: `field${index + 1}`,
              format: item.replaceTableDictType ? `dict|${item.replaceTableDictType}` : undefined,
              sorter: true,
              width: getColumnWidth(item),
            });

            if (index < 3) {
              formSchemas.push({
                field: `field${index + 1}`,
                label: item.title as string,
                component: getFormComponent(item),
                componentProps: {
                  dictType: item.replaceTableDictType,
                },
              });
            }
          });

          getForm().setProps({
            schemas: formSchemas,
          });
        }
        setColumns(columns.concat(DEFAULT_COLUMN));
      }

      /**
       * 获取查询条件组件类型
       *
       * @param templateDetail
       */
      function getFormComponent(templateDetail: SysImportExcelTemplateDetail) {
        if (templateDetail.replaceTableDictType) {
          return 'DictSelect';
        } else {
          return 'Input';
        }
      }

      /**
       * 获取单元格宽度
       *
       * @param templateDetail
       */
      function getColumnWidth(templateDetail: SysImportExcelTemplateDetail) {
        const max = 360;
        const min = 100;
        if (templateDetail.fieldLength) {
          return Math.max(Math.min(templateDetail.fieldLength * 4, max), min);
        } else {
          return 160;
        }
      }

      function removeCallback() {
        reload();
        loadSummary();
      }

      function loadSummary() {
        selectSummary(searchInfo.templateId).then((summary) => {
          importSummary.value = summary;
          setProps({
            title:
              summary.total === summary.success
                ? `共${summary.total}条数据，全部验证通过`
                : summary.success > 0
                ? `共${summary.total}条数据，验证通过${summary.success}条，验证失败${summary.fail}条`
                : `共${summary.total}条数据，全部验证失败`,
          });
        });
      }

      /**
       * 上一步
       */
      async function handleStepPrev() {
        prevBtnLoading.value = true;
        try {
          await cleanMyImport(props.sysImportExcelTemplate?.id as string);
        } catch (e) {
          console.error(e);
        } finally {
          emit('prev');
          prevBtnLoading.value = false;
        }
      }

      /**
       * 下载验证失败数据
       */
      async function handleExportVerificationFailData() {
        downloadBtnLoading.value = true;
        try {
          await exportVerificationFailData(props.sysImportExcelTemplate?.id as string).then(
            (id) => {
              downloadFileById(id);
            },
          );
        } catch (e) {
        } finally {
          downloadBtnLoading.value = false;
        }
      }

      /**
       * 导入验证通过数据
       */
      async function handleStepNext() {
        nextBtnLoading.value = true;
        try {
          await insertData(props.sysImportExcelTemplate?.id as string).then((res) => {
            emit('update', {
              total: importSummary.value?.total,
              success: res,
              fail: (importSummary.value?.total as number) - res,
            });
            emit('next');
          });
        } catch (e) {
        } finally {
          nextBtnLoading.value = false;
        }
      }

      return {
        prevBtnLoading,
        nextBtnLoading,
        downloadBtnLoading,
        searchInfo,
        importSummary,
        registerTable,
        checkedKeys,
        reload,
        remove,
        removeCallback,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        handleExportVerificationFailData,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>

<style lang="less">
  @import '../view.less';
</style>
