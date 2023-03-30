<template>
  <div class="generator-form">
    <a-card style="margin-bottom: 1rem">
      <template #title> 表单 </template>
      <template #extra>
        <a-button type="primary" size="small" @click="openInputConfigModal">
          <template #icon>
            <Icon icon="ant-design:setting-outlined" />
          </template>
          字段设置
        </a-button>
      </template>
      <div class="config-items config-input config-items-input">
        <template :key="item.name" v-for="item in inputConfig">
          <div class="config-item" v-show="item.isEnable">
            <div class="config-item-body">
              <div class="config-item-body-label">
                <a-popover>
                  <template #content>
                    <div>列名：{{ item.name }}</div>
                    <div>
                      类型：{{ item.metaInfo.jdbcType?.toLowerCase() }}
                      {{ item.metaInfo.length ? `(${item.metaInfo.length})` : '' }}
                    </div>
                    <div>属性：{{ item.propertyName }}</div>
                    <div>注释：{{ item.comment ? item.comment : '-' }}</div>
                  </template>
                  <label>
                    <a-typography-text type="danger" v-if="item.required">*</a-typography-text>
                    {{ item.label }}
                  </label>
                </a-popover>
              </div>
              <div class="config-item-body-control">
                <span class="component-type">
                  {{ item.componentType }} {{ item.dictType ? ` / ${item.dictType}` : '' }}
                </span>

                <div class="config-item-body-control-tool">
                  <a-tooltip>
                    <template #title>移除</template>
                    <a-button
                      shape="circle"
                      danger
                      size="small"
                      @click="disableInputConfig(item.propertyName)"
                    >
                      <template #icon>
                        <Icon icon="ant-design:close-outlined" />
                      </template>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </a-card>

    <div class="footer-button">
      <a-button @click="handleStepPrev">
        <template #icon>
          <Icon icon="ant-design:left-outlined" />
        </template>
        上一步
      </a-button>
      <a-button type="primary" @click="handleStepNext">
        <template #icon>
          <Icon icon="ant-design:right-outlined" />
        </template>
        下一步
      </a-button>
    </div>

    <InputConfigModal @update-config="updateInputConfig" @register="registerInputConfig" />
    <a-divider />
    <h3>说明</h3>
    <p> 1、点击"字段设置"按钮配置字段；2、拖动"虚线框"进行排序 </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { FieldConfig, GeneratorConfig } from '/@/views/generator/ts/generator.data';
  import { useModal } from '/@/components/Modal';
  import InputConfigModal from '/@/views/generator/modal/InputConfigModal.vue';
  import Sortable from 'sortablejs';
  import { isNullAndUnDef } from '/@/utils/is';

  export default defineComponent({
    components: { InputConfigModal, Icon },
    props: {
      generatorConfig: {
        type: Object as PropType<GeneratorConfig>,
      },
    },
    emits: ['next', 'prev', 'update-config'],
    setup(props, { emit }) {
      const [registerInputConfig, { openModal: showInputConfigModal }] = useModal();

      const inputConfig = ref<FieldConfig[]>([]);

      onMounted(() => {
        initData();
        Sortable.create(document.querySelectorAll('.config-items-input')?.[0] as HTMLElement, {
          animation: 200,
          delay: 400,
          delayOnTouchOnly: true,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            const currentTab = inputConfig.value[oldIndex];
            inputConfig.value.splice(oldIndex, 1);
            inputConfig.value.splice(newIndex, 0, currentTab);
          },
        });
      });

      watch(
        () => props.generatorConfig,
        () => {
          initData();
        },
        { deep: true },
      );

      function initData() {
        inputConfig.value = props.generatorConfig?.inputConfig || [];
      }

      /**
       * 打开配置表单模态框
       */
      function openInputConfigModal() {
        showInputConfigModal(true, {
          tableInfo: props.generatorConfig?.tableInfo,
          config: inputConfig,
        });
      }

      /**
       * 更新表单配置
       *
       * @param config config
       */
      function updateInputConfig(config) {
        inputConfig.value = config;
      }

      function disableInputConfig(propertyName: string) {
        inputConfig.value.map((item) => {
          if (item.propertyName === propertyName) {
            item.isEnable = false;
          }
        });
      }

      function handleStepPrev() {
        emit('prev');
      }

      function handleStepNext() {
        emit('update-config', 'inputConfig', unref(inputConfig));
        emit('next');
      }

      return {
        inputConfig,
        updateInputConfig,
        registerInputConfig,
        openInputConfigModal,
        disableInputConfig,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>

<style scoped></style>
