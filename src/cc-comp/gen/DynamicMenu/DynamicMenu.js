/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { PureComponent } from 'react';
import { Menu, Icon, Card } from 'antd';
import PropTypes from 'prop-types';
// import Link from 'umi/link';
// import { Link, withRouter } from 'dva/router';
import { Link, withRouter, useIntl } from 'umi';
// import { intl.useIntl } from 'umi-plugin-react/locale';
// import { withRouter } from 'umi';
import { urlToList } from '../../../components/_utils/pathTools';
// import { getMenuMatches } from './SiderMenuUtils';
import { isUrl, isEmptyArray, isEmptyObject } from '@/utils/utils';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const { SubMenu, ItemGroup, Item } = Menu;
const intl = useIntl();
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

const transferRoterParamsString = routerParam => {
  if (!isEmptyObject(routerParam)) {
    return '';
  }
  let paramStr = '';
  Object.entries(routerParam).forEach((item, index) => {
    if (index === 0) {
      paramStr += `&${item[0]}=${item[1][0]}}`;
    } else {
      paramStr += `&${item[0]}=${item[1]}}`;
    }
  });
  return paramStr;
};

class DynamicMenu extends PureComponent {
  static propTypes = {
    hasWrapedCard: PropTypes.bool,
  }

  static defaultProps = {
    hasWrapedCard: true,
  }

  constructor(props) {
    super(props);
    const keys = urlToList(props.location.pathname) || [];
    this.state = {
      menuFixHeight: '',
      openKeys: keys.slice(0, keys.length - 1),
      selectedKeys: keys.slice(-1),
    };
  }

  componentDidMount() {
    this.setState({
      menuFixHeight: document.getElementById('root') ? document.getElementById('root').offsetHeight - 32 - 32 - 37 - 39 - 58 : '',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const keys = urlToList(nextProps.location.pathname) || [];
      this.setState({
        openKeys: keys.slice(0, keys.length - 1),
        selectedKeys: keys.slice(-1),
        menuFixHeight: document.getElementById('root') ? document.getElementById('root').offsetHeight - 32 - 32 - 37 - 39 - 58 : '',
      });
    }
  }
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

    const { routerQueryParam } = this.props;
    // const routerParamGet = transferRoterParamsString(routerQueryParam);
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

  getRenderMenu=(item) => {
    let icon;
    if (item.icon) {
      icon = getIcon(item.icon);
    }

    let name;
    if (item.nodeName) {
      name = intl.useIntl({ id: item.nodeName });
    } else {
      name = item.name;
    }

    if (item.children && !item.hideChildrenInMenu && item.children.length > 0) {
      const childrenItem = item.children;
      const childItemDom = childrenItem.map((childItem) => {
        return this.getRenderMenu(childItem);
      });
      if (item.type === '0' || !item.type) {
        return (
          <SubMenu key={item.path} title={icon || `${name}`}>
            {childItemDom}
          </SubMenu>
        );
      }
      if (item.type === '1') {
        return (
          <ItemGroup key={item.path} title={icon || `${name}`}>
            {childItemDom}
          </ItemGroup>
        );
      }
    } else {
      let menuItem = null;
      if (!item.hideInMenu) {
        menuItem = (
          <Item key={item.path}>
            {icon || ''}
            {this.getMenuItemPath(item)}
          </Item>
        );
      }
      return menuItem;
    }
  }

  getNavMenuItems=(menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData && menusData.filter(item => item.name && !item.hideInMenu)
      .map(item => {
        return this.getRenderMenu(item);
      }).filter(item => item);
  }

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      defaultOpenKeys,
      defaultSelectedKeys,
      collapsed,
      hasWrapedCard,
    } = this.props;
    const { menuFixHeight, openKeys, selectedKeys } = this.state;
    const menus = this.props.menusData;
    const openAndSelectedKeys = collapsed ? {} :
      {
        openKeys: !defaultOpenKeys ? openKeys : defaultOpenKeys,
        selectedKeys: !defaultSelectedKeys ? selectedKeys : defaultSelectedKeys,
      };

    let renderMenu;
    if (hasWrapedCard) {
      renderMenu = (
        <Card
          style={{
            width: '19.5%',
            height: menuFixHeight,
            position: 'fixed',
            overflow: 'auto',
          }}
        >
          <Menu
            key="Menu"
            {...openAndSelectedKeys}
            onOpenChange={this.handleOpenChange}
            mode="inline"
            className={styles.siderMenu}
          >
            { this.getNavMenuItems(menus)}
          </Menu>
        </Card>
      );
    } else {
      renderMenu = (
        <Menu
          key="Menu"
          {...openAndSelectedKeys}
          onOpenChange={this.handleOpenChange}
          mode="inline"
          className={styles.siderMenu}
        >
          { this.getNavMenuItems(menus)}
        </Menu>
      );
    }
    return renderMenu;
  }
}

export default withRouter(DynamicMenu);
