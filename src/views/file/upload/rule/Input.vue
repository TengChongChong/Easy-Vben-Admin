<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="文件上传规则"
    :width="720"
    @ok="handleSave"
  >
    <BasicForm @register="registerForm">
      <template #fileSizeLimit="{ model }">
        <a-input-group compact>
          <a-form-item-rest>
            <a-input-number
              id="inputNumber"
              v-model:value="model.lowerLimit"
              :min="1"
              :max="Math.max(model.upperLimit - 1, 1)"
            />

            <a-input
              style="width: 30px; pointer-events: none; background-color: #fff"
              placeholder="~"
              disabled
            />
            <a-input-number
              id="inputNumber"
              v-model:value="model.upperLimit"
              :min="Math.max(model.lowerLimit - 1, 1)"
              :max="1048576"
            />
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
  import { add, save } from '/@/api/file/fileUploadRule';
  import { message } from 'ant-design-vue';
  import { FileUploadRule } from '/@/api/file/model/fileUploadRuleModel';

  export default defineComponent({
    name: 'FileUploadRuleInput',
    components: { BasicDrawer, BasicForm, AButtonSave },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: [
          { field: 'id', label: 'id', component: 'Input', show: false },
          { field: 'version', label: 'version', component: 'Input', show: false },
          { field: 'lowerLimit', label: 'lowerLimit', component: 'InputNumber', show: false },
          { field: 'upperLimit', label: 'upperLimit', component: 'InputNumber', show: false },
          {
            field: 'category',
            label: '分类',
            required: true,
            component: 'DictSelect',
            componentProps: {
              dictType: 'sysFileUploadRuleCategory',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'name',
            label: '名称',
            required: true,
            component: 'Input',
            rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'slug',
            label: '别名',
            required: true,
            component: 'Input',
            rules: [{ max: 32, message: '别名不能超过32个字符', trigger: 'blur' }],
            itemProps: {
              extra: '上传规则标识，不可重复',
            },
          },
          {
            field: 'bucket',
            label: '文件夹/桶',
            required: true,
            component: 'Input',
            rules: [{ max: 64, message: '文件桶（使用oss时）不能超过64个字符', trigger: 'blur' }],
            itemProps: {
              extra:
                '存储模式不同分为：Local 模式下为文件夹名称 / OSS 模式下为Bucket名称；必须以小写字母或者数字开头和结尾，长度为3~63个字符',
            },
          },
          {
            field: 'fileSizeLimit',
            label: '文件大小',
            component: 'InputNumber',
            slot: 'fileSizeLimit',
            rules: [{ required: true, validator: checkFileSizeLimit, trigger: ['change', 'blur'] }],
            itemProps: {
              extra: '允许上传的文件大小，单位 KB',
            },
          },
          {
            field: 'suffix',
            label: '文件后缀',
            required: true,
            component: 'Input',
            rules: [{ max: 255, message: '文件后缀不能超过255个字符', trigger: 'blur' }],
            itemProps: {
              extra: '允许上传的文件后缀，多个使用 , 隔开，例如：jpg,png,gif',
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
        // 重置表单
        await resetFields();
        await setFieldsValue(data);
        changeLoading(false);
      });

      async function handleSubmit(callback: (_: FileUploadRule) => any) {
        try {
          changeLoading(true);
          await validate();
          await save(getFieldsValue() as FileUploadRule).then((res) => {
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

      function checkFileSizeLimit() {
        const data = getFieldsValue() as FileUploadRule;
        if (data.lowerLimit == null) {
          return Promise.reject('请输入允许上传的最小文件');
        }
        if (data.upperLimit == null) {
          return Promise.reject('请输入允许上传的最大文件');
        }
        if (data.lowerLimit >= data.upperLimit) {
          return Promise.reject('允许上传的最小文件不能大于或等于允许上传的最大文件');
        }
        return Promise.resolve();
      }

      return { registerDrawer, registerForm, handleSave, handleSaveAndAdd };
    },
  });
</script>
