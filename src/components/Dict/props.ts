import { propTypes } from '/@/utils/propTypes';

export const dictProps = {
  dictType: propTypes.string,
  value: propTypes.string,
  // 是否使用图标
  icon: propTypes.bool.def(false),
};
