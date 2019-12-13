/* eslint-disable react/jsx-no-target-blank */
import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      // links={[
      //   {
      //     key: 'Pro 首页',
      //     title: 'Pro 首页',
      //     href: 'https://pro.ant.design',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'github',
      //     title: <Icon type="github" />,
      //     href: 'https://github.com/ant-design/ant-design-pro',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'Ant Design',
      //     title: 'Ant Design',
      //     href: 'https://ant.design',
      //     blankTarget: true,
      //   },
      // ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> {new Date().getFullYear()}&nbsp;
          <a target="_blank" href="https://github.com/FanFanJUN"><Icon type="github" />FanFanJUN</a>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
