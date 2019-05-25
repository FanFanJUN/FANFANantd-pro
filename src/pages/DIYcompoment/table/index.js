import React from 'react';
import { Table, Card } from 'antd';
import { connect } from 'dva';
import { createRouteid, getTablepag } from '@/utils/utils';
import moment from 'moment';

class DiyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routeid: createRouteid(),
      dataSource: [],
      pagination: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    dispatch({
      type: 'table/create',
      routeid,
    });
    dispatch({
      type: 'table/getTableData',
      routeid,
      payload: {},
    }).then(() => {
      const { tableData } = this.props;
      if (tableData[routeid] == null) {
        return;
      }
      const { dataSource, pagination } = tableData[routeid];
      this.setState({
        dataSource,
        pagination,
      });
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'table/clear',
    });
  }

  render() {
    const { dataSource, pagination } = this.state;
    const { tableLoading } = this.props;
    // key: i,
    // href: 'https://ant.design',
    // name: `TradeCode ${i}`,
    // title: `一个任务名称 ${i}`,
    // owner: '曲丽丽',
    // callNo: Math.floor(Math.random() * 1000),
    // status: Math.floor(Math.random() * 10) % 2,
    // updatedAt: new Date(),
    // createdAt: new Date(),
    // progress: Math.ceil(Math.random() * 100),
    const columns = [
      {
        title: '主键',
        dataIndex: 'key',
        align: 'center',
      },
      {
        title: '连接',
        dataIndex: 'href',
        align: 'center',
      },
      {
        title: '名字',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '任务名字',
        dataIndex: 'title',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        align: 'center',
        render: (createdAt) => {
          return moment(createdAt).format('YYYY-MM-DD');
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        align: 'center',
        render: (updatedAt) => {
          return moment(updatedAt).format('YYYY-MM-DD');
        },
      },
      {
        title: '进程度',
        align: 'center',
        dataIndex: 'progress',
      },
    ];
    return (
      <Card
        title="table测试对model的封装"
      >
        <Table
          dataSource={dataSource}
          loading={tableLoading}
          columns={columns}
          pagination={getTablepag(pagination)}
        />
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    tableData: state.table,
    tableLoading: state.loading.effects['table/getTableData'],
  };
}

export default connect(mapStateToProps)(DiyTable);
