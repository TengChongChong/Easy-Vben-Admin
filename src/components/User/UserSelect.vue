<template>
  <Select
    show-search
    option-filter-prop="label"
    :mode="mode"
    :filter-option="false"
    v-bind="$attrs"
    placeholder="输入用户名、昵称或部门名称搜索"
    @search="fetchUser"
    @change="handleChange"
    v-model:value="state"
  >
    <a-select-option v-for="item in options" :key="item.id" :value="item.id" :label="item.nickname">
      {{ item.nickname }} - {{ item.deptName }}
    </a-select-option>

    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { debounce } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';
  import { search, selectUsersByIds } from '/@/api/auth/sysUser';
  import { SysUser } from '/@/api/auth/model/sysUserModel';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    name: 'UserSelect',
    components: {
      Select,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      value: [Array, String],
      // 是否多选
      mode: propTypes.string,
      // 范围 'all' | 'currentDept'
      range: propTypes.oneOf(['all', 'currentDept']).def('all'),
      // 查询指定部门用户
      deptId: propTypes.string,
    },
    emits: ['change', 'update:value'],
    setup(props) {
      const globSetting = useGlobSetting();
      const apiUrl = ref(globSetting.apiUrl);

      const options = ref<SysUser[]>([]);
      const loading = ref<boolean>(false);
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const { t } = useI18n();

      let lastFetchId = 0;

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      watch(
        () => props.value,
        () => {
          if (props.value) {
            lastFetchId += 1;
            const fetchId = lastFetchId;
            options.value = [];
            loading.value = true;
            // @ts-ignore
            selectUsersByIds(props.value).then((res) => {
              if (fetchId !== lastFetchId) {
                return;
              }
              options.value = res;
              loading.value = false;
            });
          }
        },
      );

      const fetchUser = debounce((value) => {
        lastFetchId += 1;
        const fetchId = lastFetchId;
        options.value = [];
        loading.value = true;
        if (value == null || value === '') {
          return;
        }
        search(value, props.range, props.deptId, { current: 1, pageSize: 20 }).then((res) => {
          if (fetchId !== lastFetchId) {
            return;
          }

          options.value = res.records as SysUser[];
          loading.value = false;
        });
      }, 300);

      function handleChange(_, ...args) {
        emitData.value = args;
      }

      return {
        apiUrl,
        state,
        attrs,
        options,
        loading,
        t,
        fetchUser,
        handleChange,
      };
    },
  });
</script>
