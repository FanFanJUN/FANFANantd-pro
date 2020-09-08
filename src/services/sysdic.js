import request from '@/utils/request';

export async function getTableData(params) {
  let api = '/api/lc/SYSDICSELECTLIST';
  if (params.flag) {
    api = '/api/lc/SYSDICSELECTCATEGORY';
  }
  return request(api, {
    method: 'POST',
    data: params,
  });
}

export async function addleData(params) {
  // const api = params && params.flag === 'delete' ? '/api/lc/DELETETUSER' : '/api/lc/INSERTUSER';
  let api = '';
  if (params) {
    if (params.flag === 'delete') {
      api = '/api/lc/SYSDICDELETE';
    } else if (params.flag === 'update') {
      api = '/api/lc/SYSDICUPDATE';
    } else {
      api = '/api/lc/SYSDICINSERT';
    }
  }
  return request(api, {
    method: 'POST',
    data: params,
  });
}
