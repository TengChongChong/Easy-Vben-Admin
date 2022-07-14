<template>
  <BasicModal v-bind="$attrs" @register="register" @ok="handleSave" title="字段排序">
    <a-alert type="info" message="拖动改变字段顺序" banner />

    <div class="order-fields">
      <div
        class="order-field"
        :key="item.fieldName"
        v-for="item in sysImportExcelTemplateDetailList"
      >
        <div>
          {{ item.fieldName }}
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import Sortable from 'sortablejs';
  import { SysImportExcelTemplateDetail } from '/@/api/sys/model/sysImportExcelTemplateDetailModel';
  import { isNullAndUnDef } from '/@/utils/is';
  export default defineComponent({
    components: { BasicModal },
    emits: ['register', 'success'],
    setup(_, { emit }) {
      const sysImportExcelTemplateDetailList = ref<SysImportExcelTemplateDetail[]>([]);

      const [register, { closeModal }] = useModalInner((data) => {
        sysImportExcelTemplateDetailList.value = data;

        Sortable.create(document.querySelectorAll('.order-fields')?.[0] as HTMLElement, {
          animation: 500,
          delay: 400,
          delayOnTouchOnly: true,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            const currentTab = sysImportExcelTemplateDetailList.value[oldIndex];
            sysImportExcelTemplateDetailList.value.splice(oldIndex, 1);
            sysImportExcelTemplateDetailList.value.splice(newIndex, 0, currentTab);
          },
        });
      });

      function handleSave() {
        emit('success', unref(sysImportExcelTemplateDetailList));
        closeModal();
      }

      return {
        sysImportExcelTemplateDetailList,
        register,
        closeModal,
        handleSave,
      };
    },
  });
</script>
<style lang="less">
  .order-fields {
    position: relative;
    margin: 0 -0.5rem;

    .order-field {
      display: inline-block;
      padding: 0.5rem;

      > div {
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 2px;
        background-color: #fff;
        border: 1px dashed @primary-color;
      }
    }
  }
</style>
