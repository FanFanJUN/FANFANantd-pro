import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setSessionStorage, clearAllSessionStorage } from '@/utils/storage';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      /* 暂时不访问mock 在这里写死 */
      const { password, userName, type } = payload;
      let response = {};
      if (password === '123456' && userName === 'admin') {
        response = {
          status: 'success',
          type,
          currentUser: userName,
          currentAuthority: 'admin',
        };
      } else if (password === '123456' && userName === 'user') {
        response = {
          status: 'success',
          type,
          currentUser: userName,
          currentAuthority: 'user',
        };
      } else {
        response = {
          status: 'error',
          type,
          currentAuthority: 'guest',
        };
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'success') {
        reloadAuthorized();
        // 把用户信息存入sessionstorage
        setSessionStorage('currentUser', response.currentUser);
        // 角色信息
        const roles = [
          { POSITION_NO: 'TEST_01' }, { POSITION_NM: '技术部经理' },
          {
            POSITION_NO: 'TEST_02' }, { POSITION_NM: '人事部经理',
          }];
        // 菜单信息
        const paths = [
          {
            ResourceNo: '100',
            ResourceNm: '首页',
            ResourcePath: '/dashboard/analysis',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '1',
          },
          {
            ResourceNo: '200',
            ResourceNm: '用户管理',
            ResourcePath: '/DIYcompoment/table',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '2',
          },
          {
            ResourceNo: '300',
            ResourceNm: '公用组件',
            ResourcePath: '/DIYcompoment/commoncomponent',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '3',
          },
          {
            ResourceNo: '400',
            ResourceNm: '图表管理',
            ResourcePath: '/charts/orgtree',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '4',
          },
          {
            ResourceNo: '500',
            ResourceNm: '测试管理',
            ResourcePath: '/DIYcompoment/test',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '5',
          },
          {
            ResourceNo: '600',
            ResourceNm: '测试管理',
            ResourcePath: '/DIYcompoment/test1',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '6',
          },
          {
            ResourceNo: '700',
            ResourceNm: '测试管理',
            ResourcePath: '/DIYcompoment/test2',
            ResourceLvl: '1',
            ParentNo: '000000',
            IsLeaf: '1',
            ResourceOrd: '7',
          },
        ];
        setSessionStorage('Positions', JSON.stringify(roles));
        // setSessionStorage('000000', JSON.stringify(paths));
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      // 清除sessionstorage中所有信息
      clearAllSessionStorage();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            // search: stringify({
            //   redirect: window.location.href,
            // }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
