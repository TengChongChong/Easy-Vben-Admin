<template>
  <PageWrapper>
    <a-card title="右键菜单示例 - Simple" :bordered="false" class="!mb-4">
      <a-button type="primary" @contextmenu="handleContext"> Right Click on me </a-button>
    </a-card>

    <a-card title="右键菜单示例 - Multiple" :bordered="false" class="!mb-4">
      <a-button type="primary" @contextmenu="handleMultipleContext"> Right Click on me </a-button>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SampleFeatContextMenuIndex',
    components: { PageWrapper },
    setup() {
      const [createContextMenu] = useContextMenu();
      const { createMessage } = useMessage();
      function handleContext(e: MouseEvent) {
        createContextMenu({
          event: e,
          items: [
            {
              label: 'New',
              icon: 'bi:plus',
              handler: () => {
                createMessage.success('click new');
              },
            },
            {
              label: 'Open',
              icon: 'bx:bxs-folder-open',
              handler: () => {
                createMessage.success('click open');
              },
            },
          ],
        });
      }

      function handleMultipleContext(e: MouseEvent) {
        createContextMenu({
          event: e,
          items: [
            {
              label: 'New',
              icon: 'bi:plus',

              children: [
                {
                  label: 'New1-1',
                  icon: 'bi:plus',
                  divider: true,
                  children: [
                    {
                      label: 'New1-1-1',
                      handler: () => {
                        createMessage.success('click new');
                      },
                    },
                    {
                      label: 'New1-2-1',
                      disabled: true,
                    },
                  ],
                },
                {
                  label: 'New1-2',
                  icon: 'bi:plus',
                },
              ],
            },
          ],
        });
      }

      return { handleContext, handleMultipleContext };
    },
  });
</script>
