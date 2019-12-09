/* eslint-disable consistent-return */
import { router } from 'umi';
import { getSessionStorage, setSessionStorage } from './utils/storage';
import { parseMenuData, isEmptyObject, isEmptyArray, isRespSucc, showErrorMsg } from './utils/utils';
import request from './utils/request';

// umi 约定 src 目录下的 app.js 为运行时的配置文件。https://umijs.org/zh/guide/app-structure.html#src-app-js-ts
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export function render(oldRender) {
  oldRender();
}

function fetchOneChild(thirdMenus) {
  if (isEmptyArray(thirdMenus)) {
    return '';
  }
  if (isEmptyArray(thirdMenus[0].children)) {
    const [theOneChild] = thirdMenus;
    return theOneChild && theOneChild.path;
  } else {
    return fetchOneChild(thirdMenus[0].children);
  }
}
/** 获取二级菜单 */
function getSecondMenu(ResourseNo) {
  console.log('获取二级菜单开始');
  // 初始化二级/三级菜单
  setSessionStorage('currSecondMenus', '[]');
  setSessionStorage('currthirdAndBelowMenus', '[]');
  // setSessionStorage(ResourseNo, '[]');
  const currResourseNoCache = getSessionStorage(ResourseNo);
  if (!isEmptyArray(currResourseNoCache)) {
    console.log(`${ResourseNo}缓存的二级菜单`, currResourseNoCache);
    setSessionStorage('currSecondMenus', JSON.stringify(parseMenuData(JSON.parse(currResourseNoCache), ResourseNo)));
  } else {
    const params = {
      parentNo: ResourseNo,
      resourceLvl: '2',
    };
    return request('/api/lc/RESOURCESELECTLIST', {
      method: 'POST',
      data: params,
    }).then((response) => {
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      const secMenuList = response.data;
      if (!isEmptyArray(secMenuList)) {
        setSessionStorage('currSecondMenus', JSON.stringify(parseMenuData(secMenuList, ResourseNo)));
      }
      if (ResourseNo) {
        setSessionStorage(ResourseNo, JSON.stringify(secMenuList));
      }
    });
  }
}

