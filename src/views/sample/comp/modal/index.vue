<template>
  <PageWrapper>
    <a-card title="Modal组件使用示例" :bordered="false">
      <a-alert
        message="使用 useModal 进行对话框操作，默认可以拖动，可以通过 draggable
    参数进行控制是否可以拖动/全屏，并演示了在Modal内动态加载内容并自动调整高度"
        show-icon
      />
      <a-button type="primary" class="my-4" @click="openModalLoading">
        打开对话框,加载动态数据并自动调整高度(默认可以拖动/全屏)
      </a-button>

      <a-alert message="内外同时同时显示隐藏" show-icon />
      <a-button type="primary" class="my-4" @click="openModal2"> 打开对话框 </a-button>
      <a-alert message="自适应高度" show-icon />
      <a-button type="primary" class="my-4" @click="openModal3"> 打开对话框 </a-button>

      <a-alert message="内外数据交互" show-icon />
      <a-button type="primary" class="my-4" @click="send"> 打开对话框并传递数据 </a-button>

      <a-alert message="使用动态组件的方式在页面内使用多个对话框" show-icon />
      <a-space>
        <a-button type="primary" class="my-4" @click="openTargetModal(1)"> 打开对话框1 </a-button>
        <a-button type="primary" class="my-4" @click="openTargetModal(2)"> 打开对话框2 </a-button>
        <a-button type="primary" class="my-4" @click="openTargetModal(3)"> 打开对话框3 </a-button>
        <a-button type="primary" class="my-4" @click="openTargetModal(4)"> 打开对话框4 </a-button>
      </a-space>

      <component :is="currentModal" v-model:visible="modalVisible" :userData="userData" />

      <Modal1 @register="register1" :minHeight="100" />
      <Modal2 @register="register2" />
      <Modal3 @register="register3" />
      <Modal4 @register="register4" />
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, shallowRef, ComponentOptions, ref, nextTick } from 'vue';
  import { useModal } from '/@/components/Modal';
  import Modal1 from './Modal1.vue';
  import Modal2 from './Modal2.vue';
  import Modal3 from './Modal3.vue';
  import Modal4 from './Modal4.vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { Modal1, Modal2, Modal3, Modal4, PageWrapper },
    setup() {
      const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
      const [register1, { openModal: openModal1 }] = useModal();
      const [register2, { openModal: openModal2 }] = useModal();
      const [register3, { openModal: openModal3 }] = useModal();
      const [register4, { openModal: openModal4 }] = useModal();
      const modalVisible = ref<Boolean>(false);
      const userData = ref<any>(null);

      function send() {
        openModal4(true, {
          data: 'content',
          info: 'Info',
        });
      }
      function openModalLoading() {
        openModal1(true);
        // setModalProps({ loading: true });
        // setTimeout(() => {
        //   setModalProps({ loading: false });
        // }, 2000);
      }

      function openTargetModal(index) {
        switch (index) {
          case 1:
            currentModal.value = Modal1;
            break;
          case 2:
            currentModal.value = Modal2;
            break;
          case 3:
            currentModal.value = Modal3;
            break;
          default:
            currentModal.value = Modal4;
            break;
        }
        nextTick(() => {
          // `useModal` not working with dynamic component
          // passing data through `userData` prop
          userData.value = { data: Math.random(), info: 'Info222' };
          // open the target modal
          modalVisible.value = true;
        });
      }

      return {
        register1,
        openModal1,
        register2,
        openModal2,
        register3,
        openModal3,
        register4,
        openModal4,
        modalVisible,
        userData,
        openTargetModal,
        send,
        currentModal,
        openModalLoading,
      };
    },
  });
</script>
