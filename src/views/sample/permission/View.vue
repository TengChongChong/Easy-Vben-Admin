<template>
  <PageWrapper>
    <a-card title="权限验证">
      <p>
        当前角色: <a> {{ userStore.getRoleList }} </a>
      </p>
      <a-divider>组件方式判断权限</a-divider>
      <Authority :value="RoleEnum.SYS_ADMIN">
        <a-button type="primary" class="mx-4"> 拥有sys:admin角色权限可见 </a-button>
      </Authority>

      <Authority :value="RoleEnum.ADMIN">
        <a-button color="success" class="mx-4"> 拥有admin角色权限可见 </a-button>
      </Authority>

      <Authority :value="[RoleEnum.ADMIN, RoleEnum.SYS_ADMIN]">
        <a-button color="error" class="mx-4"> 拥有[admin,sys:admin]角色权限可见 </a-button>
      </Authority>

      <a-divider>函数方式方式判断权限</a-divider>
      <a-button v-if="hasPermission(RoleEnum.SYS_ADMIN)" type="primary" class="mx-4">
        拥有sys:admin角色权限可见
      </a-button>

      <a-button v-if="hasPermission(RoleEnum.ADMIN)" color="success" class="mx-4">
        拥有admin角色权限可见
      </a-button>

      <a-button
        v-if="hasPermission([RoleEnum.ADMIN, RoleEnum.SYS_ADMIN])"
        color="error"
        class="mx-4"
      >
        拥有[admin,sys:admin]角色权限可见
      </a-button>

      <a-divider>指令方式方式判断权限</a-divider>
      <a-button v-auth="RoleEnum.SYS_ADMIN" type="primary" class="mx-4">
        拥有sys:admin角色权限可见
      </a-button>

      <a-button v-auth="RoleEnum.ADMIN" color="success" class="mx-4">
        拥有admin角色权限可见
      </a-button>

      <a-button v-auth="[RoleEnum.ADMIN, RoleEnum.SYS_ADMIN]" color="error" class="mx-4">
        拥有[admin,sys:admin]角色权限可见
      </a-button>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SamplePermissionView',
    components: { PageWrapper, Authority },
    setup() {
      const { hasPermission } = usePermission();
      const userStore = useUserStore();

      return {
        userStore,
        RoleEnum,
        hasPermission,
      };
    },
  });
</script>
