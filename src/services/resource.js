import request from '@/utils/request';

/** 获取菜单数据 */
export async function getTreeData(params) {
  return request('/api/lc/RESOURCESELECTLIST', {
    method: 'POST',
    data: params,
  });
}
