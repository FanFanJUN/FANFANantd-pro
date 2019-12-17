/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import { Modal } from 'antd';

// import request from 'umi-request';
import request from '@/utils/request';
import Ellipsis from '@/components/Ellipsis';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

//* ****************************工具类 ***********************//

/**
 * @description 为页面生成routeid
 * @author LC@1981824361
 * @date 2019-05-24
 * @export
 * @returns routeid
 */

export function guid() {
  return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function createRouteid() {
  return guid();
}

// 错误处理

/**
 * @description 对返回数据的处理
 * @author LC@1981824361
 * @date 2019-05-24
 * @export
 * @param {*} response
 * @returns {boolean}
 */
// export function isRespSucc(response) {
//   if (!response || response.fault.faultCode !== 'AAAAAAA') {
//     return false;
//   }
//   return true;
// }
export function isRespSucc(response) {
  if (!response || response.code !== 200) {
    return false;
  }
  return true;
}
/**
 * @description 错误信息||错误码
 * @author LC@1981824361
 * @date 2019-05-24
 * @export
 * @param {*} response
 * @returns
 */
export function showErrorMsg(response) {
  if (response == null) {
    return;
  }
  Modal.error({
    title: <div>错误提示</div>,
    content: (
      <div style={{ marginTop: 16 }}>
        错误码:
        <span style={{ color: 'red' }}>{response.code}</span>
        <br />
        错误信息:
        <span style={{ color: 'red' }}>{response.message}</span>
      </div>
    ),
  });
}
// export function showErrorMsg(response) {
//   if (response == null) {
//     return;
//   }
//   Modal.error({
//     title: <div>错误提示</div>,
//     content: (
//       <div style={{ marginTop: 16 }}>
//         错误码:
//         <span style={{ color: 'red' }}>{response.fault.faultCode}</span>
//         <br />
//         错误信息:
//         <span style={{ color: 'red' }}>{response.fault.faultString}</span>
//       </div>
//     ),
//   });
// }
/**
 * @description
 * @author LC@1981824361
 * @date 2019-05-22
 * @export
 * @param {number} [pageSize=10]
 * @param {*} pageNum
 * @param {*} pageRange
 * @returns 分页细信息
 */
export function showPaginationMessage(pageSize = 10, pageNum, pageRange) {
  const totalPage = Math.ceil(pageNum / pageSize);
  const currPage = Math.ceil(pageRange[0] / pageSize);
  // return `总共${pageNum}条记录`,第${currPage}/${totalPage}页;
  // 对原生AntD Pro分页信息位置处理
  return `总共${pageNum}条记录,第${currPage}/${totalPage}页`;
}

/**
 * @description
    // pagination参数
    // current: 1
    // pageSize: 10
    // total: 46
 * @author LC@1981824361
 * @date 2019-05-22
 * @export
 * @param {*} pagination
 * @returns pag
 */
export function getTablepag(pagination) {
  if (!pagination) {
    // eslint-disable-next-line no-throw-literal
    return;
  }
  const pag = {
    total: pagination.total,
    pageSize: pagination.pageSize,
    current: pagination.current,
    showTotal: showPaginationMessage.bind(null, pagination.pageSize),
    showQuickJumper: true,
  };
  return pag;
}

/**
 * @description 空值判断
 * @author LC@1981824361
 * @date 2019-05-22
 * @export
 * @param {*} value
 * @returns
 */
export function checkNull(value) {
  if (!value || value == null || typeof value === 'undefined' || value === '') {
    return true;
  }
  return false;
}

/**
 * @description 空对象{}判断
 * @author LC@1981824361
 * @date 2019-05-22
 * @export
 * @param {*} object
 * @returns {boolean}
 */
export function isEmptyObject(object) {
  if (checkNull(object)) {
    return true;
  }
  // Object.prototype.toString.call(o) === '[object Object]'
  if (Object.prototype.toString.call(object).slice(8, -1) === 'Object' && Object.keys(object).length === 0) {
    return true;
  }
  return false;
}

/**
 * @description 空数组[]判断
 * @author LC@1981824361
 * @date 2019-05-22
 * @export
 * @param {*} array
 * @returns {boolean}
 */
export function isEmptyArray(array) {
  if (checkNull(array)) {
    return true;
  }
  // Object.prototype.toString.call(o) === '[object Array]'
  if (Object.prototype.toString.call(array).slice(8, -1) === 'Array' && array.length === 0) {
    return true;
  }
  return false;
}

/**
 * @description 判断数据类型
 * @author LC@1981824361
 * @date 2019-06-05
 * @export
 * @param {*} target 传入的数据
 * @param {*} type 传入的数据的数据类型
 * @returns {boolean}
 */
export function isType(target, type) {
  if (Object.prototype.toString.call(target) === `[object ${type}]`) {
    return true;
  }
  return false;
}

/**
  * @description antd form表单搜索去掉空字符串 undefined值 保留有效参数值F
  * @author LC@1981824361
  * @date 2019-05-23
  * @export
  * @param {*} filedsValue
  * @returns serchObj
  */
export function filterEmptyFileds(filedsValue) {
  if (!filedsValue) {
    throw new Error('请传入表单数据！');
  } else {
    const serchObj = {};
    Object.keys(filedsValue).forEach(key => {
      if (key && filedsValue[key]) {
        serchObj[key] = filedsValue[key];
      }
    });
    return serchObj;
  }
}

/**
 * @description 金钱格式化||千分位
 * @author LC@1981824361
 * @date 2019-07-16
 * @export
 * @param {*} value
 * @returns
 */
export function toThousands(value) {
  if (!value) { return value; }
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
/**
 * @description 数据字典
 * @author LC@1981824361
 * @date 2019-06-01
 * @export
 * @param {*} dicCategoryNos
 * @returns
 */
export function getDicOptions(dicCategoryNos) {
  if (!dicCategoryNos.length) {
    return;
  }
  const params = { projectIds: dicCategoryNos };
  return request('/api/lc/CACHEDIC', {
    method: 'POST',
    data: params,
  }).then((response) => {
    // if (!isRespSucc(response)) {
    //   // eslint-disable-next-line no-throw-literal
    //   throw '数据字典获取异常';
    // }
    const options = response.retCacheList;
    const obj = {};
    for (let i = 0; i < dicCategoryNos.length; i++) {
      for (let j = 0; j < options.length; j++) {
        if (options[j].dictionaryCategoryNo === dicCategoryNos[i].dictionaryCategoryNo) {
          if (dicCategoryNos[i].NotInArr) {
            obj[options[j].dictionaryCategoryNo] = options[j].dictionaryCategoryNo.filter((itemTmp) => {
              return dicCategoryNos[i].NotInArr.every(
                item => item.dictionaryNo !== itemTmp.dictionaryNo
              );
            });
          } else {
            obj[options[j].dictionaryCategoryNo] = options[j].dictionaries;
          }
          if (dicCategoryNos[i].ChooseFlag) {
            obj[options[j].dictionaryCategoryNo].unshift({
              dictionaryCategoryNm: '请选择',
              dictionaryCategoryNo: '请选择',
              dictionaryNm: '--请选择--',
              dictionaryNo: '',
            });
          }
        }
      }
    }
    return obj;
  });
}
/*
 * @description 数据字典
 * @author LC@1981824361
 * @date 2019-06-07
 * @export
 * @param {*} key 码值
 * @param {*} dicName 翻译的数据字典码类型
 * @param {*} optionsData 数据 字典
 * @returns
*/
export const getDicNameByKey = (key, dicName, optionsData) => {
  if (!key) {
    return;
  }
  if (optionsData[dicName] && optionsData[dicName] instanceof Array) {
    const isKeyArr = key.indexOf(',') !== -1;
    if (isKeyArr) {
      let codeName = '';
      const keyArr = key.split(',');
      keyArr.forEach((code) => {
        const regItem = optionsData[dicName].filter((item) => {
          return item.dictionaryNo === code;
        });

        if (regItem.length > 0) {
          codeName += `${regItem[0].dictionaryNm || ''},`;
        }
      });
      codeName = codeName.substring(0, codeName.length - 1);
      return codeName;
    } else {
      const realationArr = optionsData[dicName].filter(item => item.dictionaryNo === key);
      if (realationArr.length > 0) {
        return realationArr[0].dictionaryNm || '';
      }
    }
  } else {
    return '';
  }
};

export function getHelloWord() {
  return request('/api/lc/hellospringboot', {
    method: 'GET',
  }).then((response) => {
    return response;
  });
}
/**
 * @description SptingBoot查询user信息
 * @author LC@1981824361
 * @date 2019-06-21
 * @export
 * @returns userlIST
 */
export function getUserData(params) {
  return request('/api/lc/SELECTLISTUSER', {
    method: 'POST',
    data: params,
  }).then((response) => {
    if (!isRespSucc(response)) {
      showErrorMsg(response);
      return;
    }
    const { data } = response;
    return data;
  });
}

/**
 * @description 树形数据
 * @author LC@1981824361
 * @date 2019-07-16
 * @export
 */
export function getTreeData() {
  const sendData = [
    {
      value: ['100', '200', '300', '400'],
      name: '测试',
      children: [
        { value: ['100', '200', '300', '400'],
          name: '测试1' },
        { value: ['100', '200', '300', '400'],
          name: '测试2' },
      ],
    },
  ];
  return sendData;
}

/**
 * @description 简单的文字提示 https://v2-pro.ant.design/components/ellipsis-cn
 * @author LC@1981824361
 * @date 2019-08-03
 * @export
 * @param {*} mes
 * @param {*} length
 * @returns
 */
export function getEllipsis(mes, length) {
  if (!mes) return;
  let lengthTmp = length;
  if (lengthTmp) {
    if (lengthTmp > 15) {
      lengthTmp = 15;
    }
    if (mes.length <= lengthTmp) {
      return mes;
    }
    return (
      <Ellipsis tooltip length={lengthTmp}>
        {`${mes}`}
      </Ellipsis>
    );
  }
  return (
    <div style={{ width: '100%' }}>
      <Ellipsis tooltip lines={1} fullWidthRecognition>
        {mes}
      </Ellipsis>
    </div>
  );
}

/**
 * @description 树形数据转化为List
 * @author LC@1981824361
 * @date 2019-10-31
 * @export
 * @param {*} list
 * @param {*} treeData
 * @returns
 */
export function gridDataformTree(list, treeData) {
  const getList = list;
  if (!Array.isArray(treeData) && treeData.length > 0) {
    return;
  } else {
    treeData.forEach((item) => {
      getList.push(item);
      if (item.children) {
        gridDataformTree(getList, item.children);
      }
    });
  }
  return getList;
}

/**
 * @description 获取当前节点的所有父节点，包括自身
 * @author LC@1981824361
 * @date 2019-10-31
 * @export
 * @param {*} array
 * @param {*} currentNode
 * @returns stack
 */
export function getParentNodes(array, currentNode) {
  const stack = [];
  let going = true;

  const walker = (arrayData, node) => {
    arrayData.forEach(item => {
      if (!going) return;
      stack.push(item.id);
      if (item.id === node) {
        going = false;
      } else if (item.children) {
        walker(item.children, node);
      } else {
        stack.pop();
      }
    });
    if (going) stack.pop();
  };

  walker(array, currentNode);

  return stack;
}

export function translateDataToTree(data) {
  // 没有父节点的数据
  const parents = data.filter(value => value.parentId === '0');

  // 有父节点的数据
  const children = data.filter(value => value.parentId !== '0');

  // 定义转换方法的具体实现
  const translator = () => {
    // 遍历父节点数据
    parents.forEach((parent) => {
      // 遍历子节点数据
      children.forEach((current, index) => {
        // 此时找到父节点对应的一个子节点
        if (current.parentId === parent.id) {
          // 对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          const temp = JSON.parse(JSON.stringify(children));
          // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1);
          // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([current], temp);
          // 把找到子节点放入父节点的children属性中
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current];
        }
      });
    });
  };
  // 返回最终的结果
  return parents;
}

/**
 * @description解析菜单数据
 * @author LC@1981824361
 * @date 2019-11-25
 * @export
 * @param {*} data
 * @param {*} parentNo
 * @returns
 */
export function parseMenuData(data, parentNo) {
  if (!data) {
    return [];
  }
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    const menu = {};
    menu.name = data[i].resourceNm;
    menu.path = data[i].resourcePath;
    menu.id = data[i].resourceNo;
    menu.level = data[i].resourceLvl;
    menu.order = Number(data[i].resourceOrd);
    if (data[i].parentNo === parentNo) {
      if (data[i].isLeaf === '1') {
        const child = parseMenuData(data, data[i].resourceNo);
        if (!isEmptyArray(child)) menu.children = child;
      }
      arr.push(menu);
    }
  }
  arr.sort((v1, v2) => {
    if (v1.order > v2.order) {
      return 1;
    } else if (v1.order < v2.order) {
      return -1;
    } else {
      return 0;
    }
  });
  return arr;
}
