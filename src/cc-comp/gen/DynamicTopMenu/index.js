import React from 'react';
import { Drawer } from 'antd';
import CcTopMenu from './CcTopMenu';
// import { getFlatMenuKeys } from './SiderMenuUtils';

const CcTopMenuWrapper = React.memo(props => {
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
      <CcTopMenu {...props} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <CcTopMenu {...props} />
  );
});

export default CcTopMenuWrapper;
