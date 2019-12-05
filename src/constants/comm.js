import getEnvVariables from '@/utils/env';

// eslint-disable-next-line import/prefer-default-export
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

freezeObj(COMMONS);
