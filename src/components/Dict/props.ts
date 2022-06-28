import { propTypes } from '/@/utils/propTypes';

export const dictProps = {
  dictType: propTypes.string,
  value: propTypes.oneOfType([propTypes.string, propTypes.array]),
  // 是否使用图标
  icon: propTypes.bool.def(false),
  onChange: propTypes.func,
};
