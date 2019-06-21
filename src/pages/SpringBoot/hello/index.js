import React from 'react';
import { getHelloWord, getUserData } from '@/utils/utils';
import { Card, Table } from 'antd';
import moment from 'moment';

class Hello extends React.Component {
  constructor() {
    super();
    this.state = {
      hello: '',
      userData: [],
    };
  }

  componentDidMount() {
    getHelloWord().then((response) => {
      this.setState({
        hello: response || '',
      });
    });
    getUserData().then((response) => {
      this.setState({ userData: response || [] });
    });
  }

  renderTable() {
    const { userData } = this.state;
    const columns = [
      {
        dataIndex: 'id',
        title: '编号',
        align: 'center',
      },
      {
        dataIndex: 'name',
        title: '名字',
        align: 'center',
      },
      {
        dataIndex: 'sex',
        title: '性别',
        align: 'center',
        render: (sex) => {
          if (sex === '1') {
            return '女';
          } else {
            return '男';
          }
        },
      },
      {
        dataIndex: 'idnumber',
        title: '号码',
        align: 'center',
      },
      {
        dataIndex: 'description',
        title: '介绍',
        align: 'center',
      },
      {
        dataIndex: 'birtdate',
        title: '生日',
        align: 'center',
        render: (birtdate) => {
          return moment(birtdate).format('YYYY-MM-DD');
        },
      },
    ];
    return (
      <Table
        dataSource={userData}
        columns={columns}
      />
    );
  }
  render() {
    const { hello } = this.state;
    return (
      <Card
        bordered
        title="Hello!SpringBoot"
      >
        <h1><strong>{hello}</strong></h1>
        {this.renderTable()}
      </Card>
    );
  }
}

export default Hello;
