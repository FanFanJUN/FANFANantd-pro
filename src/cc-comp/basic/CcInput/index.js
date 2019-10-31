import React from 'react';
import { Input } from 'antd';

/**
 * @description 基于原生Input||autoComplete自动完成的禁用与否，避免出现输入记录
 * @author LC@1981824361
 * @date 2019-05-27
 * @class CcInput
 * @extends {Input}
 */
class CcInput extends Input {
  render() {
    const { autoComplete, value, ...rest } = this.props;
    return (
      <Input autoComplete={autoComplete || 'off'} {...rest} title={value} value={value} />
    );
  }
}

export default CcInput;