/** 获取三级菜单 */
function getThirdAndBelowMenu(ResourseNo) {
  setSessionStorage('currthirdAndBelowMenus', '[]');
  const currResourseNoCache = getSessionStorage(ResourseNo);
  if (!isEmptyArray(currResourseNoCache)) {
    console.log(`${ResourseNo}缓存的三级菜单`, currResourseNoCache);
    setSessionStorage('currthirdAndBelowMenus', JSON.stringify(parseMenuData(JSON.parse(currResourseNoCache), ResourseNo)));
  } else {
    const params = {
      parentNo: ResourseNo,
      resourceLvl: '3',
    };
    return request('/api/lc/RESOURCESELECTLIST', {
      method: 'POST',
      data: params,
    }).then((response) => {
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      const thiMenuList = response.data;
      if (!isEmptyArray(thiMenuList)) {
        setSessionStorage('currthirdAndBelowMenus', JSON.stringify(parseMenuData(thiMenuList, ResourseNo)));
      }
      if (ResourseNo) {
        setSessionStorage(ResourseNo, JSON.stringify(thiMenuList));
      }
    });
  }
}
async function getChildrenMenuFromCurrFirstMenu(curFirst, location, path) {
  if (isEmptyObject(curFirst)) {
    return;
  }
  const { search = '' } = location;
  const currSecondMenus = JSON.parse(getSessionStorage('currSecondMenus'));
  const currSec = currSecondMenus && currSecondMenus.filter((item) => item && item.path === path)[0] || {};
  const currSecFrom3 = currSecondMenus && currSecondMenus.filter((item) => item && path.startsWith(`${item.path}/`))[0] || {};
  if (curFirst.path === path) {
    // 获取二级菜单
    await getSecondMenu(curFirst.id);
    const currSecondMenusNew = JSON.parse(getSessionStorage('currSecondMenus'));
    const defaultUrl = !isEmptyArray(currSecondMenusNew) ? `${currSecondMenusNew[0].path}${search}` : '';
    // 自动定位到二级菜单第一个菜单
    if (defaultUrl) {
      router.push(defaultUrl);
    }
  } else if (!isEmptyObject(currSecFrom3)) {
    console.log('三级菜单path', path);
    await getThirdAndBelowMenu(currSecFrom3.id);
    const currthirdAndBelowMenusRes = JSON.parse(getSessionStorage(currSecFrom3.id)) || [];
    const currThi = currthirdAndBelowMenusRes && currthirdAndBelowMenusRes.filter((item) => item && item.resourcePath === path)[0] || {};
  } else if (!isEmptyObject(currSec)) {
    await getThirdAndBelowMenu(currSec.id);
    const currthirdAndBelowMenus = JSON.parse(getSessionStorage('currthirdAndBelowMenus'));
    if (!isEmptyArray(currthirdAndBelowMenus)) {
      const defaultUrl = !isEmptyArray(currthirdAndBelowMenus) ? `${fetchOneChild(currthirdAndBelowMenus)}${search}` : '';
      if (defaultUrl) {
        router.push(defaultUrl);
      }
    }
  } else {
    // 直接输入菜单url
    await getSecondMenu(curFirst.id);
    const currSecondMenusNew = JSON.parse(getSessionStorage('currSecondMenus'));
    const currSecNew = currSecondMenusNew && currSecondMenusNew.filter((item) => item && path.startsWith(`${item.path}/`))[0] || {};
    console.log('输入的path二级菜单', curFirst.id, currSecondMenusNew);
    await getThirdAndBelowMenu(currSecNew.id);
    const currthirdAndBelowMenus = JSON.parse(getSessionStorage('currthirdAndBelowMenus'));
    console.log('输入的path二级菜单', currSecNew.id, currthirdAndBelowMenus);
    const currthirdAndBelowMenusRes = JSON.parse(getSessionStorage(currSecNew.id)) || [];
    if (!isEmptyArray(currthirdAndBelowMenusRes)) {
      const defaultResource = currthirdAndBelowMenusRes && currthirdAndBelowMenusRes.filter((item) => item && item.resourcePath === path)[0] || {};
      if (defaultResource.resourcePath) {
        router.push(defaultResource.resourcePath);
      }
    }
  }
}
/** 用于在初始加载和路由切换时做一些事情。

参数：

Object
location：Object, history 提供的 location 对象
routes: Array, 路由配置
action: PUSH|POP|REPLACE|undefined，初次加载时为 undefined */
export function onRouteChange({ location, routes, action }) {
  // bacon(location.pathname);
  console.log('app routeChAnge', location, routes, action);
  // 获取当前路由地址
  const { pathname } = location;
  // 从SessionStorage获取全部一级菜单
  const allFirstMenusStr = getSessionStorage('000000');
  // 处理数据
  const allFirstMenu = allFirstMenusStr && parseMenuData(JSON.parse(allFirstMenusStr), '000000');
  // 获的当前路由地址对应的完整对象数据
  const curFirstMenu = allFirstMenu && allFirstMenu.filter((item) => {
    return item && `${pathname}/`.startsWith(`${item.path}/`);
  });
  console.log(curFirstMenu);
  const curFirst = curFirstMenu && curFirstMenu[0];
  if (curFirst) {
    // 当前选中一级菜单数据存储
    setSessionStorage('currFirstMenu', JSON.stringify(curFirst));
    // 获取一级菜单下子菜单 二级 && 三级
    getChildrenMenuFromCurrFirstMenu(curFirst, location, pathname);
    // 组装面包屑
    const currSecondMenus = JSON.parse(getSessionStorage('currSecondMenus'));
    const currthirdAndBelowMenus = JSON.parse(getSessionStorage('currthirdAndBelowMenus'));
    const currSec = !isEmptyArray(currSecondMenus) && currSecondMenus.filter((item) => item && pathname.startsWith(item.path));
    const breadcrumb = [
      !isEmptyArray(currSec) ? { ...curFirst, children: [{ ...currSec[0], children: currthirdAndBelowMenus }] } : { ...curFirst },
    ];
    setSessionStorage('currBreadcrumb', JSON.stringify(breadcrumb));
    setSessionStorage('lastBreadcrumb', JSON.stringify(breadcrumb));
    setSessionStorage('lastBreadcrumbPath', pathname);
  } else {
    setSessionStorage('currSecondMenus', '[]');
    setSessionStorage('currthirdAndBelowMenus', '[]');
  }
}
