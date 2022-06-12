<template>
  <PageWrapper>
    <a-spin :spinning="loading">
      <a-result
        :status="loading ? 'info' : result ? 'success' : 'error'"
        :title="loading ? '验证中...' : result ? '验证成功' : '验证失败'"
        :sub-title="
          loading
            ? '请稍候...'
            : result
            ? '验证邮箱成功，你可以使用邮箱进行登录或找回密码'
            : errorMessage || '验证失败，请重试'
        "
      >
        <template #extra v-if="!loading">
          <a-button type="primary" href="/"> 登录 </a-button>
        </template>
      </a-result>
    </a-spin>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { verifies } from '/@/api/auth/sysMailVerification';

  export default defineComponent({
    name: 'AuthPersonalSettingMailVerifies',
    components: { PageWrapper },
    setup() {
      const { currentRoute } = useRouter();

      const code = ref<string>(unref(currentRoute).params.code as string);
      const errorMessage = ref<string>();
      const result = ref<boolean>(false);
      const loading = ref<boolean>(true);

      onMounted(async () => {
        await verifies(unref(code))
          .then(() => {
            result.value = true;
          })
          .catch((res) => {
            errorMessage.value = res.response.data.errorMessage;
          });
        loading.value = false;
      });

      return { loading, result, errorMessage };
    },
  });
</script>

<style scoped></style>
