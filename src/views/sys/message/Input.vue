<template>
  <BasicForm @register="registerForm">
    <template #formFooter>
      <div class="btn-group-tools w-full text-center">
        <a-button-save :loading="saveBtnLoading" @click="handleSubmit" />
        <a-button-save @click="handleSaveAndAdd" :loading="saveBtnLoading" text="保存并新增" />
        <a-popconfirm
          title="发送后无法修改或删除，确定要立即发送吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="handleSaveAndSend"
        >
          <a-button-save :loading="saveBtnLoading" text="保存并发送" />
        </a-popconfirm>
      </div>
    </template>
  </BasicForm>
</template>
<script lang="ts">
  import { defineComponent, h, ref, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { add, get, save, send } from '/@/api/sys/sysMessage';
  import { SysMessage } from '/@/api/sys/model/sysMessageModel';
  import { propTypes } from '/@/utils/propTypes';
  import { AButtonSave } from '/@/components/Button';
  import { Tinymce } from '/@/components/Tinymce';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'SysMessageInput',
    components: { AButtonSave, BasicForm },
    props: {
      id: propTypes.string,
    },
    setup(props) {
      const saveBtnLoading = ref<boolean>(false);
      const { createMessage } = useMessage();

      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          {
            field: 'receivers',
            label: '收信人',
            component: 'UserSelect',
            required: true,
            itemProps: { validateTrigger: 'blur' },
            componentProps: {
              mode: 'multiple',
            },
          },
          {
            field: 'title',
            label: '标题',
            component: 'Input',
            required: true,
            rules: [{ max: 255, message: '标题不能超过255个字符', trigger: 'blur' }],
          },
          {
            field: 'type',
            label: '类型',
            component: 'DictRadio',
            componentProps: {
              dictType: 'messageType',
            },
            required: true,
            itemProps: { validateTrigger: 'blur' },
            colProps: { xl: 12 },
          },
          {
            field: 'important',
            label: '重要',
            component: 'DictRadio',
            componentProps: {
              dictType: 'whether',
            },
            required: true,
            itemProps: { validateTrigger: 'blur' },
            colProps: { xl: 12 },
          },
          {
            field: 'content',
            label: '内容',
            component: 'Input',
            render: ({ model, field }) => {
              return h(Tinymce, {
                value: model[field],
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

      watch(
        () => props.id,
        () => initPage(),
      );

      initPage();

      /**
       * 初始化数据
       */
      async function initPage() {
        let data;
        if (props.id) {
          data = await get(props.id);
        } else {
          data = await add();
        }
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
      }

      async function handleSave(callback: (_: SysMessage) => any) {
        try {
          saveBtnLoading.value = true;
          await validate();
          await save(getFieldsValue()).then(async (res) => {
            await setFieldsValue({
              content: res.content,
            });
            callback(res);
          });
        } catch (e) {
          console.error(e);
          saveBtnLoading.value = false;
        }
      }

      async function handleSubmit() {
        await handleSave((_) => {
          saveBtnLoading.value = false;
          createMessage.success('保存成功');
        });
      }

      async function handleSaveAndSend() {
        await handleSave((res) => {
          send(res.id)
            .then(() => {
              saveBtnLoading.value = false;
              createMessage.success('发送成功');
            })
            .catch(() => {
              saveBtnLoading.value = false;
            });
        });
      }

      async function handleSaveAndAdd() {
        await handleSave(() => {
          add().then(async (data) => {
            // 重置表单
            await resetFields();
            await setFieldsValue(data);
            saveBtnLoading.value = false;
          });
        });
      }

      return { saveBtnLoading, registerForm, handleSubmit, handleSaveAndAdd, handleSaveAndSend };
    },
  });
</script>
