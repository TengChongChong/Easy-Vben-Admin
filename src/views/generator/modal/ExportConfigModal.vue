<template>
  <BasicModal @register="register" @ok="handleSave" title="导出配置" :width="960">
    <a-table :dataSource="tableConfig" :columns="columns" size="small" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'isEnable'">
          <a-checkbox v-model:checked="record.isEnable" />
        </template>
        <template v-if="column.dataIndex === 'name'">
          <a-popover>
            <template #content>
              <div>列名：{{ record.name }}</div>
              <div>
                类型：{{ record.metaInfo.jdbcType?.toLowerCase() }}
                {{ record.metaInfo.length ? `(${record.metaInfo.length})` : '' }}
              </div>
              <div>属性：{{ record.propertyName }}</div>
              <div>注释：{{ record.comment ? record.comment : '-' }}</div>
            </template>
            <a-typography-link>{{ record.propertyName }}</a-typography-link>
          </a-popover>
        </template>
        <template v-if="column.dataIndex === 'title'">
          <a-input v-model:value="record.title" />
        </template>
        <template v-if="column.dataIndex === 'dictType'">
          <a-select
            style="width: 260px"
            show-search
            option-filter-prop="label"
            :options="dictTypeArray"
            v-model:value="record.dictType"
          />
        </template>
        <template v-if="column.dataIndex === 'width'">
          <a-input-number v-model:value="record.width" />
        </template>
      </template>
    </a-table>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { TableField } from '/@/api/generator/model/generatorModel';
  import { TableCellConfig } from '/@/views/generator/ts/generator.data';
  import { selectAll } from '/@/api/sys/sysDictType';
  import { SelectModel } from '/@/api/model/selectModel';
  import { cloneDeep } from 'lodash-es';

  export default defineComponent({
    components: { BasicModal },
    emits: ['register', 'update-config'],
    setup(_, { emit }) {
      const dictTypeArray = ref<SelectModel[]>([]);
      const fields = ref<TableField[]>([]);
      const tableConfig = ref<Nullable<TableCellConfig[]>>([]);
      const columns = [
        {
          title: '导出',
          dataIndex: 'isEnable',
          width: 80,
        },
        {
          title: '字段',
          dataIndex: 'name',
          width: 160,
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 160,
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          width: 320,
        },
        {
          title: '宽度',
          dataIndex: 'width',
          width: 120,
        },
      ];

      onMounted(() => {
        selectAll().then((res) => {
          dictTypeArray.value = res;
        });
      });

      const [register, { closeModal }] = useModalInner(({ tableInfo, config }) => {
        fields.value = tableInfo.fields;
        tableConfig.value = cloneDeep(config);
      });

      const handleSave = () => {
        emit('update-config', unref(tableConfig));
        closeModal();
      };

      return { columns, dictTypeArray, fields, tableConfig, register, handleSave };
    },
  });
</script>
