<template>
  <PageWrapper contentBackground>
    <a-row>
      <a-col :xxl="6" :xl="8" :lg="10" :md="12">
        <div class="personal-center-side">
          <div class="user-info">
            <a-row>
              <a-col :span="10">
                <div class="user-avatar">
                  <a-avatar v-if="sysUser.avatar" :src="apiUrl + sysUser.avatar" :size="100" />
                  <a-avatar v-if="!sysUser.avatar" :size="100">
                    {{ sysUser.nickname?.substring(0, 1) }}
                  </a-avatar>
                </div>
              </a-col>
              <a-col :span="14">
                <div class="user-details">
                  <div class="user-nickname">{{ sysUser.nickname }}</div>
                  <div class="user-dept-name">{{ sysUser.dept?.name }}</div>
                  <div class="user-tag">
                    <dict-tag dict-type="sex" :value="sysUser.sex" :icon="true" />
                    <a-tag v-if="sysUser.birthday">{{ getAge }} 岁</a-tag>
                  </div>
                </div>
              </a-col>
            </a-row>
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="手机">{{ sysUser.phoneNumber }}</a-descriptions-item>
              <a-descriptions-item label="邮箱">{{ sysUser.email }}</a-descriptions-item>
              <a-descriptions-item label="上次登录">
                {{ dayjs(sysUser.lastLoginDate).format('YYYY-MM-DD HH:mm') }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <a-menu v-model:selectedKeys="selectedKeys" mode="inline" :border="false">
            <a-menu-item key="basic">
              <template #icon>
                <Icon icon="ant-design:profile-outlined" />
              </template>
              <span>基本设置</span>
            </a-menu-item>
            <a-menu-item key="security">
              <template #icon>
                <Icon icon="ant-design:lock-outlined" />
              </template>
              <span>安全设置</span>
            </a-menu-item>
            <a-menu-item key="binding">
              <template #icon>
                <Icon icon="ant-design:link-outlined" />
              </template>
              <span>账号绑定</span>
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col :xxl="18" :xl="16" :lg="14" :md="12">
        <div class="p-4">
          <Basic :data="sysUser" v-if="selectedKeys[0] === 'basic'" />
          <Security :data="sysUser" v-if="selectedKeys[0] === 'security'" />
          <Binding :data="sysUser" v-if="selectedKeys[0] === 'binding'" />
        </div>
      </a-col>
    </a-row>
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import Basic from '/@/views/auth/personal/center/Basic.vue';
  import Binding from '/@/views/auth/personal/center/Binding.vue';
  import Security from '/@/views/auth/personal/center/Security.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { DictTag } from '/@/components/Dict';
  import dayjs from 'dayjs';
  import { useGlobSetting } from '/@/hooks/setting';
  export default defineComponent({
    name: 'AuthPersonalCenterView',
    components: {
      DictTag,
      Security,
      Binding,
      Basic,
      Icon,
      PageWrapper,
    },
    setup() {
      const userStore = useUserStore();
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);

      const sysUser = computed(() => userStore.getCurrentUser);

      const selectedKeys = ref<string[]>(['basic']);

      const getAge = computed(() => {
        if (sysUser.value.birthday) {
          return dayjs(new Date()).diff(sysUser.value.birthday, 'year');
        } else {
          return 0;
        }
      });

      return { apiUrl, selectedKeys, sysUser, getAge, dayjs };
    },
  });
</script>
<style lang="less">
  html[data-theme='dark'] {
    .personal-center-side {
      border-right: 1px solid @border-color-dark;
    }
  }

  html[data-theme='light'] {
    .personal-center-side {
      border-right: 1px solid @border-color-light;
    }
  }

  .personal-center-side {
    .ant-menu-inline,
    .ant-menu-vertical,
    .ant-menu-vertical-left {
      border-right: 0;
    }

    .ant-menu {
      margin-bottom: 1rem;
    }

    .user-info {
      padding: 1rem;

      .ant-descriptions {
        margin-top: 1rem;

        .ant-descriptions-item-content {
          display: table-cell;
          text-align: right;
        }
      }

      .user-avatar {
        text-align: center;
      }

      .user-details {
        padding: 10px 1rem;

        .user-nickname {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .user-dept-name {
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
