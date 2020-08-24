import React from 'react';
import { Layout, Spin } from 'antd';
import PropTypes from 'prop-types';

const { Header, Content } = Layout;
/**
 * 
 * @param {详情、新增编辑页面固定表头} props 
 */
const PageHeader = props => {
  const { children } = props;
  const { floating } = props;
  return (
    <Layout>
      <Spin spinning={props.loading === true}>
        <Header className="layout-header" style={{ position: floating ? 'fixed' : 'absolute' }}>
          <div className="header-span">
            {props.title}
          </div>
          <div>
            {props.extra}
          </div>
        </Header>
        <Content className="content-wrapper">
          {React.Children.map(children, (child, i) => {
            return child;
          })}
        </Content>
      </Spin>
    </Layout>
  );
};
PageHeader.propTypes = {
  // 是否跟随滚动条滚动
  floating: PropTypes.bool,
  // 标题头，居左
  title: PropTypes.any,
  // 标题扩展，居右
  extra: PropTypes.node,
  // 是否显示头，主要用作流程表单时不显示头
  showHeader: PropTypes.bool,
};

PageHeader.defaultProps = {
  floating: false,
};

export default PageHeader;
