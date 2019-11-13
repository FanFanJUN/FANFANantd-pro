import React from 'react';
import { getUserData, getTablepag } from '@/utils/utils';
import { Card, Table, Modal, Form, Row, Col } from 'antd';
import moment from 'moment';
import { getFormItemLayout } from '@/utils/layout';
import { CcInput } from '@/cc-comp/basic';

const FormItem = Form.Item;
class Hello extends React.Component {
  constructor() {
    super();
    this.state = {
      userData: [],
      pagination: {},
      loading: true,
      visible: false,
      record: {},
    };
  }

  componentDidMount() {
    /** 查询table表数据 */
    const params = { pageSize: 10, pageNum: 1 };
    getUserData(params).then((response) => {
      const { pagination, dataSource } = response;
      this.setState({
        userData: dataSource || [],
        pagination: pagination || {},
      });
      this.setState({ loading: false });
    });
  }

   /**
    * @description 分页操作
    * @memberof Hello
    */
   handleTablepage=(page, sorter, filters) => {
     const params = {
       pageSize: page.pageSize,
       pageNum: page.current,
     };
     getUserData(params).then((response) => {
       const { pagination, dataSource } = response;
       this.setState({
         userData: dataSource || [],
         pagination: pagination || {},
       });
       this.setState({ loading: false });
     });
   }

   handleShowDeatil=(record) => {
     this.setState({ visible: true, record });
   }

   handleOk = () => {
     this.setState({
       visible: false,
     });
   };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  renderTable() {
    const { userData, pagination } = this.state;
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
        dataIndex: 'birthdate',
        title: '生日',
        align: 'center',
        render: (birthdate) => {
          return birthdate && moment(birthdate).format('YYYY-MM-DD');
        },
      },
      {
        dataIndex: 'opration',
        title: '链接',
        align: 'center',
        render: (index, record) => {
          return <a onClick={() => this.handleShowDeatil(record)}>详情</a>;
        },
      },
    ];
    return (
      <Table
        dataSource={userData}
        columns={columns}
        loading={this.state.loading}
        pagination={getTablepag(pagination)}
        onChange={this.handleTablepage}
      />
    );
  }

  renderModalDetail() {
    const { visible, record } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = getFormItemLayout(1);
    const colLayout = getFormItemLayout(2);
    return (
      <Modal
        title="用户详情"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Row>
          <Col {...colLayout}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: record && record.name,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="号码" {...formItemLayout}>
              {getFieldDecorator('idnumber', {
                initialValue: record && record.idnumber,
              })(
                <CcInput placeholder="请输入" disabled />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }

  render() {
    return (
      <Card
        bordered
        title="SpringBoot连接后台测试"
      >
        {this.renderTable()}
        {this.renderModalDetail()}
        {/* this.renderModalAdd() */}
      </Card>
    );
  }
}

export default Form.create()(Hello);
