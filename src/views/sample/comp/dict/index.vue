<template>
  <PageWrapper>
    <div class="dict-wrapper">
      <a-alert message="字典数据来源于系统管理 > 字典管理功能" type="info" class="mb-4" show-icon />

      <a-row :gutter="[16, 16]">
        <a-col :xl="12" :lg="24">
          <a-card title="基础示例" :bordered="false">
            <h3>名称</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="性别">
                <dict-name dictType="sex" value="1" />、
                <dict-name dictType="sex" value="2" />
              </a-descriptions-item>
              <a-descriptions-item label="用户状态">
                <dict-name dictType="userStatus" value="1" />、
                <dict-name dictType="userStatus" value="2" />、
                <dict-name dictType="userStatus" value="0" />
              </a-descriptions-item>
            </a-descriptions>
            <h3>Tag - 标签</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="性别">
                <dict-tag dictType="sex" value="1" />
                <dict-tag dictType="sex" value="2" />
              </a-descriptions-item>
              <a-descriptions-item label="用户状态">
                <dict-tag dictType="userStatus" value="1" />
                <dict-tag dictType="userStatus" value="2" />
                <dict-tag dictType="userStatus" value="0" />
              </a-descriptions-item>
            </a-descriptions>
            <h3>Radio - 单选框</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="性别">
                <dict-radio dictType="sex" v-model:value="sexValue" />
              </a-descriptions-item>
              <a-descriptions-item label="用户状态">
                <dict-radio dictType="userStatus" v-model:value="userStatusValue" />
              </a-descriptions-item>
            </a-descriptions>
            <h3>Checkbox - 多选框</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="性别">
                <dict-checkbox dictType="sex" v-model:value="sexArrayValue" />
              </a-descriptions-item>
              <a-descriptions-item label="用户状态">
                <dict-checkbox dictType="userStatus" v-model:value="userStatusArrayValue" />
              </a-descriptions-item>
            </a-descriptions>
            <h3>Select - 选择器</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="性别">
                <dict-select dictType="sex" v-model:value="sexValue" />
              </a-descriptions-item>
              <a-descriptions-item label="用户状态">
                <dict-select dictType="userStatus" v-model:value="userStatusValue" />
              </a-descriptions-item>
            </a-descriptions>
            <h3>Cascader - 级联选择</h3>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="级联选择">
                <dict-cascader dictType="levelSample" v-model:value="levelSampleValue" />
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24">
          <a-card title="在表单中使用" :bordered="false" class="!mb-4">
            <BasicForm @register="register" />
          </a-card>
          <BasicTable @register="registerTable" />
        </a-col>
      </a-row>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DictTag from '/@/components/Dict/DictTag.vue';
  import DictName from '/@/components/Dict/DictName.vue';
  import DictRadio from '/@/components/Form/src/components/DictRadio.vue';
  import DictCheckbox from '/@/components/Form/src/components/DictCheckbox.vue';
  import DictSelect from '/@/components/Form/src/components/DictSelect.vue';
  import DictCascader from '/@/components/Form/src/components/DictCascader.vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select } from '/@/api/sample/sampleGeneral';
  export default defineComponent({
    components: {
      DictCascader,
      DictSelect,
      DictCheckbox,
      DictRadio,
      DictName,
      DictTag,
      PageWrapper,
      BasicForm,
      BasicTable,
    },
    setup() {
      const sexValue = ref<string>('1');
      const userStatusValue = ref<string>('2');
      const sexArrayValue = ref<string[]>(['1']);
      const userStatusArrayValue = ref<string[]>(['2']);
      const levelSampleValue = ref<string[]>(['1', '1-1', '1-1-1']);

      const schemas: FormSchema[] = [
        {
          field: 'sexRadio',
          label: '性别',
          component: 'DictRadio',
          componentProps: {
            dictType: 'sex',
          },
        },
        {
          field: 'userStatusRadio',
          label: '用户状态',
          component: 'DictRadio',
          componentProps: {
            dictType: 'userStatus',
          },
        },
        {
          field: 'sexCheckbox',
          label: '性别',
          component: 'DictCheckbox',
          componentProps: {
            dictType: 'sex',
          },
        },
        {
          field: 'userStatusCheckbox',
          label: '用户状态',
          component: 'DictCheckbox',
          componentProps: {
            dictType: 'userStatus',
          },
        },
        {
          field: 'sexSelect',
          label: '性别',
          component: 'DictSelect',
          componentProps: {
            dictType: 'sex',
          },
        },
        {
          field: 'userStatusSelect',
          label: '用户状态',
          component: 'DictSelect',
          componentProps: {
            dictType: 'userStatus',
          },
        },
        {
          field: 'levelSampleCascader',
          label: '级联选择',
          component: 'DictCascader',
          componentProps: {
            dictType: 'levelSample',
          },
        },
      ];

      const [register, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: { sm: 24 },
        baseColProps: { sm: 24 },
      });

      const formModel = {
        sexRadio: '1',
        userStatusRadio: '2',
        sexCheckbox: ['1'],
        userStatusCheckbox: ['1'],
        sexSelect: '2',
        userStatusSelect: '1',
        levelSampleCascader: ['1', '1-1', '1-1-1'],
      };

      onMounted(() => {
        setFieldsValue(formModel);
      });

      /**
       * 初始化表格
       */
      const [registerTable] = useTable({
        title: '在表格中作为筛选条件',
        api: select,
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            sorter: true,
            width: 160,
          },
          {
            title: '性别',
            dataIndex: 'sex',
            sorter: true,
            width: 150,
            format: 'dict|sex',
            filters: 'dict|sex',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            sorter: true,
            width: 160,
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
            sorter: true,
            width: 160,
          },
        ],
        useSearchForm: false,
      });

      return {
        sexValue,
        userStatusValue,
        sexArrayValue,
        userStatusArrayValue,
        levelSampleValue,
        register,
        registerTable,
      };
    },
  });
</script>
<style lang="less">
  .dict-wrapper {
    h3 {
      margin-top: 0.5rem;
    }
    .ant-descriptions-bordered {
      .ant-descriptions-item-label {
        width: 120px;
      }
    }
  }
</style>
