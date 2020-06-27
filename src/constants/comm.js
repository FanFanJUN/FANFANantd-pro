import getEnvVariables from '@/utils/env';

// eslint-disable-next-line import/prefer-default-export
// 根据运行时环境变量获取不同环境参数
export const COMMONS = {
  TOPMENUNO: getEnvVariables('TOPMENUNO'),
};

function freezeObj(obj) {
  Object.freeze(obj);
  Object.keys(obj).forEach((v) => {
    if (typeof obj[v] === 'object') {
      freezeObj(obj[v]);
    }
  });
}

// 资源类型 0菜单 1资源
export const RESOURCETP = {
  RESOURCETP_0: '0',
  RESOURCETP_1: '1',
};

export const defaultPageSize = 10;

export const defaultPageSizeOptions = ['10', '50', '100'];

freezeObj(COMMONS);
freezeObj(RESOURCETP);
