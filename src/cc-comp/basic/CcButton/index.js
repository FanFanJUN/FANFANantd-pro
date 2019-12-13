import React from 'react';
import { Button } from 'antd';
import { getSessionStorage } from '@/utils/storage';


/**
 * @description 基于原生Button 包括按钮权限
 * @author LC@1981824361
 * @date 2019-12-13
 * @class CcButton
 * @param resourcePath 当前按钮所在菜单路由path 按钮权限必传
 * @param resourceNo 当前按钮在菜单路由的的唯一资源编号 按钮权限必传
 * @extends {Button}
 */
class CcButton extends Button {
  render() {
    const { resourceNo, resourcePath, ...rest } = this.props;
    // 当前菜单路由地址下资源编号包含此资源ID 不予显示
    if (resourceNo && resourcePath && getSessionStorage(`${resourcePath}`)
     && getSessionStorage(`${resourcePath}`).includes(`${resourceNo}`)) {
      return null;
    }
    return (
      <Button {...rest} />
    );
  }
}

export default CcButton;
