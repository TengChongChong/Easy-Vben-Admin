<template>
  <BasicForm @register="registerForm">
    <template #cover="{ model, field }">
      <basic-upload
        :max-size="5"
        :max-number="1"
        :accept="['image/*']"
        :multiple="false"
        v-model:value="model[field]"
      />
    </template>
  </BasicForm>
</template>

<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { selectAll } from '/@/api/cms/cmsColumn';
  import { TreeNode } from '/@/api/model/treeModel';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { defineComponent, watch } from 'vue';
  import { CmsArticle } from '/@/api/cms/model/cmsArticleModel';
  import { BasicUpload } from '/@/components/Upload';

  export default defineComponent({
    components: { BasicForm, BasicUpload },
    props: {
      cmsArticle: { type: Object as PropType<CmsArticle> },
    },
    setup(props) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 80,
        schemas: [
          {
            field: 'columnId',
            label: '栏目',
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
            required: true,
            itemProps: {
              validateTrigger: 'blur',
            },
          },
          {
            field: 'cover',
            label: '封面',
            slot: 'cover',
            component: 'Input',
          },
          {
            field: 'orderNo',
            label: '排序值',
            component: 'InputNumber',
            rules: [
              { type: 'number', max: 9999, message: '排序值不能大于9999', trigger: 'blur' },
              { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' },
            ],
            itemProps: {
              extra: '栏目下文章顺序，数字越大文章越靠前',
            },
          },
          {
            field: 'excerpt',
            label: '摘要',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 1024, message: '摘要不能超过1024个字符', trigger: 'blur' }],
          },
          {
            field: 'tags',
            label: '标签',
            component: 'Select',
            componentProps: {
              mode: 'tags',
              tokenSeparators: [',', ' '],
            },
            itemProps: {
              extra: '支持多个，输入后按回车键输入下一个标签',
            },
          },
          {
            field: 'source',
            label: '信息来源',
            component: 'Input',
            rules: [{ max: 128, message: '信息来源不能超过128个字符', trigger: 'blur' }],
          },
          {
            field: 'author',
            label: '作者',
            component: 'Input',
            rules: [{ max: 32, message: '作者不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'releaseDate',
            label: '发布时间',
            component: 'DatePicker',
            ifShow: false,
            componentProps: {
              showTime: true,
            },
          },
          {
            field: 'offlineDate',
            label: '下线时间',
            component: 'DatePicker',
            ifShow: false,
            componentProps: {
              showTime: true,
            },
          },
          {
            field: 'url',
            label: '访问地址',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 512, message: '访问地址不能超过512个字符', trigger: 'blur' }],
            itemProps: {
              extra: '文章为外链时填写',
            },
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      watch(
        () => props.cmsArticle,
        async () => {
          await resetFields();
          await setFieldsValue(props.cmsArticle);

          await setFieldsValue({
            tags: props.cmsArticle?.tags?.split(','),
          });
        },
      );

      return { registerForm, validate, getFieldsValue };
    },
  });
</script>

<style scoped lang="less"></style>
