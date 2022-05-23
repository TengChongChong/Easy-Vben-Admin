/**
 * Select Model
 */
export interface SelectModel {
  value: string | number;
  label: string;
}

/**
 * 中转select
 */
export interface TempSelectModel extends SelectModel {
  id?: string | number;
  parentId?: string | number;
}

/**
 * 级联选择
 */
export interface TreeSelectModel {
  value: string | number;
  label: string;
  children?: TreeSelectModel[];
}
