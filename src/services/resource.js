import request from '@/utils/request';
import { RESOURCETP } from '@/constants/comm';

/** 获取菜单数据 */
export async function getTreeData(params) {
  return request('/api/lc/RESOURCESTREEELECTLIST', {
    method: 'POST',
    data: { ...params, resourceTp: RESOURCETP.RESOURCETP_0 },
  });
}

/** 获取菜单按钮权限信息 */
export async function getButtonTableData(params) {
  return request('/api/lc/RESOURCEBUTTON', {
    method: 'POST',
    data: { ...params, resourceTp: RESOURCETP.RESOURCETP_1 },
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
