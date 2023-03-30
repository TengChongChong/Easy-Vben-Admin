<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="导入模板"
    width="80%"
    @ok="handleSave"
  >
    <a-descriptions bordered class="mb-4">
      <a-descriptions-item label="模版名称">
        {{ sysImportExcelTemplate.name }}
      </a-descriptions-item>
      <a-descriptions-item label="模版代码">
        {{ sysImportExcelTemplate.importCode }}
      </a-descriptions-item>
      <a-descriptions-item label="表">
        {{ sysImportExcelTemplate.importTable }}
      </a-descriptions-item>
    </a-descriptions>
    <a-table
      :data-source="sysImportExcelTemplateDetailList"
      :columns="columns"
      size="small"
      bordered
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'needImport'">
          <a-checkbox v-model:checked="record.needImport" />
        </template>
        <template v-if="column.dataIndex === 'fieldName'">
          <a-popover>
            <template #content>
              <div>
                类型：{{ record.fieldType }}
                {{ record.fieldLength ? `(${record.fieldLength})` : '' }}
              </div>
            </template>
            <a-typography-link>{{ record.fieldName }}</a-typography-link>
          </a-popover>
        </template>
        <template v-if="column.dataIndex === 'title'">
          <a-input v-model:value="record.title" :disabled="!record.needImport" />
        </template>
        <template v-if="column.dataIndex === 'replaceTable'">
          <a-select
            v-model:value="record.replaceTable"
            show-search
            option-filter-prop="label"
            :allowClear="true"
            :options="tableArray"
            style="width: 200px"
            :disabled="!record.needImport"
            @change="handleChangeReplaceTable(record)"
          />
        </template>
        <template v-if="column.dataIndex === 'replaceTableDictType'">
          <a-select
            v-model:value="record.replaceTableDictType"
            show-search
            option-filter-prop="label"
            :allowClear="true"
            :disabled="!record.needImport || record.replaceTable !== 'sys_dict'"
            :options="dictTypeArray"
            style="width: 200px"
          />
        </template>
        <template v-if="column.dataIndex === 'replaceTableFieldName'">
          <table-field-select
            v-model:value="record.replaceTableFieldName"
            :allowClear="true"
            :disabled="!record.needImport || !record.replaceTable"
            :table="record.replaceTable"
          />
        </template>
        <template v-if="column.dataIndex === 'replaceTableFieldValue'">
          <table-field-select
            v-model:value="record.replaceTableFieldValue"
            :allowClear="true"
            :disabled="!record.needImport || !record.replaceTable"
            :table="record.replaceTable"
          />
        </template>
        <template v-if="column.dataIndex === 'required'">
          <a-checkbox v-model:checked="record.required" :disabled="!record.needImport" />
        </template>
        <template v-if="column.dataIndex === 'only'">
          <a-checkbox v-model:checked="record.only" :disabled="!record.needImport" />
        </template>
      </template>
    </a-table>
    <template #appendFooter>
      <a-button type="primary" @click="handleOrderField">
        <Icon icon="ant-design:ordered-list-outlined" />
        字段排序
      </a-button>
    </template>

    <OrderFieldModal @register="registerModal" @success="updateDetailList" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { SysImportExcelTemplate } from '/@/api/sys/model/sysImportExcelTemplateModel';
  import { getTableInfo, selectTable } from '/@/api/generator/generator';
  import { SysImportExcelTemplateDetail } from '/@/api/sys/model/sysImportExcelTemplateDetailModel';
  import { saveData, selectDetails } from '/@/api/sys/sysImportExcelTemplateDetail';
  import { getDictType, toDictTypeArray } from '/@/views/generator/ts/util';
  import { selectAll as selectAllDictType } from '/@/api/sys/sysDictType';
  import { SelectModel } from '/@/api/model/selectModel';
  import TableFieldSelect from '/@/views/sys/import/excel/template/components/TableFieldSelect.vue';
  import { Icon } from '/@/components/Icon';
  import OrderFieldModal from './components/OrderFieldModal.vue';
  import { useModal } from '/@/components/Modal';
  import { TableInfo } from '/@/api/generator/model/generatorModel';

  export default defineComponent({
    name: 'SysImportExcelTemplateDetailsConfig',
    components: { OrderFieldModal, TableFieldSelect, BasicDrawer, Icon },
    emits: ['register'],
    setup() {
      const [registerModal, { openModal }] = useModal();

      const sysImportExcelTemplate = ref<SysImportExcelTemplate>({});
      const sysImportExcelTemplateDetailList = ref<SysImportExcelTemplateDetail[]>([]);
      const tableArray = ref<SelectModel[]>([]);
      const dictTypeArray = ref<SelectModel[]>([]);
      let tableInfo: Nullable<TableInfo> = null;
      let isLoad = false;

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        isLoad = false;
        sysImportExcelTemplate.value = data;
        sysImportExcelTemplateDetailList.value = [];
        await initCommonData();
        changeLoading(true);
        await loadData(data);
        changeLoading(false);
      });

      /**
       * 加载公共参数
       */
      async function initCommonData() {
        if (isLoad) {
          return;
        }
        isLoad = true;
        await selectTable({ dataSource: 'master' }).then((res) => {
          res.map((item) => {
            item.label = `${item.value} - ${item.label}`;
          });
          tableArray.value = res;
        });

        dictTypeArray.value = await selectAllDictType();
        tableInfo = await getTableInfo('master', sysImportExcelTemplate.value.importTable!);
      }

      /**
       * 加载数据
       *
       * @param data
       */
      async function loadData(data) {
        // 字典类型 array
        const dictTypeList = toDictTypeArray(unref(dictTypeArray));
        const setDetailList = await selectDetails(data.id);

        const detailList: SysImportExcelTemplateDetail[] = [];
        const noSetDetailList: SysImportExcelTemplateDetail[] = [];

        // 已设置
        setDetailList.map((item) => {
          detailList.push({
            needImport: true,
            ...item,
          });
        });

        // 未设置
        tableInfo?.fields.map((item) => {
          const { name, comment, metaInfo } = item;

          if (!inSet(setDetailList, name)) {
            const dictType = getDictType(tableInfo!, item, dictTypeList);
            noSetDetailList.push({
              fieldName: name,
              title: comment,
              fieldType: metaInfo.jdbcType,
              fieldLength: metaInfo.length,
              needImport: false,
              needReplace: false,
              replaceTable: dictType ? 'sys_dict' : undefined,
              replaceTableDictType: dictType!,
              replaceTableFieldName: dictType ? 'name' : undefined,
              replaceTableFieldValue: dictType ? 'code' : undefined,
              required: false,
              only: false,
            });
          }
        });
        sysImportExcelTemplateDetailList.value = detailList.concat(noSetDetailList);
      }

      function updateDetailList(detailList) {
        const noSetList = sysImportExcelTemplateDetailList.value.filter((item) => !item.needImport);
        sysImportExcelTemplateDetailList.value = detailList.concat(noSetList);
      }

      function handleChangeReplaceTable(record) {
        if ('sys_dict' === record.replaceTable) {
          record.replaceTableFieldName = 'name';
          record.replaceTableFieldValue = 'code';
        } else if ('sys_dept' === record.replaceTable) {
          record.replaceTableFieldName = 'name';
          record.replaceTableFieldValue = 'id';
        } else {
          record.replaceTableFieldValue = 'id';
          record.replaceTableFieldName = null;
        }
      }

      function handleOrderField() {
        openModal(
          true,
          sysImportExcelTemplateDetailList.value.filter((item) => item.needImport),
        );
      }

      /**
       * 是否已设置
       *
       * @param setDetailList
       * @param name
       * @return true/false
       */
      function inSet(setDetailList: SysImportExcelTemplateDetail[], name: string): boolean {
        for (let i = 0; i < setDetailList.length; i++) {
          if (setDetailList[i].fieldName === name) {
            return true;
          }
        }
        return false;
      }

      async function handleSave() {
        try {
          changeLoading(true);
          const list = sysImportExcelTemplateDetailList.value.filter((item) => item.needImport);
          saveData(sysImportExcelTemplate.value.id!, list).then(() => {
            closeDrawer();
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      return {
        tableArray,
        dictTypeArray,
        sysImportExcelTemplate,
        sysImportExcelTemplateDetailList,
        registerModal,
        handleChangeReplaceTable,
        handleOrderField,
        updateDetailList,
        registerDrawer,
        handleSave,
        columns: [
          {
            dataIndex: 'needImport',
            title: '导入',
            width: 50,
          },
          {
            title: '字段',
            children: [
              {
                dataIndex: 'fieldName',
                title: '列名',
                width: 120,
              },
              {
                dataIndex: 'title',
                title: '标题',
                width: 100,
              },
            ],
          },
          {
            title: '字段转换',
            children: [
              {
                dataIndex: 'replaceTable',
                title: '替换表',
                width: 200,
              },
              {
                dataIndex: 'replaceTableDictType',
                title: '字典类别',
                width: 200,
              },
              {
                dataIndex: 'replaceTableFieldName',
                title: '导入值',
                width: 160,
              },
              {
                dataIndex: 'replaceTableFieldValue',
                title: '替换值',
                width: 160,
              },
            ],
          },
          {
            dataIndex: 'required',
            title: '必填',
            width: 50,
          },
          {
            dataIndex: 'only',
            title: '唯一',
            width: 50,
          },
        ],
      };
    },
  });
</script>
