<template>
  <div class="personal-center-security">
    <a-list class="demo-loadmore-list" item-layout="horizontal">
      <a-list-item>
        <a-list-item-meta description="账号登录密码">
          <template #title>密码</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:key-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="openChangePasswordModal(true, {})">修改</a-button>
        </template>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta description="用于账号登录与找回密码">
          <template #title>手机：{{ data.phoneNumber ? data.phoneNumber : '未绑定' }}</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:mobile-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="openChangePhoneModal(true, {})">
            {{ data.phoneNumber ? '修改' : '绑定' }}
          </a-button>
        </template>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta description="用于账号登录与找回密码">
          <template #title>邮箱： {{ data.email ? data.email : '未绑定' }}</template>
          <template #avatar>
            <Icon :size="26" icon="ant-design:mail-outlined" />
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="link" @click="openChangeEmailModal(true, {})">
            {{ data.email ? '修改' : '绑定' }}
          </a-button>
        </template>
      </a-list-item>
    </a-list>

    <ChangePassword @register="registerChangePassword" />
    <ChangePhone @register="registerChangePhone" />
    <ChangeEmail @register="registerChangeEmail" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { SysUser } from '/@/api/auth/model/sysUserModel';
  import ChangePassword from '/@/views/auth/personal/center/ChangePassword.vue';
  import ChangePhone from '/@/views/auth/personal/center/ChangePhone.vue';
  import ChangeEmail from '/@/views/auth/personal/center/ChangeEmail.vue';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    components: { ChangePassword, ChangePhone, ChangeEmail, Icon },
    props: {
      data: {
        type: Object as PropType<SysUser>,
      },
    },
    setup() {
      const [registerChangePassword, { openModal: openChangePasswordModal }] = useModal();
      const [registerChangePhone, { openModal: openChangePhoneModal }] = useModal();
      const [registerChangeEmail, { openModal: openChangeEmailModal }] = useModal();

      return {
        registerChangePassword,
        openChangePasswordModal,
        registerChangePhone,
        openChangePhoneModal,
        registerChangeEmail,
        openChangeEmailModal,
      };
    },
  });
</script>

<style lang="less">
  .personal-center-security {
    .ant-list-item-meta-avatar {
      margin: 10px 20px;
    }
  }
</style>
