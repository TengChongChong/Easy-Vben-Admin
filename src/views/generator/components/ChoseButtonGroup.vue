<template>
  <div class="chose-button-group">
    <template v-for="item in options" :key="item.value">
      <a-tooltip v-if="item.tips">
        <template #title>{{ item.tips }}</template>
        <div
          :class="[
            'chose-button-group-item',
            value === item.value ? 'chose-button-group-item-active' : '',
          ]"
          @click="handleChange(item.value)"
        >
          <span class="chose-button-group-item-name">{{ item.name }}</span>
          <span class="chose-button-group-item-label">{{ item.label }}</span>
        </div>
      </a-tooltip>
      <div
        v-else
        :class="[
          'chose-button-group-item',
          value === item.value ? 'chose-button-group-item-active' : '',
        ]"
        @click="handleChange(item.value)"
      >
        <span class="chose-button-group-item-name">{{ item.name }}</span>
        <span class="chose-button-group-item-label">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import { propTypes } from '/@/utils/propTypes';

  type OptionsItem = { name: string; label: string; value: string; tips?: string };

  export default defineComponent({
    name: 'ChoseButtonGroup',
    props: {
      value: propTypes.string,
      options: {
        type: Array as PropType<OptionsItem[]>,
        default: () => [],
      },
    },
    setup(props, { emit }) {
      const currentValue = ref();

      watch(
        () => props.value,
        () => {
          currentValue.value = props.value;
        },
      );

      onMounted(() => {
        currentValue.value = props.value;
      });

      function handleChange(value) {
        currentValue.value = value;
        emit('change', value);
        emit('update:value', value);
      }

      return { handleChange };
    },
  });
</script>

<style lang="less" scoped>
  .chose-button-group {
    display: flex;
    margin: 0 -10px;

    .chose-button-group-item {
      margin: 0 10px;
      padding: 12px 24px;
      text-align: center;
      //border: 1px solid rgba(0, 0, 0, 0.06);
      border: 1px solid #d9d9d9;
      border-radius: @border-radius-base;
      cursor: pointer;

      &.chose-button-group-item-active {
        color: @primary-color;
        border-color: @primary-color;

        .chose-button-group-item-name,
        .chose-button-group-item-label {
          color: @primary-color;
        }
      }

      .chose-button-group-item-name {
        display: block;
        font-weight: bold;
      }

      .chose-button-group-item-label {
        color: @text-color-secondary;
      }
    }
  }
</style>
