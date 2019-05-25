import { getTableData } from '@/services/api';
import { isRespSucc, showErrorMsg } from '@/utils/utils';

// c测试封装model对数据的获取
const initState = {
  dataSource: [],
};
export default {
  namespace: 'table',

  state: { },

  effects: {
    *create({ routeid }, { put }) {
      yield put({
        type: 'createState',
        routeid,
      });
    },
    *clear({ routeid }, { put }) {
      yield put({
        type: 'clearState',
        routeid,
      });
    },
    *getTableData({ routeid, payload }, { call, put }) {
      // 请求service
      const response = yield call(getTableData, payload);
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      const { ResponseBody: { dataSource, pagination } } = response;
      console.log(response);
      yield put({
        type: 'saveState',
        routeid,
        payload: {
          dataSource, // 返回页面的数据
          pagination,
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
