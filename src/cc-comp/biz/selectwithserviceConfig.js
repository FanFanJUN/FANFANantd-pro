import { getTreeData } from '@/services/resource';
import { getTableData } from '@/services/api';


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
