import React from 'react';
import { Row, Col } from 'antd';
import { isEmptyArray } from '@/utils/utils';
import DynamicMenu from '@/cc-comp/gen/DynamicMenu';
import Authorized from '../utils/Authorized';

class ThirdMenuLayout extends React.PureComponent {
  render() {
    const { children, thirdMenuData } = this.props;
    let thirdMenuDom;
    if (!isEmptyArray(thirdMenuData) && !thirdMenuData.hideInMenu) {
      thirdMenuDom = (
        <Row gutter={32}>
          <Col lg={5}><DynamicMenu menusData={thirdMenuData} Authorized={Authorized} /></Col>
          <Col lg={19}>{children}</Col>
        </Row>
      );
    } else {
      thirdMenuDom = (
        <Row gutter={32}>
          <Col lg={24}>{children}</Col>
        </Row>
      );
    }
    return thirdMenuDom;
  }
}

export default ThirdMenuLayout;
