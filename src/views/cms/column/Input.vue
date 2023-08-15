<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="栏目"
    :width="720"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm">
      <template #coverProportion="{ model }">
        <a-input-group compact>
          <a-form-item-rest>
            <a-input v-model:value="model.coverProportionWidth" class="!w-18" placeholder="宽" />

            <a-input
              style="width: 28px; pointer-events: none; background-color: #fff"
              placeholder=":"
              disabled
            />

            <a-input v-model:value="model.coverProportionHeight" class="!w-18" placeholder="高" />
          </a-form-item-rest>
        </a-input-group>
      </template>
    </BasicForm>
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
  import { add, save, selectAll } from '/@/api/cms/cmsColumn';
  import { CmsColumn } from '/@/api/cms/model/cmsColumnModel';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'CmsColumnInput',
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
            label: '上级栏目',
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
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'slug',
            label: '别名',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '别名不能超过32个字符', trigger: 'blur' }],
            itemProps: {
              extra: '栏目唯一标识，将显示在url中，如：/column/{别名}',
            },
          },
          // {
          //   field: '[coverProportionWidth, coverProportionHeight]',
          //   label: '封面比例',
          //   component: 'InputNumber',
          //   slot: 'coverProportion',
          //   itemProps: {
          //     extra: '如设置比例此栏目下文章封面裁剪时将固定比例',
          //   },
          // },
          {
            field: 'isRelease',
            label: '可发布文章',
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
            },
            required: true,
            itemProps: {
              validateTrigger: 'blur',
              extra: '发布文章时是否可以选择此栏目',
            },
          },
          {
            field: 'status',
            label: '状态',
            component: 'DictRadio',
            componentProps: {
              dictType: 'commonStatus',
            },
            required: true,
            itemProps: {
              validateTrigger: 'blur',
              extra: '发布文章、分配权限、发布站点等操作时，是否可选择此栏目',
            },
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
            rules: [{ max: 900, message: '描述不能超过900个字符', trigger: 'blur' }],
          },
          {
            field: 'remarks',
            label: '备注',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 900, message: '备注不能超过900个字符', trigger: 'blur' }],
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
        // await setFieldsValue({
        //   '[coverProportionWidth, coverProportionHeight]': data.coverProportionWidth
        //     ? [data.coverProportionWidth, data.coverProportionHeight]
        //     : null,
        // });
        changeLoading(false);
      });

      async function handleSubmit(callback: (_: CmsColumn) => any) {
        try {
          changeLoading(true);
          await validate();
          const cmsColumn: CmsColumn = getFieldsValue() as CmsColumn;
          // 检查封面比例填写是否正确
          if (!checkCoverProportion(cmsColumn)) {
            return false;
          }
          await save(cmsColumn).then((res) => {
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

      /**
       * 检查封面比例填写是否正确
       *
       * @param data 表单内容
       * @return true/false
       */
      function checkCoverProportion(data: CmsColumn) {
        const isComplete =
          (data.coverProportionWidth != null && data.coverProportionHeight == null) ||
          (data.coverProportionWidth == null && data.coverProportionHeight != null);
        if (isComplete) {
          message.warn('请填写完整的封面比例');
          changeLoading(false);
          return false;
        }

        return true;
      }

      async function updateParentData() {
        await updateSchema({
          field: 'parentId',
          componentProps: {
            t: new Date().getTime(),
          },
        });
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd, checkCoverProportion };
    },
  });
</script>
