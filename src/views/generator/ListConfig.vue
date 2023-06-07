<template>
  <div class="generator-form">
    <a-card style="margin-bottom: 1rem">
      <template #title>
        查询条件
        <small>
          <a-typography-text type="danger">
            注：字典查询统一放到表头中使用筛选，此处不显示
          </a-typography-text>
        </small>
      </template>
      <template #extra>
        <a-button type="primary" size="small" @click="openQueryConfigModal">
          <template #icon>
            <Icon icon="ant-design:setting-outlined" />
          </template>
          字段设置
        </a-button>
      </template>
      <div class="config-items config-items-query">
        <template :key="item.name" v-for="item in queryConfig">
          <div class="config-item" v-show="item.isEnable && !item.dictType">
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
                  <label>{{ item.label }}</label>
                </a-popover>
              </div>
              <div class="config-item-body-control">
                <span class="component-type">
                  {{ item.componentType }} {{ item.dictType ? ` / ${item.dictType}` : '' }}
                </span>
                <span class="component-other">
                  匹配：<dict-name dict-type="matchingMode" :value="item.matchingMode" />
                </span>

                <div class="config-item-body-control-tool">
                  <a-tooltip>
                    <template #title>移除</template>
                    <a-button
                      shape="circle"
                      danger
                      size="small"
                      @click="disableQueryConfig(item.propertyName)"
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

    <a-card>
      <template #title>
        表格
        <small>
          <a-typography-text type="danger">
            注：含圆点的表示元素包含"过滤器"或"格式化"
          </a-typography-text>
        </small>
      </template>
      <template #extra>
        <a-button type="primary" size="small" @click="openTableConfigModal">
          <template #icon>
            <Icon icon="ant-design:setting-outlined" />
          </template>
          字段设置
        </a-button>
      </template>
      <div class="config-table config-items config-items-table">
        <template :key="item.name" v-for="item in tableConfig">
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
                    <div>格式：{{ item.format ? item.format : '-' }}</div>
                    <div>排序：{{ item.sorter ? '支持' : '不支持' }}</div>
                    <div>宽度：{{ item.width ? item.width : '-' }}</div>
                  </template>
                  <span>{{ item.title }}</span>
                </a-popover>

                <div class="config-item-body-control-mark">
                  <a-tooltip v-if="item.filters && isQuery(item.propertyName)">
                    <template #title>含过滤器</template>
                    <span class="control-mark control-mark-filter"></span>
                  </a-tooltip>
                  <a-tooltip v-if="item.format">
                    <template #title>含格式化</template>
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
                      @click="disableTableConfig(item.propertyName)"
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

    <QueryConfigModal @update-config="updateQueryConfig" @register="registerQueryConfig" />
    <TableConfigModal @update-config="updateTableConfig" @register="registerTableConfig" />
    <a-divider />
    <h3>说明</h3>
    <p> 1、点击"字段设置"按钮配置字段；2、拖动"虚线框"进行排序 </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import {
    FieldConfig,
    GeneratorConfig,
    TableCellConfig,
  } from '/@/views/generator/ts/generator.data';
  import { useModal } from '/@/components/Modal';
  import QueryConfigModal from '/@/views/generator/modal/QueryConfigModal.vue';
  import TableConfigModal from '/@/views/generator/modal/TableConfigModal.vue';
  import { DictName } from '/@/components/Dict';
  import Sortable from 'sortablejs';
  import { isNullAndUnDef } from '/@/utils/is';

  export default defineComponent({
    components: { DictName, QueryConfigModal, TableConfigModal, Icon },
    props: {
      generatorConfig: {
        type: Object as PropType<GeneratorConfig>,
        a: [Array as PropType<string[]>, Array as PropType<number[]>, Array as PropType<Date[]>],
      },
    },
    emits: ['next', 'prev', 'update-config'],
    setup(props, { emit }) {
      const [registerQueryConfig, { openModal: showQueryConfigModal }] = useModal();
      const [registerTableConfig, { openModal: showTableConfigModal }] = useModal();

      const queryConfig = ref<FieldConfig[]>([]);
      const tableConfig = ref<TableCellConfig[]>([]);

      onMounted(() => {
        initData();
        Sortable.create(document.querySelectorAll('.config-items-query')?.[0] as HTMLElement, {
          animation: 200,
          delay: 400,
          delayOnTouchOnly: true,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            const currentTab = queryConfig.value[oldIndex];
            queryConfig.value.splice(oldIndex, 1);
            queryConfig.value.splice(newIndex, 0, currentTab);
          },
        });

        Sortable.create(document.querySelectorAll('.config-items-table')?.[0] as HTMLElement, {
          animation: 200,
          delay: 400,
          delayOnTouchOnly: true,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;

            if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
              return;
            }
            const currentTab = tableConfig.value[oldIndex];
            tableConfig.value.splice(oldIndex, 1);
            tableConfig.value.splice(newIndex, 0, currentTab);
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
        queryConfig.value = props.generatorConfig?.queryConfig || [];
        tableConfig.value = props.generatorConfig?.tableConfig || [];
      }

      /**
       * 打开配置查询条件模态框
       */
      function openQueryConfigModal() {
        showQueryConfigModal(true, {
          tableInfo: props.generatorConfig?.tableInfo,
          config: queryConfig,
        });
      }

      /**
       * 打开配置表格模态框
       */
      function openTableConfigModal() {
        showTableConfigModal(true, {
          tableInfo: props.generatorConfig?.tableInfo,
          config: tableConfig,
        });
      }

      function isQuery(propertyName) {
        for (let i = 0; i < queryConfig.value.length; i++) {
          if (queryConfig.value[i].propertyName === propertyName && queryConfig.value[i].isEnable) {
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
      function updateQueryConfig(config) {
        queryConfig.value = config;
      }

      /**
       * 更新表格配置
       *
       * @param config config
       */
      function updateTableConfig(config) {
        config.map((item) => {
          if (item.dictType) {
            item.filters = `dict|${item.dictType}`;
            item.format = `dict|${item.dictType}`;
          }
        });
        tableConfig.value = config;
      }

      function disableQueryConfig(propertyName: string) {
        queryConfig.value.map((item) => {
          if (item.propertyName === propertyName) {
            item.isEnable = false;
          }
        });
      }

      function disableTableConfig(propertyName: string) {
        tableConfig.value.map((item) => {
          if (item.propertyName === propertyName) {
            item.isEnable = false;
          }
        });
      }

      function handleStepPrev() {
        emit('prev');
      }

      function handleStepNext() {
        emit('update-config', 'queryConfig', unref(queryConfig));
        emit('update-config', 'tableConfig', unref(tableConfig));
        emit('next');
      }

      return {
        queryConfig,
        tableConfig,
        isQuery,
        updateQueryConfig,
        registerQueryConfig,
        openQueryConfigModal,
        updateTableConfig,
        registerTableConfig,
        openTableConfigModal,
        disableQueryConfig,
        disableTableConfig,
        handleStepPrev,
        handleStepNext,
      };
    },
  });
</script>

<style scoped></style>
