<template>
  <BasicModal v-bind="$attrs" @register="register" title="缓存详情" :width="modalWidth">
    <div class="pt-3px pr-3px">
      <Description @register="registerDescItem" />
    </div>
    <template #footer>
      <a-button-cancel text="关闭" @click="closeModal" />

      <Authority value="sys:redis:remove">
        <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handleRemove">
          <a-button type="danger" :loading="loading">
            <template #icon>
              <Icon icon="ant-design:delete-outlined" />
            </template>
            删除
          </a-button>
        </a-popconfirm>
      </Authority>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem, useDescription } from '/@/components/Description';
  import { Authority } from '/@/components/Authority';
  import { JsonPreview } from '/@/components/CodeEditor';
  import { isObject } from '/@/utils/is';
  import Icon from '/@/components/Icon';
  import { remove } from '/@/api/sys/sysRedis';
  import { AButtonCancel } from '/@/components/Button';

  const schemas: DescItem[] = [
    {
      field: 'key',
      label: 'Key',
      labelMinWidth: 100,
    },
    {
      field: 'expire',
      label: '有效期',
    },
    {
      field: 'value',
      label: 'Value',
      render: (val) => {
        if (isObject(val)) {
          return h(JsonPreview, { data: val });
        } else {
          return val;
        }
      },
    },
  ];
  export default defineComponent({
    components: { AButtonCancel, Icon, BasicModal, Description, Authority },
    props: {
      userData: { type: Object },
    },
    emits: ['register', 'success'],
    setup(_, { emit }) {
      const modalWidth = ref<number>(520);
      const loading = ref(false);
      let key: string;
      const [registerDescItem, { setDescProps }] = useDescription({
        column: 1,
        schema: schemas,
      });

      const [register, { closeModal }] = useModalInner(async (data) => {
        if (isObject(data.value)) {
          modalWidth.value = 1080;
        }
        key = data.key;
        await setDescProps({ data });
      });

      const handleRemove = async () => {
        loading.value = true;
        try {
          await remove(key);
          emit('success');
          closeModal();
        } catch (e) {
        } finally {
          loading.value = false;
        }
      };

      return { register, schemas, registerDescItem, loading, modalWidth, handleRemove, closeModal };
    },
  });
</script>
