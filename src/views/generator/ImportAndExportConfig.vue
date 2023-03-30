<template>
  <div class="generator-form">
    <a-card v-show="generatorImport" style="margin-bottom: 1rem">
      <template #title>
        导入
        <small>
          <a-typography-text type="danger"> 注：含圆点的表示元素包含"字典" </a-typography-text>
        </small>
      </template>
      <template #extra>
        <a-button type="primary" size="small" @click="openImportConfigModal">
          <template #icon>
            <Icon icon="ant-design:setting-outlined" />
          </template>
          字段设置
        </a-button>
      </template>
      <div class="config-table config-items config-items-import">
        <template :key="item.name" v-for="item in importConfig">
          <div class="config-item" v-show="item.isEnable" :style="{ minWidth: `${item.width}px` }">
            <div class="config-item-body">
              <div class="config-item-body-control">
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
                  <span class="component-type">
                    <a-typography-text type="danger" v-if="item.required">*</a-typography-text>
                    {{ item.title }}
                  </span>

                  <div class="config-item-body-control-mark">
                    <a-tooltip v-if="item.dictType">
                      <template #title>字典</template>
                      <span class="control-mark control-mark-format"></span>
                    </a-tooltip>
                  </div>

                  <div class="config-item-body-control-tool">
                    <a-tooltip>
                      <template #title>移除</template>
                      <a-button
                        shape="circle"
                        danger
                        size="small"
                        @click="disableImportConfig(item.propertyName)"
                      >
                        <template #icon>
                          <Icon icon="ant-design:close-outlined" />
                        </template>
                      </a-button>
                    </a-tooltip>
                  </div>
                </a-popover>
              </div>
            </div>
          </div>
        </template>
      </div>
    </a-card>

    <a-card v-show="generatorExport">
      <template #title>
        导出
        <small>
          <a-typography-text type="danger"> 注：含圆点的表示元素包含"字典" </a-typography-text>
        </small>
      </template>
      <template #extra>
        <a-button type="primary" size="small" @click="openExportConfigModal">
          <template #icon>
            <Icon icon="ant-design:setting-outlined" />
          </template>
          字段设置
        </a-button>
      </template>
      <div class="config-table config-items config-items-export">
        <template :key="item.name" v-for="item in exportConfig">
          <div class="config-item" v-show="item.isEnable" :style="{ minWidth: `${item.width}px` }">
            <div class="config-item-body">
              <div class="config-item-body-control">
                <a-popover>
                  <template #content>
                    <div>列名：{{ item.name }}</div>
                    <div>
                      类型：{{ item.metaInfo.jdbcType?.toLowerCase() }}
                      {{ item.metaInfo.length ? `(${item.metaInfo.length})` : '' }}
                    </div>
                    <div>属性：{{ item.propertyName }}</div>
                    <div>注释：{{ item.comment ? item.comment : '-' }}</div>
                    <div>宽度：{{ item.width ? item.width : '-' }}</div>
                  </template>
                  <span>{{ item.title }}</span>
                </a-popover>

                <div class="config-item-body-control-mark">
                  <a-tooltip v-if="item.dictType">
                    <template #title>字典</template>
                    <span class="control-mark control-mark-format"></span>
                  </a-tooltip>
                </div>

                <div class="config-item-body-control-tool">
                  <a-tooltip>
                    <template #title>移除</template>
                    <a-button
                      shape="circle"
                      danger
                      size="small"
                      @click="disableExportConfig(item.propertyName)"
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

    <ImportConfigModal @update-config="updateImportConfig" @register="registerImportConfig" />
    <ExportConfigModal @update-config="updateExportConfig" @register="registerExportConfig" />
    <a-divider />
    <h3>说明</h3>
    <p> 1、点击"字段设置"按钮配置字段；2、拖动"虚线框"进行排序 </p>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, unref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import {
    ImportCellConfig,
    GeneratorConfig,
    TableCellConfig,
    BasicsConfigModel,
  } from '/@/views/generator/ts/generator.data';
  import { useModal } from '/@/components/Modal';
  import ImportConfigModal from '/@/views/generator/modal/ImportConfigModal.vue';
  import ExportConfigModal from '/@/views/generator/modal/ExportConfigModal.vue';
  import Sortable from 'sortablejs';
  import { isNullAndUnDef } from '/@/utils/is';
  import { needGeneratorExport, needGeneratorImport } from '/@/views/generator/ts/util';

  export default defineComponent({
    components: { ImportConfigModal, ExportConfigModal, Icon },
    props: {
      generatorConfig: {
        type: Object as PropType<GeneratorConfig>,
      },
    },
    emits: ['next', 'prev', 'update-config'],
    setup(props, { emit }) {
      const [registerImportConfig, { openModal: showImportConfigModal }] = useModal();
      const [registerExportConfig, { openModal: showExportConfigModal }] = useModal();

      const importConfig = ref<ImportCellConfig[]>([]);
      const exportConfig = ref<TableCellConfig[]>([]);

      onMounted(() => {
        initData();
        Sortable.create(document.querySelectorAll('.config-items-import')?.[0] as HTMLElement, {
          animation: 200,
          delay: 400,
          delayOnTouchOnly: true,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            const currentTab = importConfig.value[oldIndex];
            importConfig.value.splice(oldIndex, 1);
            importConfig.value.splice(newIndex, 0, currentTab);
          },
        });
        Sortable.create(document.querySelectorAll('.config-items-export')?.[0] as HTMLElement, {
          animation: 200,
          delay: 400,
          delayOnTouchOnly: true,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            const currentTab = exportConfig.value[oldIndex];
            exportConfig.value.splice(oldIndex, 1);
            exportConfig.value.splice(newIndex, 0, currentTab);
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
        importConfig.value = props.generatorConfig?.importConfig || [];
        exportConfig.value = props.generatorConfig?.exportConfig || [];
      }

      /**
       * 打开配置查询条件模态框
       */
      function openImportConfigModal() {
        showImportConfigModal(true, {
          tableInfo: props.generatorConfig?.tableInfo,
          config: importConfig,
        });
      }

      /**
       * 打开配置导出模态框
       */
      function openExportConfigModal() {
        showExportConfigModal(true, {
          tableInfo: props.generatorConfig?.tableInfo,
          config: exportConfig,
        });
      }

      function isQuery(propertyName) {
        for (let i = 0; i < importConfig.value.length; i++) {
          if (
            importConfig.value[i].propertyName === propertyName &&
            importConfig.value[i].isEnable
          ) {
            return true;
          }
        }
        return false;
      }

      /**
       * 更新查询条件配置
       *
       * @param config config
       */
      function updateImportConfig(config) {
        importConfig.value = config;
      }

      /**
       * 更新导出配置
       *
       * @param config config
       */
      function updateExportConfig(config) {
        exportConfig.value = config;
      }

      function disableImportConfig(propertyName: string) {
        importConfig.value.map((item) => {
          if (item.propertyName === propertyName) {
            item.isEnable = false;
          }
        });
      }

      function disableExportConfig(propertyName: string) {
        exportConfig.value.map((item) => {
          if (item.propertyName === propertyName) {
            item.isEnable = false;
          }
        });
      }

      const generatorImport = computed(() => {
        return needGeneratorImport(props.generatorConfig?.basicsConfig as BasicsConfigModel);
      });
      const generatorExport = computed(() => {
        return needGeneratorExport(props.generatorConfig?.basicsConfig as BasicsConfigModel);
      });

      function handleStepPrev() {
        emit('prev');
      }

      function handleStepNext() {
        emit('update-config', 'importConfig', unref(importConfig));
        emit('update-config', 'exportConfig', unref(exportConfig));
        emit('next');
      }

      return {
        importConfig,
        exportConfig,
        generatorImport,
        generatorExport,
        isQuery,
        updateImportConfig,
        registerImportConfig,
        openImportConfigModal,
        updateExportConfig,
        registerExportConfig,
        openExportConfigModal,
        disableImportConfig,
        disableExportConfig,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>

<style scoped></style>
