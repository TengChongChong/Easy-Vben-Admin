<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="站点"
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
  import { add, save, selectAll } from '/@/api/cms/cmsSite';
  import { CmsSite } from '/@/api/cms/model/cmsSiteModel';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'CmsSiteInput',
    components: { BasicDrawer, BasicForm, AButtonSave },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [
        registerForm,
        { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema },
      ] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'parentId',
            label: '上级站点',
            component: 'ApiTreeSelect',
            componentProps: {
              api: selectAll,
              afterFetch: (res) => {
                const treeNodes: TreeNode[] = [] as TreeNode[];
                res.map((item) => {
                  const { id, parentId, title } = item;
                  treeNodes.push({
                    id,
                    parentId,
                    title,
                    value: id,
                    key: id,
                  });
                });
                return listToTree(treeNodes);
              },
            },
          },
          {
            field: 'name',
            label: '名称',
            required: true,
            component: 'Input',
            rules: [{ max: 64, message: '名称不能超过64个字符', trigger: 'blur' }],
          },
          {
            field: 'keyword',
            label: '关键字',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            itemProps: {
              extra: 'SEO，用于首页meta[name="keywords"]值，多个关键字使用,隔开',
            },
            rules: [{ max: 900, message: '关键字不能超过900个字符', trigger: 'blur' }],
          },
          {
            field: 'description',
            label: '描述',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            itemProps: {
              extra: 'SEO，用于首页meta[name="description"]值',
            },
            rules: [{ max: 900, message: '描述不能超过900个字符', trigger: 'blur' }],
          },
          {
            field: 'domainName',
            label: '域名',
            required: true,
            component: 'Input',
            rules: [{ max: 255, message: '域名不能超过255个字符', trigger: 'blur' }],
            itemProps: {
              extra: '站点域名，例如：http://www.sample.com',
            },
          },
          {
            field: 'deploymentPath',
            label: '部署路径',
            required: true,
            component: 'Input',
            rules: [{ max: 255, message: '部署路径不能超过255个字符', trigger: 'blur' }],
            itemProps: {
              extra: '站点静态文件存放路径，例如/home/soft/site/xxx',
            },
          },
          {
            field: 'theme',
            label: '主题名称',
            component: 'Input',
            rules: [{ max: 32, message: '主题名称不能超过32个字符', trigger: 'blur' }],
            itemProps: {
              extra: '站点模板路径',
            },
          },
          {
            field: 'status',
            label: '状态',
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            itemProps: { validateTrigger: 'blur' },
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async (data) => {
        changeLoading(true);
        await updateParentData();
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      async function handleSubmit(callback: (_: CmsSite) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as CmsSite).then((res) => {
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
        await handleSubmit((res) => {
          nextTick(() => {
            updateParentData();
            add(res.parentId).then(async (data) => {
              // 重置表单
              await resetFields();
              await setFieldsValue(data);
              changeLoading(false);
            });
          });
        });
      }

      async function updateParentData() {
        await updateSchema({
          field: 'parentId',
          componentProps: {
            t: new Date().getTime(),
          },
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
