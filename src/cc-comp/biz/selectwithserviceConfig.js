/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-06-02 10:58:36
 * @LastEditTime: 2020-11-04 11:35:02
 * @Description: 配置service config
 * @FilePath: /FANFANantd/src/cc-comp/biz/selectwithserviceConfig.js
 */
import { getTreeData } from '@/services/resource';
import { getTableData } from '@/services/api';
import moment from 'moment';

export const treeCofig = {
  service: getTreeData, // 获取数据的接口访问service
  key: 'purchaseMaterialCategoryCode', // 选中的key
  text: 'purchaseMaterialCategoryName', // 选中的name
};

export const userConfig = {
  columns: [{
    dataIndex: 'id',
    title: '编号',
    align: 'center',
  },
  {
    dataIndex: 'birthdate',
    title: '生日',
    align: 'center',
    render: (text) => {
      return text && moment(text).format('YYYY-MM-DD');
    },
  },
  {
    dataIndex: 'name',
    title: '名字',
    align: 'center',
  }],
  dataService: getTableData,
  service: getTableData,
  //   searchService: (param1, param2) => searchListByKey(param1, param2, ['value', 'name']),
  key: 'id',
  text: 'name',
};
