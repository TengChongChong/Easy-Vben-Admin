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
  import { defineComponent, ref } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { selectAll } from '/@/api/auth/sysRole';
  import { SysRole } from '/@/api/auth/model/sysRoleModel';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'RoleSelect',
    props: {
      value: [Array, String],
      // 是否为多选
      multiple: propTypes.bool.def(false),
    },
    emits: ['change', 'update:value'],
    setup(props, { emit }) {
      const roleList = ref<SysRole[]>([]);
      const emitData = ref<any[]>([]);

      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      function loadOptions() {
        selectAll().then((res) => {
          roleList.value = res;
        });
      }

      loadOptions();

      function handleChange(value, ...args) {
        emitData.value = args;
        emit('update:value', value);
      }

      return { state, roleList, handleChange };
    },
  });
</script>
