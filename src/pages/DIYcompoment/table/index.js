import React from 'react';
import { Table, Card, Button } from 'antd';
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
    const params = { pageSize: 10, pageNum: 1 };
    dispatch({
      type: 'table/getTableData',
      routeid,
      payload: { params },
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
  // 分页操作代码
  handleTablepage=(page, sorter, filters) => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const params = {
      pageSize: page.pageSize,
      pageNum: page.pageNum,
    };
    dispatch({
      type: 'able/getTableData',
      routeid,
      payload: params,
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

  // handleTurnPage=()=>{
  //   router.push('/');
  // }

  renderButton() {
    return <Button type="primary" onClick={this.handleTurnPage} style={{ marginBottom: '18px' }}>详情</Button>;
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
        title="table常用场景"
      >
        {this.renderButton()}
        <Table
          dataSource={dataSource}
          loading={tableLoading}
          columns={columns}
          pagination={getTablepag(pagination)}
          onChange={this.handleTablepage}
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
