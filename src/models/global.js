/* eslint-disable consistent-return */
import { queryNotices, getDescendantMenu } from '@/services/api';
import { getSessionStorage, setSessionStorage } from '@/utils/storage';
import { isEmptyArray, parseMenuData } from '@/utils/utils';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }));
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    *getDescendantMenu({ payload }, { put, call }) {
      // 先从sessionStorage中获取
      const cacheMenus = getSessionStorage(payload.ResourceNo);
      if (!isEmptyArray(JSON.parse(cacheMenus))) {
        yield put({
          type: 'saveDescendantMenu',
          payload: {
            resourceLvl: payload.resourceLvl,
            parentNo: payload.parentNo,
            descendantMenu: cacheMenus,
          },
        });
      } else {
        // sessionStorage中没有  则获取后台数据 存进sessionStorage
        const descendantMenu = yield call(getDescendantMenu, payload);
        yield put({
          type: 'saveDescendantMenu',
          payload: {
            resourceLvl: payload.resourceLvl,
            parentNo: payload.parentNo,
            descendantMenu: cacheMenus,
          },
        });
        setSessionStorage(payload.parentNo, descendantMenu && JSON.stringify(descendantMenu.data));
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveDescendantMenu(state, { payload }) {
      if (payload.resourceLvl === '1') {
        return {
          ...state,
          firstMenu: payload.descendantMenu ?
            parseMenuData(payload.descendantMenu, payload.parentNo) : [],
          secMenus: [],
          thirdMenus: [],
        };
      } else if (payload.resourceLvl === '2') {
        return {
          ...state,
          secMenus: payload.descendantMenu ?
            parseMenuData(payload.descendantMenu, payload.parentNo) : [],
        };
      } else if (payload.resourceLvl === '3') {
        return {
          ...state,
          thirdMenus: payload.descendantMenu ?
            parseMenuData(payload.descendantMenu, payload.parentNo) : [],
        };
      }
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
