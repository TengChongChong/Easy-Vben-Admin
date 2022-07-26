<template>
  <PageWrapper>
    <a-card title="内存" :bordered="false" class="!mb-4">
      <a-descriptions bordered :column="4">
        <a-descriptions-item label="Max Memory">
          {{ (runtimeInfo?.maxMemory / 1024 / 1024).toFixed(2) }} MB
        </a-descriptions-item>
        <a-descriptions-item label="Total Memory">
          {{ (runtimeInfo?.totalMemory / 1024 / 1024).toFixed(2) }} MB
        </a-descriptions-item>
        <a-descriptions-item label="Free Memory">
          {{ (runtimeInfo?.freeMemory / 1024 / 1024).toFixed(2) }} MB
        </a-descriptions-item>
        <a-descriptions-item label="Usable Memory">
          <span> {{ (runtimeInfo?.usableMemory / 1024 / 1024).toFixed(2) }} </span> MB
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="JAVA" :bordered="false" class="!mb-4">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="Java Virtual Machine Specification">
          {{ jvmSpecInfo?.name }} {{ jvmSpecInfo?.version }} {{ jvmSpecInfo?.vendor }}
        </a-descriptions-item>

        <a-descriptions-item label="Java Virtual Machine Implementation">
          {{ jvmInfo?.name }} {{ jvmInfo?.version }} {{ jvmInfo?.vendor }} {{ jvmInfo?.info }}
        </a-descriptions-item>

        <a-descriptions-item label="Java Specification">
          {{ javaSpecInfo?.name }} {{ javaSpecInfo?.version }} {{ javaSpecInfo?.vendor }}
        </a-descriptions-item>

        <a-descriptions-item label="Java Implementation">
          <a target="_blank" :href="javaInfo?.vendorURL">
            {{ javaInfo?.vendor }} {{ javaInfo?.version }}
          </a>
        </a-descriptions-item>

        <a-descriptions-item label="Java Runtime" :span="2">
          Java Runtime Name: {{ javaRuntimeInfo?.name }} <br />
          Java Runtime Version: {{ javaRuntimeInfo?.version }} <br />
          Java Home Dir: {{ javaRuntimeInfo?.homeDir }} <br />
          Java Endorsed Dirs: {{ javaRuntimeInfo?.endorsedDirs }} <br />
          Java Class Version: {{ javaRuntimeInfo?.classVersion }} <br />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="系统信息" :bordered="false">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="OS">
          {{ osInfo?.name }} {{ osInfo?.arch }} {{ osInfo?.version }}
        </a-descriptions-item>
        <a-descriptions-item label="User Name">
          {{ userInfo?.name }}
        </a-descriptions-item>
        <a-descriptions-item label="User Current Dir">
          {{ userInfo?.currentDir }}
        </a-descriptions-item>
        <a-descriptions-item label="Host Address">
          {{ hostInfo?.address }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    getHostInfo,
    getJavaInfo,
    getJavaRuntimeInfo,
    getJavaSpecInfo,
    getJvmInfo,
    getJvmSpecInfo,
    getOsInfo,
    getRuntimeInfo,
    getUserInfo,
  } from '/@/api/sys/sysStatus';
  import {
    HostInfo,
    JavaInfo,
    JavaRuntimeInfo,
    JavaSpecInfo,
    JvmInfo,
    JvmSpecInfo,
    OsInfo,
    RuntimeInfo,
    UserInfo,
  } from '/@/api/sys/model/sysStatusModel';

  export default defineComponent({
    name: 'SysStatusView',
    components: {
      PageWrapper,
    },
    setup() {
      const jvmSpecInfo = ref<JvmSpecInfo>();
      const jvmInfo = ref<JvmInfo>();
      const javaSpecInfo = ref<JavaSpecInfo>();
      const javaInfo = ref<JavaInfo>();
      const javaRuntimeInfo = ref<JavaRuntimeInfo>();
      const osInfo = ref<OsInfo>();
      const userInfo = ref<UserInfo>();
      const hostInfo = ref<HostInfo>();
      const runtimeInfo = ref<RuntimeInfo>();

      loadData();

      setInterval(async () => {
        runtimeInfo.value = await getRuntimeInfo();
      }, 1000 * 10);

      async function loadData() {
        jvmSpecInfo.value = await getJvmSpecInfo();
        jvmInfo.value = await getJvmInfo();
        javaSpecInfo.value = await getJavaSpecInfo();
        javaInfo.value = await getJavaInfo();
        javaRuntimeInfo.value = await getJavaRuntimeInfo();
        osInfo.value = await getOsInfo();
        userInfo.value = await getUserInfo();
        hostInfo.value = await getHostInfo();
        runtimeInfo.value = await getRuntimeInfo();
      }

      return {
        jvmSpecInfo,
        jvmInfo,
        javaSpecInfo,
        javaInfo,
        javaRuntimeInfo,
        osInfo,
        userInfo,
        hostInfo,
        runtimeInfo,
      };
    },
  });
</script>
