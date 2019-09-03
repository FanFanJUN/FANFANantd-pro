/**
 * @description form表单样式通用布局
 * @author LC@1981824361
 * @date 2019-05-22
 * @export
 * @param {*} columnLayout
 * @param {number} [columnIndex=0]
 * @param {*} columnExpand
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export
export function getFormItemLayout(columnLayout, columnIndex = 0, columnExpand) {
  if (columnLayout === 1) {
    const fotmItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
        md: { span: 12 },
      },
    };
    return fotmItemLayout;
  }
  if (columnLayout === 2) {
    const expand = columnExpand > 2 ? 2 : columnExpand;
    if (expand === 2) {
      const fotmItemLayout = {
        sm: 24,
        md: 24,
        lg: 24,
        xl: 22,
      };
      return fotmItemLayout;
    }
    const fotmItemLayout = {
      lsm: 24,
      md: 12,
      lg: 12,
      xl: 12,
    };
    return fotmItemLayout;
  }
  if (columnLayout === 3) {
    const expand = columnExpand > 3 ? 3 : columnExpand;
    if (expand === 3) {
      return {
        sm: 24,
        md: 24,
        lg: 24,
        xl: 22,
      };
    }
    if (expand === 2) {
      if (columnIndex === 0) {
        return {
          sm: 24,
          md: 16,
          lg: 16,
          xl: 14,
        };
      }
      return {
        sm: 24,
        md: 16,
        lg: 16,
        xl: { span: 14, offset: 2 },
      };
    }
    const fotmItemLayout = {
      sm: 24,
      md: 8,
      lg: 8,
    };
    return fotmItemLayout;
  }
  return null;
}
