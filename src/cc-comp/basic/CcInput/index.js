import React from 'react';
import { Input } from 'antd';

class CcInput extends Input {
  render() {
    const { autoComplete, ...rest } = this.props;
    return (
      <Input autoComplete={autoComplete || 'off'} {...rest} /> // autoComplete自动完成的禁用与否
    );
  }
}

export default CcInput;
