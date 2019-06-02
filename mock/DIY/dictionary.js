// 数据字典数据==========后台字典数据设计
const dictionaryData = [
  {
    dictionaryCategoryNm: '证件类型', // 字典类型名
    dictionaryNm: '身份证', // 字典名
    dictionaryNo: '1', // 字典码
  },
  {
    dictionaryCategoryNm: '证件类型',
    dictionaryNm: '中国护照',
    dictionaryNo: '2',
  },
  {
    dictionaryCategoryNm: '证件类型',
    dictionaryNm: '军官证',
    dictionaryNo: '3',
  },
  {
    dictionaryCategoryNm: '证件类型',
    dictionaryNm: '士兵证',
    dictionaryNo: '4',
  },

];

// 返回数据格式
const sendData = {
  ResponseHeader: {

  },
  ResponseBody: {
    retCacheList: [{
      dictionaryCategoryNo: 'CERTFCT_TYPE', // 字典类型码
      dictionaries: dictionaryData,
    }],
  },
  fault: {
    faultCode: 'AAAAAAA',
    faultString: '请求成功',
  },
};


export default {
  'POST /api/com/cachebatchone': sendData,
};
