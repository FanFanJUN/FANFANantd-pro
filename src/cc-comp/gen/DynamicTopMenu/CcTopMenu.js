/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon, Layout } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../../../components/_utils/pathTools';
// import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import csd from './index.css';
import { getSessionStorage } from '@/utils/storage';
// import Header from '@/layouts/Header';

const { SubMenu } = Menu;
const { Header } = Layout;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

export default class CcTopMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          { icon }
          <span>{name}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        // onClick={
        //   isMobile
        //     ? () => {
        //       onCollapse(true);
        //     }
        //     : undefined
        // }
      >
        { icon }
        <span>{name}</span>
      </Link>
    );
  };

  getTopMenuItems=() => {
    console.log(this.props.firstMenus);
    const topMenu = this.props.firstMenus && this.props.firstMenus.filter(item => item.path && !item.hideInMenu).map(item => {
      if (item.path) {
        return (
          <Menu.Item
            key={item.id}
            className={urlToList(this.props.location.pathname).includes(item.path) ? 'ant-menu-item ant-menu-item-selected' : ''}
            // menu={item}
          >
            {this.getMenuItemPath(item)}
          </Menu.Item>
        );
      }
      return null;
    });
    return topMenu;
  }

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  getPopupContainer = (fixedHeader, layout) => {
    if (fixedHeader && layout === 'topmenu') {
      return this.wrap;
    }
    return document.body;
  };

  getRef = ref => {
    this.wrap = ref;
  };

  renderSecMenu=() => {
    const secMenus = JSON.parse(getSessionStorage('currSecondMenus'));
    const secMenuDataDom = secMenus && secMenus.filter((item) => item && item.path && !item.hideInMenu)
      .map((item, index) => {
        let subMenuCheckedClassName = '';
        // 选中时根据路由 赋予css
        if (this.props.location.pathname.indexOf(item.path) !== -1) {
          subMenuCheckedClassName = 'submenuChecked';
        }
        return (
          <li key={`${item.path}li`} className={subMenuCheckedClassName}>
            {this.getMenuItemPath(item)}
            {index < secMenus.length - 1 ? (
              <span style={{ padding: '0 0 0 10px' }}>|</span>
            ) : null}
          </li>
        );
      });
    return secMenuDataDom;
  }

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
      fixedHeader,
      layout,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    // let selectedKeys = this.getSelectedMenuKeys(pathname);
    // if (!selectedKeys.length && openKeys) {
    //   selectedKeys = [openKeys[openKeys.length - 1]];
    // }
    // let props = {};
    // if (openKeys && !collapsed) {
    //   props = {
    //     openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
    //   };
    // }
    // const { handleOpenChange, style, menuData } = this.props;
    // const cls = classNames(className, {
    //   'top-nav-menu': mode === 'horizontal',
    // });

    return (
      <div className={csd.CcTopMenu}>
        <Header
          className="ant-layout-header"
          trigger={null}
        >
          <Menu
            key="Menu"
            theme="light"
            // selectedKeys={selectedKeys}
            // style={style}
            mode="horizontal"
            className="ant-menu-item"
            style={{ width: '100%', minWidth: '800px', backgroundColor: '#CB3428', marginBottom: 12 }}
            /* 样式2新增 */
            // style={{ width: '100%', minWidth: '800px' }}
          >
            { this.getTopMenuItems()}
          </Menu>
          <div className={csd.subMenu}>
            <ul>{this.renderSecMenu()}</ul>
          </div>
        </Header>
      </div>
    );
  }
}
