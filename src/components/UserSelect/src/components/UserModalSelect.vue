<template>
  <div>
    <a-input-group compact style="width: 100%">
      <a-select
        :mode="multiple ? 'multiple' : ''"
        :allowClear="true"
        v-bind="$attrs"
        v-model:value="currentValue"
        placeholder="请点击选择按钮选择用户"
        @change="handleChange"
        style="width: calc(100% - 64px)"
      >
        <a-select-option
          v-for="item in options"
          :key="item.id"
          :value="item.id"
          :label="item.nickname"
        >
          {{ item.nickname }} - {{ item.deptName }}
        </a-select-option>

        <template #suffixIcon></template>
      </a-select>

      <a-button @click="handleOpenModal">选择</a-button>
    </a-input-group>

    <UserModal @register="register" @update="setSelect" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { propTypes } from '/@/utils/propTypes';
  import UserModal from './modal/UserModal.vue';
  import { selectUsersByIds } from '/@/api/auth/sysUser';
  import { SysUser } from '/@/api/auth/model/sysUserModel';

  export default defineComponent({
    name: 'UserModalSelect',
    components: {
      UserModal,
    },
    inheritAttrs: false,
    props: {
      value: [Array, String],
      // 是否为多选
      multiple: propTypes.bool.def(false),
      // 范围 'all' | 'currentDept'
      range: propTypes.oneOf(['all', 'currentDept']).def('all'),
      // 查询指定部门用户
      deptId: propTypes.string,
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const [register, { openModal }] = useModal();

      const options = ref<SysUser[]>([]);

      let lastFetchId = 0;

      let currentValue = ref();

      watch(
        () => props.value,
        () => {
          setSelect(props.value);
        },
      );

      const initSelectValue = (value) => {
        options.value = [];
        if (value) {
          lastFetchId += 1;
          const fetchId = lastFetchId;
          // @ts-ignore
          selectUsersByIds(value).then((res) => {
            if (fetchId !== lastFetchId) {
              return;
            }
            options.value = res;
          });
        }
      };

      onMounted(() => {
        if (props.value) {
          setSelect(props.value);
        }
      });

      function handleOpenModal() {
        openModal(true, {
          multiple: props.multiple,
          selectKeys: currentValue.value,
        });
      }

      function setSelect(value) {
        initSelectValue(value);
        handleChange(value);
      }

      function handleChange(value) {
        currentValue.value = value;
        emit('change', value);
        emit('update:value', value);
      }

      return {
        options,
        currentValue,
        register,
        handleOpenModal,
        setSelect,
        handleChange,
      };
    },
  });
</script>
