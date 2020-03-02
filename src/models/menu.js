import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { useIntl } from 'umi';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { getMenuData } from '../services/api';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { call, put }) {
      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const menuData = filterMenuData(originalMenuData);

      // const isLeaf = [

      //   {
      //     path: '/dashboard/analysis',
      //     name: '分析页',
      //     exact: true,
      //     locale: 'menu.dashboard.analysis',
      //   },
      //   {
      //     path: '/dashboard/monitor',
      //     name: '监控页',
      //     exact: true,
      //     locale: 'menu.dashboard.monitor',
      //   },
      //   {
      //     path: '/dashboard/workplace',
      //     name: '工作台',
      //     exact: true,
      //     locale: 'menu.dashboard.workplace',
      //   },

      // ];
      // const menuData = [
      //   { path: '/dashboard', name: 'Dashboard', icon: 'dashboard', locale: '平台', isLeaf },
      //   { path: '/form', icon: 'form', name: '表单页', locale: 'menu.form' },
      //   { path: '/list', icon: 'table', name: '列表页', locale: 'menu.list' },
      //   { path: '/profile', name: '详情页', icon: 'profile', locale: 'menu.profile' },
      //   { path: '/charts', name: '图表', icon: 'area-chart', locale: 'menu.charts' },
      //   { path: '/DIYcompoment', name: '组件', icon: 'appstore', locale: 'menu.DIY' },
      //   { name: '结果页', icon: 'check-circle-o', path: '/result', locale: 'menu.result' },
      //   { name: '个人页', icon: 'user', path: '/account', locale: 'menu.account' },
      //   { name: '图形编辑器', icon: 'highlight', path: '/editor', locale: 'menu.editor' },
      //   { name: '系统管理', icon: 'setting', path: '/system', locale: 'menu.system' }];
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      // const menuData = yield call(getMenuData, payload);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
