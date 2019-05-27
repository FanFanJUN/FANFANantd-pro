import { checkNull } from './utils';

/**
 * @description 对SessionStorage的操作
 * @author LC@1981824361
 * @date 2019-05-27
 * @export
 * @param {*} storageName
 * @param {*} item
 * @returns
 */
export function setSessionStorage(storageName, item) {
  if (checkNull(item)) {
    if (typeof item === 'object') {
      return sessionStorage.setItem(storageName, '{}');
    } else {
      return sessionStorage.setItem(storageName, '');
    }
  }
  return sessionStorage.setItem(storageName, item);
}

export function getSessionStorage(item) {
  return sessionStorage.getItem(item);
}

export function clearSessionStorage(item) {
  return sessionStorage.getItem(item);
}

export function clearAllSessionStorage() {
  return sessionStorage.clear();
}
