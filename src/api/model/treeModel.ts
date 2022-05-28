/**
 * TreeNode for ApiTreeSelect
 */
export interface TreeNode {
  id?: string;
  parentId?: string;
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
}

/**
 * TreeNode Model for Tree
 */
export interface TreeNodeModel {
  // id
  id: string;
  // 父id
  parentId?: string;
  // 标题
  title: string;
  // 节点的 class
  clazz?: string;
  // 节点的 style
  style?: string;
  // 当树为 checkable 时，设置独立节点是否展示 Checkbox
  checkable?: boolean;
  // 禁掉 checkbox
  disableCheckbox?: boolean;
  // 禁掉响应
  disabled?: boolean;
  // 自定义图标。可接收组件，props 为当前节点 props
  icon?: string;
  // 设置为叶子节点(设置了loadData时有效)
  isLeaf?: boolean;
  // 设置节点是否可被选中
  selectable?: string;
  // 子节点
  children?: TreeNodeModel[];
  [key: string]: any;
}
