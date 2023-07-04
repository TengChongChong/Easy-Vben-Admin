<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="部门类型排序"
    width="30%"
    @ok="handleSubmit"
  >
    <a-alert type="info" message="拖动节点更改部门类型顺序或结构" banner />
    <a-alert type="error" message="更改结构需手动处理相关部门数据，请谨慎操作！！！" banner />

    <a-tree class="draggable-tree" draggable block-node :tree-data="treeData" @drop="onDrop" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { saveOrder, selectAll } from '/@/api/auth/sysDeptType';
  import { listToTree, treeToList } from '/@/utils/helper/treeHelper';
  import { message, TreeProps } from 'ant-design-vue';
  import { AntTreeNodeDropEvent, TreeDataItem } from 'ant-design-vue/lib/tree';
  import { SysDeptType } from '/@/api/auth/model/sysDeptTypeModel';

  export default defineComponent({
    name: 'AuthDeptTypeOrder',
    components: { BasicDrawer },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const treeData = ref<TreeProps['treeData']>([]);
      const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(async () => {
        changeLoading(true);
        await selectAll().then((res) => {
          treeData.value = listToTree(res);
          changeLoading(false);
        });
      });

      function setProps(treeNodes: TreeProps['treeData'], parentId: string | undefined) {
        if (treeNodes) {
          let index = 1;
          treeNodes.map((item) => {
            item.orderNo = index;
            item.parentId = parentId;
            if (item.children && item.children.length) {
              setProps(item.children, item.id);
            }
            index++;
          });
        }
      }

      async function handleSubmit() {
        changeLoading(true);
        setProps(treeData.value, undefined);

        const params: SysDeptType[] = [];
        treeToList(treeData.value).map((item) => {
          const { id, parentId, orderNo } = item;
          params.push({
            id,
            parentId,
            orderNo,
          });
        });

        await saveOrder(params)
          .then(() => {
            message.success('保存成功');
            closeDrawer();
            emit('success');
          })
          .finally(() => {
            changeLoading(false);
          });
      }

      const onDrop = (info: AntTreeNodeDropEvent) => {
        console.log(info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        // @ts-ignore
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const loop = (data: TreeProps['treeData'], key: string | number, callback: any) => {
          // @ts-ignore
          data.forEach((item, index) => {
            if (item.key === key) {
              return callback(item, index, data);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };
        // @ts-ignore
        const data = [...treeData.value];

        // Find dragObject
        let dragObj: TreeDataItem;
        loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
          // @ts-ignore
          arr.splice(index, 1);
          dragObj = item;
        });
        if (!info.dropToGap) {
          // Drop on the content
          loop(data, dropKey, (item: TreeDataItem) => {
            item.children = item.children || [];
            /// where to insert 示例添加到头部，可以是随意位置
            item.children.unshift(dragObj);
          });
        } else if (
          (info.node.children || []).length > 0 && // Has children
          info.node.expanded && // Is expanded
          dropPosition === 1 // On the bottom gap
        ) {
          loop(data, dropKey, (item: TreeDataItem) => {
            item.children = item.children || [];
            // where to insert 示例添加到头部，可以是随意位置
            item.children.unshift(dragObj);
          });
        } else {
          let ar: TreeProps['treeData'] = [];
          let i = 0;
          loop(data, dropKey, (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
            ar = arr;
            i = index;
          });
          if (dropPosition === -1) {
            // @ts-ignore
            ar.splice(i, 0, dragObj);
          } else {
            // @ts-ignore
            ar.splice(i + 1, 0, dragObj);
          }
        }
        treeData.value = data;
      };

      return { registerDrawer, handleSubmit, treeData, onDrop };
    },
  });
</script>
