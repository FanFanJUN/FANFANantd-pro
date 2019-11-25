import React, { Suspense } from 'react';
import { Layout, BackTop } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/LOGO.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import CcTopMenu from '../cc-comp/gen/DynamicTopMenu';
import getPageTitle from '@/utils/getPageTitle';
import styles from './BasicLayout.less';
import SiderDemo from '@/components/SiderLayout';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getSessionStorage } from '@/utils/storage';
import Exception from '@/components/Exception';
import { CcGlobalHeader } from '@/cc-comp/pro';
import blStyles from './BasicLayout.css';
import { parseMenuData } from '@/utils/utils';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  constructor() {
    super();
    if (getSessionStorage('currentUser')) {
      this.getAllFirstMenu();
    } else {
      // eslint-disable-next-line no-useless-return
      return;
    }
    this.state = {
      rendering: true,
      isMobile: false,
      error: false,
      contentAreaMinHeight: 0,
      firstMenus: [],
    };
  }


  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority },
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    // 获取菜单数据
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, authority },
    });
    const rootDom = document.getElementById('root');
    const contentAreaMinHeight = rootDom.offsetHeight - 32 - 32 - 37 - 1 - 1;
    window.sessionStorage.setItem('contentMinHeight', contentAreaMinHeight);
    this.setState({
      contentAreaMinHeight,
    });
    // 时间函数
    this.countTimer();
  }

  componentWillReceiveProps(nextProps) {
    if (!getSessionStorage('currentUser')) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.history.replace('/user/login');
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (nextProps.location.pathname !== this.props.location.pathname && this.state.error) {
      this.setState({
        error: false,
      });
    }
  }

 getAllFirstMenu=() => {
   const firstMenuArr = parseMenuData(JSON.parse(getSessionStorage('000000')), '000000');
   console.log(firstMenuArr);
   this.setState({ firstMenus: firstMenuArr });
 }

 getContext() {
   const { location, breadcrumbNameMap } = this.props;
   return {
     location,
     breadcrumbNameMap,
   };
 }

 getContentType() {
   const { fixedHeader } = this.props;
   const { contentAreaMinHeight } = this.state;
   return {
     height: contentAreaMinHeight,
     // margin: '0px 24px 0px',
     paddingTop: fixedHeader ? 64 : 0,
     overflowY: 'auto',
     overflowX: 'hidden',
     background: '#FFFFFF',
   };
 }
  countTimer = () => {
    if (document.getElementById('clock')) {
      const currTime = new Date()
        .toLocaleString()
        .replace(new RegExp('上午', 'g'), 'AM')
        .replace(/下午/g, 'PM');
      document.getElementById('clock').innerHTML = currTime;
      setTimeout(this.countTimer, 1000);
    }
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  // 全局错误捕捉
  componentDidCatch() {
    this.setState({ error: true });
  }

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    if (
      process.env.NODE_ENV === 'production' &&
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION !== 'site'
    ) {
      return null;
    }
    return <SettingDrawer />;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      menuData,
      breadcrumbNameMap,
      fixedHeader,
      collapsed,
      location,
    } = this.props;

    const { error, isMobile } = this.state;
    const firstMenus = parseMenuData(JSON.parse(getSessionStorage('000000')), '000000');
    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const posses = getSessionStorage('Positions') && JSON.parse(getSessionStorage('Positions')) || [];
    const layout = (
      <Layout className={blStyles.bslayout}>
        <CcGlobalHeader posses={posses} />
        {/* <SiderDemo
          onCollapse={this.handleMenuCollapse}
          collapsed={collapsed}
        /> */}
        {/* <SiderMenu
          logo={logo}
          // theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          collapsed={collapsed}
          menuData={menuData}
          isMobile={isMobile}
          {...this.props}
        /> */}
        <CcTopMenu
          logo={logo}
          // theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          collapsed={collapsed}
          firstMenus={firstMenus}
          location={location}
          isMobile={isMobile}
          {...this.props}
        />
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          {/* <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          /> */}
          <PageHeaderWrapper style={{ width: '75%' }} />
          {/* <span
            id="clock"
            style={{ textAlign: 'right', backgroundColor: '#FFFFFF', width: '100%' }}
          /> */}
          <BackTop
            className={styles.backTop}
            target={() => document.querySelector('#contentLayout')}
            visibilityHeight={200}
          />
          {!error ?
            <Content id="contentLayout" style={this.getContentType()}>
              {children}
            </Content>
            :
            <Exception
              type="500"
              backText="返回首页"
            />
            // <div style={{ textAlign: 'center', minHeight: '600px', height: '600px', lineHeight: '600px', color: 'red', fontSize: 23, fontWeight: 200 }}>系统错误！请联系管理员</div>
          }
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {/* <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense> */}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
