<template>
  <PageWrapper>
    <a-row :gutter="[16, 16]">
      <a-col :xl="12" :lg="24">
        <a-card title="基础按钮" :bordered="false">
          <div class="my-2">
            <h3>primary</h3>
            <a-space>
              <a-button type="primary" preIcon="mdi:page-next-outline"> 主按钮 </a-button>
              <a-button type="primary" disabled> 禁用 </a-button>
              <a-button type="primary" danger preIcon="mdi:page-next-outline"> 危险 </a-button>
              <a-button type="primary" loading> loading </a-button>
              <a-button type="link"> link </a-button>
              <a-button type="link" loading> loading link </a-button>
              <a-button type="link" disabled> disabled link </a-button>
            </a-space>
          </div>

          <div class="my-2">
            <h3>default</h3>
            <a-space>
              <a-button type="default"> 默认 </a-button>
              <a-button type="default" disabled> 禁用 </a-button>
              <a-button type="default" danger> 危险 </a-button>
              <a-button type="default" loading> loading </a-button>
              <a-button type="link"> link </a-button>
              <a-button type="link" loading> loading link </a-button>
              <a-button type="link" disabled> disabled link </a-button>
            </a-space>
          </div>

          <div class="my-2">
            <h3>dashed</h3>
            <a-space>
              <a-button type="dashed"> dashed </a-button>
              <a-button type="dashed" disabled> 禁用 </a-button>
              <a-button type="dashed" danger> 危险 </a-button>
              <a-button type="dashed" loading> loading </a-button>
            </a-space>
          </div>

          <div class="my-2">
            <h3>ghost 常规幽灵按钮通常用于有色背景下</h3>
            <div class="bg-gray-400 py-2">
              <a-space>
                <a-button ghost type="primary"> 幽灵主要 </a-button>
                <a-button ghost type="default"> 幽灵默认 </a-button>
                <a-button ghost type="dashed"> 幽灵dashed </a-button>
                <a-button ghost type="primary" disabled> 禁用 </a-button>
                <a-button ghost type="primary" loading> loading </a-button>
              </a-space>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xl="12" :lg="24">
        <a-card title="常用按钮" :bordered="false" class="!mb-4">
          <a-space class="mb-4">
            <a-button-add />
            <a-button-add-sub />
            <a-button-remove />
            <a-button-remove-batch :id="['xxx']" />
            <a-button-edit />
            <a-button-save />
            <a-button-submit />
          </a-space>
          <a-space class="mb-4">
            <a-button-info />
            <a-button-import />
            <a-button-export />
            <a-button-cancel />
            <a-button-upload />
            <a-button-link text="链接" path="xxx" icon="ant-design:link-outlined" />
          </a-space>
          <h3>工作流</h3>
          <a-space class="mb-4">
            <a-button-progress execution-id="xxx" process-instance-id="xxx" />
            <a-button-revoke process-instance-id="xxx" :reason="true" />
            <a-button-start
              model-key="leave"
              business-key="xxx"
              business-title="xxx"
              business-details-path="xxx"
            />
          </a-space>
        </a-card>
        <a-card title="常用按钮 - 表格操作列" :bordered="false">
          <div class="mb-4">
            <a-button-add small />
            <a-divider type="vertical" />
            <a-button-add-sub small />
            <a-divider type="vertical" />
            <a-button-remove small />
            <a-divider type="vertical" />
            <a-button-edit small />
            <a-divider type="vertical" />
            <a-button-save small />
            <a-divider type="vertical" />
            <a-button-submit small />
          </div>
          <div class="mb-4">
            <a-button-info small />
            <a-divider type="vertical" />
            <a-button-import small />
            <a-divider type="vertical" />
            <a-button-export small />
            <a-divider type="vertical" />
            <a-button-cancel small />
            <a-divider type="vertical" />
            <a-button-upload small />
            <a-divider type="vertical" />
            <a-button-link small text="链接" path="xxx" icon="ant-design:link-outlined" />
          </div>
          <h3>工作流</h3>
          <div class="mb-4">
            <a-button-progress small execution-id="xxx" process-instance-id="xxx" />
            <a-divider type="vertical" />
            <a-button-revoke small process-instance-id="xxx" :reason="true" />
            <a-divider type="vertical" />
            <a-button-start
              small
              model-key="leave"
              business-key="xxx"
              business-title="xxx"
              business-details-path="xxx"
            />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    AButtonAdd,
    AButtonAddSub,
    AButtonCancel,
    AButtonEdit,
    AButtonExport,
    AButtonImport,
    AButtonInfo,
    AButtonLink,
    AButtonRemove,
    AButtonRemoveBatch,
    AButtonSave,
    AButtonSubmit,
    AButtonUpload,
    AButtonProgress,
    AButtonRevoke,
    AButtonStart,
  } from '/@/components/Button';
  export default defineComponent({
    components: {
      AButtonAdd,
      AButtonAddSub,
      AButtonCancel,
      AButtonEdit,
      AButtonExport,
      AButtonImport,
      AButtonInfo,
      AButtonLink,
      AButtonRemove,
      AButtonRemoveBatch,
      AButtonSave,
      AButtonSubmit,
      AButtonUpload,
      AButtonProgress,
      AButtonRevoke,
      AButtonStart,
      PageWrapper,
    },
  });
</script>
