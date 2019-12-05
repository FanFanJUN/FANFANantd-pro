// /**
//  * request 网络请求工具
//  * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
//  * 20190525 antd pro umi request封装
//  */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getSessionStorage } from './storage';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  if (status === 401) {
    notification.error({
      message: '未登录或登录已过期，请重新登录。',
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // environment should not be used
  // if (status === 403) {
  //   router.push('/exception/403');
  //   return;
  // }
  // if (status <= 504 && status >= 500) {
  //   router.push('/exception/500');
  //   return;
  // }
  // if (status >= 404 && status < 422) {
  //   router.push('/exception/404');
  // }
};

/**
 * 配置request请求时的默认参数具体参数 https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
 */
// 有些通用的配置我们不想每个请求里都去添加，那么可以通过 extend 新建一个 umi-request 实例
const request = extend({
  // prefix: '/api/lc', // 前置
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  // headers: {
  //   some: 'header', // 统一的headers
  // },
});

// 封装请求
// request.interceptors.request.use(async (url, options) => {
//   console.log(url, options);
//   const newOptions = options;
//   const RequestHeader = {
//     currentUser: getSessionStorage('currentUser'),
//   };
//   newOptions.data = {
//     RequestHeader: { ...RequestHeader },
//     RequestBody: {
//       ...newOptions.data,
//     } };
//   return (
//     {
//       url,
//       options: { ...options },
//     }
//   );
// });

export default request;


// import fetch from 'dva/fetch';
// import { notification } from 'antd';
// import router from 'umi/router';
// import hash from 'hash.js';
// import { isAntdPro } from './utils';

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

// const checkStatus = response => {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//   const errortext = codeMessage[response.status] || response.statusText;
//   notification.error({
//     message: `请求错误 ${response.status}: ${response.url}`,
//     description: errortext,
//   });
//   const error = new Error(errortext);
//   error.name = response.status;
//   error.response = response;
//   throw error;
// };

// const cachedSave = (response, hashcode) => {
//   /**
//    * Clone a response data and store it in sessionStorage
//    * Does not support data other than json, Cache only json
//    */
//   const contentType = response.headers.get('Content-Type');
//   if (contentType && contentType.match(/application\/json/i)) {
//     // All data is saved as text
//     response
//       .clone()
//       .text()
//       .then(content => {
//         sessionStorage.setItem(hashcode, content);
//         sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
//       });
//   }
//   return response;
// };

// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [option] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default function request(url, option) {
//   const options = {
//     expirys: isAntdPro(),
//     ...option,
//   };
//   /**
//    * Produce fingerprints based on url and parameters
//    * Maybe url has the same parameters
//    */
//   const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
//   const hashcode = hash
//     .sha256()
//     .update(fingerprint)
//     .digest('hex');

//   const defaultOptions = {
//     credentials: 'include',
//   };
//   const newOptions = { ...defaultOptions, ...options };
//   // 请求头
//   const RequestHeader = {
//     userName: 'LC',
//     userNo: 8527,
//   };
//   if (
//     newOptions.method === 'POST' ||
//     newOptions.method === 'PUT' ||
//     newOptions.method === 'DELETE'
//   ) {
//     if (!(newOptions.body instanceof FormData)) {
//       newOptions.headers = {
//         Accept: 'application/json',
//         'Content-Type': 'application/json; charset=utf-8',
//         ...newOptions.headers,
//       };
//       // newOptions.body = JSON.stringify(newOptions.body);
//       // 这里可以对请求体封装
//       newOptions.body = {
//         RequestHeader: { ...RequestHeader },
//         RequestBody: {
//           ...newOptions.body,
//         },
//       };
//       newOptions.body = JSON.stringify(newOptions.body);
//     } else {
//       // newOptions.body is FormData
//       newOptions.headers = {
//         Accept: 'application/json',
//         ...newOptions.headers,
//       };
//     }
//   }

//   // 原生request并未对GET请求封装，封装如下
//   let urlStr = url;
//   if (newOptions.method === 'GET') {
//     urlStr = `${url}?`;
//     Object.keys(newOptions.body).forEach(key => {
//       const str = (newOptions.body)[key];
//       urlStr += `${key}=${str}&`;
//     });
//     urlStr = urlStr.substr(0, urlStr.length - 1);
//     delete newOptions.body;
//   }

//   const expirys = options.expirys && 60;
//   // options.expirys !== false, return the cache,
//   if (options.expirys !== false) {
//     const cached = sessionStorage.getItem(hashcode);
//     const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
//     if (cached !== null && whenCached !== null) {
//       const age = (Date.now() - whenCached) / 1000;
//       if (age < expirys) {
//         const response = new Response(new Blob([cached]));
//         return response.json();
//       }
//       sessionStorage.removeItem(hashcode);
//       sessionStorage.removeItem(`${hashcode}:timestamp`);
//     }
//   }
//   return fetch(url, newOptions)
//     .then(checkStatus)
//     .then(response => cachedSave(response, hashcode))
//     .then(response => {
//       // DELETE and 204 do not return data by default
//       // using .json will report an error.
//       if (newOptions.method === 'DELETE' || response.status === 204) {
//         return response.text();
//       }
//       return response.json();
//     })
//     .catch(e => {
//       const status = e.name;
//       if (status === 401) {
//         // @HACK
//         /* eslint-disable no-underscore-dangle */
//         window.g_app._store.dispatch({
//           type: 'login/logout',
//         });
//         return;
//       }
//       // environment should not be used
//       if (status === 403) {
//         router.push('/exception/403');
//         return;
//       }
//       if (status <= 504 && status >= 500) {
//         router.push('/exception/500');
//         return;
//       }
//       if (status >= 404 && status < 422) {
//         router.push('/exception/404');
//       }
//     });
// }
