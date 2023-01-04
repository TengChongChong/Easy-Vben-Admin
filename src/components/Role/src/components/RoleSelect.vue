<template>
  <a-select
    show-search
    option-filter-prop="label"
    v-model:value="state"
    v-bind="$attrs"
    :mode="multiple ? 'multiple' : null"
    @change="handleChange"
    style="width: 100%"
  >
    <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { selectAll, selectRoleByDept } from '/@/api/auth/sysRole';
  import { SysRole } from '/@/api/auth/model/sysRoleModel';
  import { propTypes } from '/@/utils/propTypes';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'RoleSelect',
    props: {
      value: [Array, String],
      // 类型 all | current | deptId
      type: propTypes.string.def('all'),
      // 部门id type = deptId 时必须
      deptId: propTypes.string,
      // 是否为多选
      multiple: propTypes.bool.def(false),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const roleList = ref<SysRole[]>([]);
      const emitData = ref<any[]>([]);

      const userStore = useUserStore();

      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      watch([() => props.type, () => props.deptId], () => loadOptions());

      function loadOptions() {
        if (props.type === 'all') {
          selectAll().then((res) => {
            roleList.value = res;
          });
        } else if (props.type === 'current') {
          selectRoleByDept(userStore.getCurrentUser.deptId!).then((res) => {
            roleList.value = res;
          });
        } else {
          selectRoleByDept(props.deptId).then((res) => {
            roleList.value = res;
          });
        }
      }

      loadOptions();

      function handleChange(value, ...args) {
        emitData.value = args;
        emit('change', value);
        emit('update:value', value);
      }

      return { state, roleList, handleChange };
    },
  });
</script>
