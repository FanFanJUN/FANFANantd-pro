import React from 'react';
import { Row, Col } from 'antd';

class ThirdMenuLayout extends React.PureComponent {
  render() {
    const { children, thirdMenuData } = this.props;
    let thirdMenuDom;
    if (thirdMenuData === '1') {
      thirdMenuDom = (
        <Row gutter={32}>
          <Col lg={5}>三级菜单</Col>
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
