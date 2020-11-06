/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-11-05 13:41:09
 * @LastEditTime: 2020-11-05 13:49:52
 * @Description: 基于 axios 封装请求
 * @FilePath: /FANFANantd/src/utils/FeatchUtils.js
 */

import axios from 'axios';
import { message } from 'antd';
import { defaultPageSize, host } from '@/constants/comm';
import { isLocalhost, cache, cacheSession } from '@/utils/utils';

const instance = axios.create({
  // 当创建实例的时候配置默认配置
  xsrfCookieName: 'xsrf-token',
});

export function getHeader() {
  let authHeader = cache.get('authHeader');
  if (authHeader) {
    return authHeader;
  }
  try {
    const auth = cacheSession.get('Authorization');
    authHeader = {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: auth ? (auth.accessToken ? auth.accessToken : '') : '',
    };
  } catch (e) {
  }
  return authHeader;
}
instance.defaults.timeout = 600001;

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  if (config.url.indexOf('ByPage') !== -1 && !config.params.page) {
    config.params = { page: 1, rows: defaultPageSize, ...config.params };
  }
  if (!isLocalhost && config.url.indexOf('http') === -1) {
    config.url = host + config.url;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加一个响应拦截器
instance.interceptors.response.use((response) => {
  // 1.成功
  if (response.status === 200) {
    return response.data;
  }
  // 3.其他失败，比如校验不通过等
  message.error(response.msg);
  return Promise.reject(response.data);
}, (err) => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = '请求错误(400)'; break;
      case 401: err.message = '未授权，请重新登录(401)'; break;
      case 403: err.message = '拒绝访问(403)'; break;
      case 404: err.message = '请求出错(404)'; break;
      case 408: err.message = '请求超时(408)'; break;
      case 500: err.message = '服务器错误(500)'; break;
      case 501: err.message = '服务未实现(501)'; break;
      case 502: err.message = '网络错误(502)'; break;
      case 503: err.message = '服务不可用(503)'; break;
      case 504: err.message = '网络超时(504)'; break;
      case 505: err.message = 'HTTP版本不受支持(505)'; break;
      default: err.message = `连接出错(${err.response.status})!`;
    }
    if (err.response.status === 401) {
      cache.clear('Authorization');
      cache.clear('Right');
      cache.clear('_s');
      cache.clear('authHeader');
      return;
    }
    if (err.response.data) {
      err.message = `${err.message}  ${err.response.data.msg}`;
    }
  } else {
    err.message = '连接服务器失败!';
  }
  return Promise.reject({
    messageCode: err.message,
  });
});

// 建立唯一的key值
function buildUrl(url, params = {}) {
  const sortedParams = Object.keys(params).sort().reduce((result, key) => {
    result[key] = params[key];
    return result;
  }, {});

  url += `?${JSON.stringify(sortedParams)}`;
  return url;
}

export default {
  get(url, param = {}, needCache = false) {
    let res;
    if (needCache) {
      res = cache.get(buildUrl(url, param));
    }
    if (res) {
      return new Promise((resolve, reject) => {
        resolve(res);
      });
    } else {
      const params = { ...param, t: Date.parse(new Date()) };
      return new Promise((resolve, reject) => {
        instance({
          method: 'get',
          headers: getHeader(),
          url,
          params,
        }).then(res => {
          if (needCache) {
            cache.set(buildUrl(url, param), res);
          }
          resolve(res);
        }).catch(err => {
          message.error(err.messageCode);
          reject(err);
        });
      });
    }
  },
  getExport(url, param = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'get',
        headers: getHeader(),
        url,
        responseType: 'blob',
        params: param,
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },
  post(url, param = {}) {
    const params = { ...param, t: Date.parse(new Date()) };
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        headers: getHeader(),
        url,
        params,
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },

  postJson(url, data = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        headers: getHeader(),
        url,
        data,
        params: Date.parse(new Date()),
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },
  postExport(url, data = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        headers: getHeader(),
        responseType: 'blob', // 判断下载是否成功
        url,
        data,
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },
  postFormData(url, data = {}) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const formData = new FormData();
    keys.forEach((item, index) => {
      formData.append(item, values[index]);
    });
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        headers: getHeader(),
        url,
        data: formData,
        params: Date.parse(new Date()),
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },
  delete(url, param = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'delete',
        headers: getHeader(),
        url,
        params: param,
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },
  deleteBatch(url, param = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'delete',
        headers: getHeader(),
        url,
        data: param,
      }).then(res => {
        resolve(res);
      }).catch(err => {
        message.error(err.messageCode);
        reject(err);
      });
    });
  },
};
