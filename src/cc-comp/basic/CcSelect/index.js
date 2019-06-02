import React from 'react';
import { Select } from 'antd';

/**
 * @description 基于原生Select
 * @author LC@1981824361
 * @date 2019-06-01
 * @class CcSelect
 * @extends {Select}
 */
class CcSelect extends Select {
  render() {
    const { ...rest } = this.props;
    return (
      <Select allowClear {...rest} />
    );
  }
}

export default CcSelect;
