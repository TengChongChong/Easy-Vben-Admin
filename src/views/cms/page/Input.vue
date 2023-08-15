<template>
  <PageWrapper>
    <a-card>
      <Loading :loading="loading || saveBtnLoading" tip="加载中..." />
      <BasicForm @register="registerForm" />
      <div class="text-center">
        <a-space v-if="!isChangeSite">
          <a-button-save :loading="saveBtnLoading" @click="handleSave" />
          <a-button-save :loading="saveBtnLoading" text="保存并新增" @click="handleSaveAndAdd" />
        </a-space>
        <a-alert
          style="display: inline-flex"
          v-if="isChangeSite"
          message="你已切换站点，本页面无法保存"
          type="warning"
          show-icon
        />
      </div>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, onMounted, nextTick, watch, h } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Loading } from '/@/components/Loading';
  import { useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { BasicForm, useForm } from '/@/components/Form';
  import { AButtonSave } from '/@/components/Button';
  import { add, save, get, selectThemePageTemplate } from '/@/api/cms/cmsPage';
  import { CmsPage } from '/@/api/cms/model/cmsPageModel';
  import Editor from '/@/views/cms/components/Tinymce/Editor.vue';
  import { useCmsStore } from '/@/store/modules/cms';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'CmsPageInput',
    components: { PageWrapper, Loading, BasicForm, AButtonSave },
    setup() {
      const { setTitle } = useTabs();
      const { currentRoute } = useRouter();
      const { id } = unref(currentRoute).query;

      const isChangeSite = ref(false);

      const loading = ref(false);
      const saveBtnLoading = ref(false);

      // 监听切换站点
      const cmsStore = useCmsStore();

      watch(
        () => cmsStore.getCurrentSite,
        () => {
          isChangeSite.value = true;
        },
      );

      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'title',
            label: '标题',
            required: true,
            component: 'Input',
            rules: [{ max: 128, message: '标题不能超过128个字符', trigger: 'blur' }],
          },
          {
            field: 'subtitle',
            label: '副标题',
            component: 'InputTextArea',
            componentProps: {
              autoSize: {
                minRows: 2,
                maxRows: 7,
              },
            },
            rules: [{ max: 256, message: '副标题不能超过256个字符', trigger: 'blur' }],
          },
          {
            field: 'slug',
            label: '别名',
            required: true,
            component: 'Input',
            colProps: { md: 12, sm: 24 },
            rules: [{ max: 32, message: '别名不能超过32个字符', trigger: 'blur' }],
            itemProps: {
              extra: '页面唯一标识，将显示在url中，如：/page/{别名}',
            },
          },
          {
            field: 'template',
            label: '模板',
            required: true,
            component: 'ApiSelect',
            componentProps: {
              api: selectThemePageTemplate,
            },
            colProps: { md: 12, sm: 24 },
            rules: [{ max: 128, message: '模板不能超过128个字符', trigger: 'blur' }],
            itemProps: {
              validateTrigger: 'blur',
              extra: '页面渲染模板，请将模板放到主题/page/目录下',
            },
          },
          {
            field: 'content',
            label: '内容',
            component: 'Input',
            render: ({ model, field }) => {
              return h(Editor, {
                value: model[field],
                height: 595,
                onChange: (value: string) => {
                  model[field] = value;
                },
              });
            },
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { md: 24 },
      });

      onMounted(async () => {
        loading.value = true;
        try {
          let data;
          if (id) {
            data = await get(id as string);
            // 设置标签页名称
            await setTitle((data.title as string) || '编辑页面');
          } else {
            // 设置标签页名称
            await setTitle('新增页面');
            data = await add();
          }
          // 重置表单
          await resetFields();
          await setFieldsValue(data);
        } catch (e) {
          console.error(e);
        } finally {
          loading.value = false;
        }
      });

      async function handleSubmit(callback: (_: CmsPage) => any) {
        try {
          saveBtnLoading.value = true;
          await validate();
          await save(getFieldsValue() as CmsPage).then((res) => {
            message.success('保存成功');
            callback(res);
          });
        } catch (e) {
          console.error(e);
        } finally {
          saveBtnLoading.value = false;
        }
      }

      async function handleSave() {
        await handleSubmit(async (data) => {
          await setFieldsValue(data);
        });
      }

      async function handleSaveAndAdd() {
        await handleSubmit(() => {
          nextTick(() => {
            add().then(async (data) => {
              loading.value = true;
              // 重置表单
              await resetFields();
              await setFieldsValue(data);
              loading.value = false;
            });
          });
        });
      }

      return { loading, saveBtnLoading, isChangeSite, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
