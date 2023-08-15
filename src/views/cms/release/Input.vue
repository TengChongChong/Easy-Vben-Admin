<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="网站发布"
    :width="720"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm" />
    <template #appendFooter>
      <a-button-save @click="handleSaveAndAdd" text="保存并新增" />
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { AButtonSave } from '/@/components/Button';
  import { save } from '/@/api/cms/cmsRelease';
  import { CmsRelease } from '/@/api/cms/model/cmsReleaseModel';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'CmsReleaseInput',
    components: { BasicDrawer, BasicForm, AButtonSave },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'releaseArticle',
            label: '是否发布栏目下文章',
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'total',
            label: '总任务',
            required: true,
            component: 'InputNumber',
            rules: [
              { type: 'number', max: 9999, message: '总任务不能大于9999', trigger: 'blur' },
              { type: 'number', min: 0, message: '总任务不能小于0', trigger: 'blur' },
            ],
          },
          {
            field: 'done',
            label: '已完成数量',
            required: true,
            component: 'InputNumber',
            rules: [
              { type: 'number', max: 9999, message: '已完成数量不能大于9999', trigger: 'blur' },
              { type: 'number', min: 0, message: '已完成数量不能小于0', trigger: 'blur' },
            ],
          },
          {
            field: 'fail',
            label: '发布失败数量',
            required: true,
            component: 'InputNumber',
            rules: [
              { type: 'number', max: 9999, message: '发布失败数量不能大于9999', trigger: 'blur' },
              { type: 'number', min: 0, message: '发布失败数量不能小于0', trigger: 'blur' },
            ],
          },
          {
            field: 'releaseDate',
            label: '发布时间',
            component: 'DatePicker',
            componentProps: {
              showTime: true,
            },
          },
          {
            field: 'endDate',
            label: '结束时间',
            component: 'Input',
            rules: [{ max: 32, message: '结束时间不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'receipt',
            label: '发布回执',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 1024, message: '发布回执不能超过1024个字符', trigger: 'blur' }],
          },
          {
            field: 'status',
            label: '状态',
            component: 'DictSelect',
            componentProps: {
              dictType: 'cmsReleaseStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        changeLoading(true);
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      async function handleSubmit(callback: (_: CmsRelease) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as CmsRelease).then((res) => {
            message.success('保存成功');
            emit('success');
            callback(res);
          });
        } catch (e) {
          console.error(e);
          changeLoading(false);
        }
      }

      async function handleSave() {
        await handleSubmit((_) => {
          changeLoading(false);
          closeDrawer();
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
          nextTick(() => {
            add().then(async (data) => {
              // 重置表单
              await resetFields();
              await setFieldsValue(data);
              changeLoading(false);
            });
          });
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
