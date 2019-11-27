import React from 'react';
import { Drawer } from 'antd';
import DynamicMenu from './DynamicMenu';
// import { getFlatMenuKeys } from './SiderMenuUtils';

const DynamicMenuWrapper = React.memo(props => {
  const { isMobile, collapsed, onCollapse } = props;
  // const flatMenuKeys = getFlatMenuKeys(menuData);
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <DynamicMenu {...props} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <DynamicMenu {...props} />
  );
});

export default DynamicMenuWrapper;
