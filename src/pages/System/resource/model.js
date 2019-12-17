import { getTreeData, addleData, getButtonTableData } from '@/services/resource';
import { isRespSucc, showErrorMsg } from '@/utils/utils';

const initState = {
  dataSource: [],
};
export default {
  namespace: 'resource',

  state: { },

  effects: {
    *create({ routeid }, { put }) {
      yield put({
        type: 'createState',
        routeid,
      });
    },
    *clear(_, { put }) {
      yield put({
        type: 'clearState',
      });
    },
    *getTreeData({ routeid, payload }, { call, put }) {
      // 请求service
      const response = yield call(getTreeData, payload);
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      const { data } = response;
      yield put({
        type: 'saveState',
        routeid,
        payload: {
          dataSource: data, // 返回页面的数据
        },
      });
    },
    *getButtonTableData({ routeid, payload }, { call, put }) {
      // 请求service
      const response = yield call(getButtonTableData, payload);
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      const { data: { dataSource, pagination } } = response;
      yield put({
        type: 'saveState',
        routeid,
        payload: {
          dataSource, // 返回页面的数据
          pagination,
        },
      });
    },
    *addleData({ routeid, payload }, { call, put }) {
      const response = yield call(addleData, payload);
      if (!isRespSucc(response)) {
        showErrorMsg(response);
      }
      const { message, code } = response;
      yield put({
        type: 'saveState',
        routeid,
        payload: {
          message,
          code,
        },
      });
    },
  },

  reducers: {
    createState(_, { routeid }) {
      const newState = {};
      newState[routeid] =
       JSON.prase(JSON.stringify(initState));
      return newState;
    },
    saveState(state, { routeid, payload }) {
      const newState = { ...state };
      newState[routeid] =
       { ...state[routeid], ...payload };
      return newState;
    },
    clearState() {
      return {};
    },
  },
};
