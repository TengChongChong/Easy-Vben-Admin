<template>
  <BasicModal @register="register" @ok="handleSave" title="查询条件配置" :width="1200">
    <a-table :dataSource="queryConfig" :columns="columns" size="small" :pagination="false">
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
        <template v-if="column.dataIndex === 'label'">
          <a-input v-model:value="record.label" />
        </template>
        <template v-if="column.dataIndex === 'componentType'">
          <ComponentSelect v-model:value="record.componentType" />
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
        <template v-if="column.dataIndex === 'col'">
          <a-input v-model:value="record.col" />
        </template>
        <template v-if="column.dataIndex === 'matchingMode'">
          <dict-select dict-type="matchingMode" v-model:value="record.matchingMode" />
        </template>
      </template>
    </a-table>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { TableField } from '/@/api/generator/model/generatorModel';
  import { FieldConfig } from '/@/views/generator/ts/generator.data';
  import ComponentSelect from '/@/views/generator/components/ComponentSelect.vue';
  import DictSelect from '/@/components/Form/src/components/DictSelect.vue';
  import { selectAll } from '/@/api/sys/sysDictType';
  import { SelectModel } from '/@/api/model/selectModel';
  import { cloneDeep } from 'lodash-es';

  export default defineComponent({
    components: { DictSelect, ComponentSelect, BasicModal },
    emits: ['register', 'update-config'],
    setup(_, { emit }) {
      const dictTypeArray = ref<SelectModel[]>([]);
      const fields = ref<TableField[]>([]);
      const queryConfig = ref<Nullable<FieldConfig[]>>([]);
      const columns = [
        {
          title: '显示',
          dataIndex: 'isEnable',
          width: 80,
        },
        {
          title: '字段',
          dataIndex: 'name',
          width: 160,
        },
        {
          title: 'Label',
          dataIndex: 'label',
          width: 160,
        },
        {
          title: 'ComponentType',
          dataIndex: 'componentType',
          width: 200,
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          width: 260,
        },
        {
          title: '栅格',
          dataIndex: 'col',
          width: 160,
        },
        {
          title: '匹配方式',
          dataIndex: 'matchingMode',
          width: 160,
        },
      ];

      onMounted(() => {
        selectAll().then((res) => {
          dictTypeArray.value = res;
        });
      });

      const [register, { closeModal }] = useModalInner(({ tableInfo, config }) => {
        fields.value = tableInfo.fields;
        queryConfig.value = cloneDeep(config);
      });

      const handleSave = () => {
        emit('update-config', unref(queryConfig));
        closeModal();
      };

      return { columns, dictTypeArray, fields, queryConfig, register, handleSave };
    },
  });
</script>
