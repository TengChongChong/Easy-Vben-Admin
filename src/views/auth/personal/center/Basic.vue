<template>
  <BasicForm @register="registerForm">
    <template #avatar>
      <CropperAvatar
        :circled="true"
        v-model:value="avatarUrl"
        :width="100"
        uploadRuleSlug="sys-user-avatar"
        @change="handleAvatarChange"
      />
    </template>
    <template #formFooter>
      <div class="w-full text-center">
        <a-button-save @click="handleSave" />
      </div>
    </template>
  </BasicForm>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, watch, ref, unref } from 'vue';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { useForm } from '/@/components/Form';
  import { AButtonSave } from '/@/components/Button';
  import { SysUser } from '/@/api/auth/model/sysUserModel';
  import { useUserStore } from '/@/store/modules/user';
  import { saveUserInfo } from '/@/api/auth/sysUserPersonal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { CropperAvatar } from '/@/components/Cropper';
  import { FileInfo } from '/@/api/file/model/fileInfoModel';

  export default defineComponent({
    components: { CropperAvatar, AButtonSave, BasicForm },
    props: {
      data: {
        type: Object as PropType<SysUser>,
      },
    },
    setup(props) {
      const userStore = useUserStore();
      const { createMessage } = useMessage();
      const avatar = ref<Nullable<FileInfo>>();
      const avatarUrl = ref<Nullable<string>>();
      const [registerForm, { validate, getFieldsValue, setFieldsValue }] = useForm({
        schemas: [
          {
            field: 'avatar',
            label: '头像',
            slot: 'avatar',
            component: 'Input',
          },
          {
            field: 'nickname',
            label: '昵称',
            component: 'Input',
            required: true,
            rules: [{ max: 32, message: '昵称不能超过32个字符', trigger: 'blur' }],
          },
          {
            field: 'sex',
            label: '性别',
            required: true,
            component: 'DictRadio',
            componentProps: {
              dictType: 'sex',
            },
            itemProps: { validateTrigger: 'blur' },
          },
          {
            field: 'birthday',
            label: '生日',
            component: 'DatePicker',
          },
        ],
        showActionButtonGroup: false,
        baseColProps: { xl: 13, lg: 24 },
      });

      watch(
        () => props.data,
        () => {
          setValue();
        },
        { deep: true },
      );

      onMounted(() => {
        setValue();
      });

      async function setValue() {
        await setFieldsValue({
          ...props.data,
        });

        avatarUrl.value = props.data?.avatar?.url;
      }

      function handleAvatarChange(file: FileInfo) {
        console.log('更改头像', file);
        avatar.value = file;
      }

      async function handleSave() {
        try {
          await validate();
          const values = getFieldsValue();
          await saveUserInfo({ ...values, avatar: unref(avatar)! }).then(() => {
            createMessage.success('保存成功');
            userStore.refreshCurrentUserAction();
          });
        } catch (e) {
          console.error(e);
        }
      }

      return { avatarUrl, registerForm, handleAvatarChange, handleSave };
    },
  });
</script>

<style scoped></style>
