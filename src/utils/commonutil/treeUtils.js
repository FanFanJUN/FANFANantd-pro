/**
 * 树形数据处理工具类
 * @author SPY
 * @description -- 对于树形数据进行必要的处理
 * @date  -- 2019/11/11
 */
import arrayUtils from './arrayUtils';

const treeUtils = {

  /**
     * 将树形list数据的叶子节点转化为一维数组
     * @param {object} treeList -- 要遍历的list对象,格式为:{id:1,name:'河南',subList:[{id:11,name:'郑州'}]},
     * @param {string} childListKey -- 树节点的子集list的id的名称
     */
  treeLeafToArray: (treeList = {}, childListKey = 'subList') => {
    const data = [];
    const func = (treeList, childListKey) => {
      if (treeList[childListKey] && treeList[childListKey].length !== 0) {
        // 说明树节点有子节点
        treeList[childListKey].forEach(item => {
          func(item, childListKey);
        });
      } else {
        // 说明树节点为叶子节点
        data.push(treeList);
      }
    };
    func(treeList, childListKey);
    return data;
  },


  /**
     * 将树形数据平铺为同级数组
     * @param {array} treeList -- 要平铺的list数组
     * @param {string} childListKey -- 树节点的子集list的id的名称
     */
  flatten: (treeList = [], childListKey = 'children') => {
    const data = [];
    const func = (treeList, childListKey) => {
      treeList.forEach(item => {
        data.push(item);
        if (item[childListKey] && item[childListKey].length !== 0) {
          // 说明有子节点
          func(item[childListKey], childListKey = 'children');
        }
      });
    };
    func(treeList, childListKey);
    return data;
  },


  /**
     * 遍历树形数据函数(查找)
     * @param {array} treeList -- 要遍历的list数组
     * @param {string} childListKey -- 树节点的子集list的id的名称
     * @param {func} callback -- 回调函数,可以在函数做一些node节点id的数据处理
     * @param {object} parentNode -- 父级节点及子集的数据
     */
  forEach: (treeList = [], childListKey = 'subList', callback, parentNode) => {
    if (!Array.isArray(treeList)) return;
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i];
      callback(node, parentNode); // 要查询的条件,以及查询之后的数据操作
      treeUtils.forEach(node[childListKey], childListKey, callback, node);
    }
  },
  // treeUtils.forEach(dataList, childListKey, (node, parentNode) => {
  //     if (value && searchMatcher(value, node, this.props)) {
  //         expandedKeys.push(node[idKey]);
  //     }
  // });


  /**
     * 组装树函数
     * @param {array} data -- 要组装的list数组
     * @param {string} idKey -- 树节点的id的名称
     * @param {string} parentKey -- 树节点的父节点id的名称
     * @param {string} childListKey -- 树节点的子集list的id的名称
     */
  toTree: (data = [], idKey = 'id', parentKey = 'pid', childListKey = 'subList') => {
    // 删除 所有 children,以防止多次调用
    data.forEach((item) => {
      delete item[childListKey];
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    const map = {};
    data.forEach((item) => {
      map[item[idKey]] = item;
    });
    const val = [];
    data.forEach((item) => {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      const parent = map[item[parentKey]];
      // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        (parent[childListKey] || (parent[childListKey] = [])).push(item);
      } else {
        // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;
  },
  // const data = [
  //     { id: 1, name: "办公管理", pid: 0 },
  //     { id: 2, name: "请假申请", pid: 1 },
  //     { id: 3, name: "出差申请", pid: 1 },
  //     { id: 4, name: "请假记录", pid: 2 },
  //     { id: 5, name: "系统设置", pid: 0 },
  //     { id: 6, name: "权限管理", pid: 5 },
  //     { id: 7, name: "用户角色", pid: 6 },
  //     { id: 8, name: "菜单设置", pid: 6 },
  // ];


  /**
     * 树结构排序函数
     * @param {array} data -- 要排序的树组
     * @param {string} sortField -- 根据排序的字段名称
     * @param {string} childListKey -- 树节点的子集list的id的名称
     * @param {string} orderBy -- 正序：'asc'  倒序：’desc‘
     */
  sortTree: (data = [], sortField = 'id', childListKey = 'subList', orderBy = 'asc') => {
    // 默认正序
    const func = (data, sortField, childListKey, orderBy) => {
      if (!Array.isArray(data)) return;
      data.sort(arrayUtils.sortCallBack(sortField, orderBy)).forEach((node) => {
        func(node[childListKey], sortField, childListKey, orderBy);
      });
    };
    func(data, sortField, childListKey, orderBy);
    return data;
  },


};

export default treeUtils;
