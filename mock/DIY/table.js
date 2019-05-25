// table数据模拟
const tableData = [];
for (let i = 0; i < 99; i++) {
  tableData.push({
    key: i,
    href: 'https://ant.design',
    name: `TradeCode ${i}`,
    title: `一个任务名称 ${i}`,
    owner: '曲丽丽',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 2,
    updatedAt: new Date(),
    createdAt: new Date(),
    progress: Math.ceil(Math.random() * 100),
  });
}
// 返回数据格式
const sendData = {
  ResponseHeader: {

  },
  ResponseBody: {
    dataSource: tableData,
    pagination: { pageSize: 10, total: 100, current: 1 },
  },
  fault: {
    faultCode: 'AAAAAAA',
    faultString: '请求成功',
  },
};

export default {
  'POST /api/getTableData': sendData,
};
