import React from 'react';
import { Table, Card, Button, Radio } from 'antd';
import { connect } from 'dva';
import { createRouteid, getTablepag, getDicOptions, checkNull, getDicNameByKey, getHelloWord, isEmptyArray } from '@/utils/utils';
import moment from 'moment';

const RadioGroup = Radio.Group;
class DiyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routeid: createRouteid(),
      dataSource: [],
      pagination: {},
      optionsData: {},
      radiovalue: {},
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    dispatch({
      type: 'table/create',
      routeid,
    });

    const dicparams = [
      { dictionaryCategoryNo: 'CERTFCT_TYPE' },
    ];

    /* 获取数据字典 */
    getDicOptions(dicparams).then((response) => {
      this.setState({ optionsData: response || {} });
    });

    // getHelloWord().then((result) => {
    //   this.setState({ data: result });
    // });
    this.initQuery();
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'table/clear',
    });
  }

  initQuery=() => {
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
  // 分页操作代码
  handleTablepage=(page, sorter, filters) => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const params = {
      pageSize: page.pageSize,
      pageNum: page.pageNum,
    };
    dispatch({
      type: 'table/getTableData',
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

  onChange=(e) => {
    this.setState({ radiovalue: e.target.value });
  }

  /* 选中一行 */
  onRowClick=(record) => {
    this.setState({
      radiovalue: record,
    });
  }
  renderButton() {
    return <Button type="primary" onClick={this.handleTurnPage} style={{ marginBottom: '18px' }}>详情</Button>;
  }

  render() {
    const { dataSource, pagination, optionsData, radiovalue, data } = this.state;
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
        title: '选择',
        dataIndex: 'action',
        // align: 'center',
        // width: '5%',
        render: (text, record) => {
          return (
            <RadioGroup onChange={this.onChange} value={radiovalue}>
              <Radio value={record} />
            </RadioGroup>
          );
        },
      },
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
        title: '证件类型',
        dataIndex: 'certfctType',
        align: 'center',
        render: (certfctType) => {
          if (checkNull(certfctType)) {
            return;
          }
          // eslint-disable-next-line consistent-return
          return getDicNameByKey(certfctType, 'CERTFCT_TYPE', optionsData);
        },
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
        {/* <h1><span>{!isEmptyArray(data) ? data[0].userName : null}</span></h1> */}
        {this.renderButton()}
        <Table
          dataSource={dataSource}
          loading={tableLoading}
          columns={columns}
          pagination={getTablepag(pagination)}
          onChange={this.handleTablepage}
          onRow={(record) => {
            return {
              onClick: () => {
                this.onRowClick(record);
              },
            };
          }}
          rowClassName={() => {
            return 'bounce';
          }}
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
