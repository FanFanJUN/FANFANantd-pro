import request from '@/utils/request';

/** 获取菜单数据 */
export async function getTreeData(params) {
  return request('/api/lc/RESOURCESELECTLIST', {
    method: 'POST',
    data: params,
  });
}

export async function addleData(params) {
  let api = '';
  if (params) {
    if (params.flag === 'delete') {
      api = '/api/lc/RESOURCEDELETE';
    } else if (params.flag === 'update') {
      api = '/api/lc/RESOURCEUPDATE';
    } else {
      api = '/api/lc/RESOURCEINSERT';
    }
  }
  return request(api, {
    method: 'POST',
    data: params,
  });
}
