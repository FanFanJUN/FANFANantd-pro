import React, { PureComponent, Suspense } from 'react';
import { Layout, Switch } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { title } from '../../defaultSettings';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

let firstMount = true;

/**
 * @description 左侧菜单
 * @author LC@1981824361
 * @date 2019-11-21
 * @export
 * @class SiderMenu
 * @extends {PureComponent}
 */
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
      themeFlag: true, // 样式切换标志
    };
  }

  componentDidMount() {
    firstMount = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname, flatMenuKeysLen } = state;
    if (props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  // 改变主题
  changeTheme = (flag) => {
    this.setState({ themeFlag: !flag });
  }

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, isMobile } = this.props;
    const { openKeys, themeFlag } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const theme = themeFlag ? 'light' : 'dark';
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={collapse => {
          if (firstMount || !isMobile) {
            onCollapse(collapse);
          }
        }}
        width={200}
        collapsedWidth={0} // 收缩宽度
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{title}</h1>
          </Link>
        </div>
        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline" // MenuMode = 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline';
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
            theme={theme}
          />
        </Suspense>
        {/* <div className={styles.switchTheme}>
          <Switch checkedChildren="light" unCheckedChildren="dark" defaultChecked onChange={() => this.changeTheme(themeFlag)} />
        </div> */}
      </Sider>
    );
  }
}
