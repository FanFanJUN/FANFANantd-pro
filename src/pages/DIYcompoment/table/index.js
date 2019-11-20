import React, { Fragment } from 'react';
import { Table, Card, Button, Radio, Form, Modal, Row, Col, DatePicker, InputNumber } from 'antd';
import { connect } from 'dva';
import { createRouteid, getTablepag, getDicOptions, checkNull, getDicNameByKey, getHelloWord, isEmptyArray, isEmptyObject } from '@/utils/utils';
import moment from 'moment';
import { CcInput, CcSelect, CcMessege } from '@/cc-comp/basic';
import { getFormItemLayout } from '@/utils/layout';
import { CcLoanSelect } from '@/cc-comp/biz';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = CcSelect;
const formItemLayout = getFormItemLayout(1);
const colLayout = getFormItemLayout(2);

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, form: { getFieldDecorator }, optionsData,
    handleUpdate, handleModalVisible, radiovalue } = props;
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      title="用户更新"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={handleModalVisible}
      destroyOnClose
      footer={[
        <Button key="back" onClick={handleModalVisible} type="primary">
          返回
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确定更新
        </Button>,
      ]}
    >
      <Form>
        <Row>
          <Col {...colLayout}>
            <FormItem label="编号" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: radiovalue && radiovalue.id,
              })(<CcInput placeholder="请输入" disabled />)}
              {getFieldDecorator('flag', {
                initialValue: 'update',
              })(<CcInput hidden />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: radiovalue && radiovalue.description,
              })(<CcInput.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: radiovalue && radiovalue.name,
              })(<CcInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="号码" {...formItemLayout}>
              {getFieldDecorator('idnumber', {
                initialValue: radiovalue && radiovalue.idnumber,
                rules: [
                  { required: true, message: '请输入号码' },
                ],
              })(
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="生日" {...formItemLayout}>
              {getFieldDecorator('birthdate', {
                initialValue: radiovalue && moment(radiovalue.birthdate),
                rules: [
                  { required: true, message: '请选择生日' },
                ],
              })(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <CcLoanSelect
            columnLayout={2}
            columnIndex={1}
            form={form}
            label="性别"
            placeholder="请输入性别"
            dicCode="SEX"
            field="sex"
            initialValue={radiovalue && radiovalue.sex}
            options={optionsData.SEX}
            valueProp="dictionaryNo"
            titleProp="dictionaryNm"
          // ChooseFlag
          />
        </Row>
      </Form>
    </Modal>
  );
});
/**
 * @description 标准的列表查询
 * @author LC@1981824361
 * @date 2019-09-02
 * @class DiyTable
 * @extends {React.Component}
 */
class DiyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routeid: createRouteid(),
      dataSource: [],
      pagination: {},
      optionsData: {},
      radiovalue: {},
      page: {},
      visible: false,
      updateVisible: false,
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
      { dictionaryCategoryNo: 'SEX' },
      { dictionaryCategoryNo: 'YES_OR_NO' },
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

  initQuery = () => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const params = { pageSize: 10, pageNum: 1 };
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

  positionQuery=() => {
    const { dispatch } = this.props;
    const { routeid, page } = this.state;
    const params = { pageSize: page.pageSize, pageNum: page.current };
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
  // 分页操作代码
  handleTablepage = (page, sorter, filters) => {
    const { dispatch } = this.props;
    const { routeid, radiovalue } = this.state;
    if (radiovalue) {
      this.setState({ radiovalue: {} });
    }
    this.setState({ page });
    const params = {
      pageSize: page.pageSize,
      pageNum: page.current,
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

  onChange = (e) => {
    this.setState({ radiovalue: e.target.value });
  }

  /* 选中一行 */
  onRowClick = (record) => {
    this.setState({
      radiovalue: record,
    });
  }

  handleShowModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false, updateVisible: false });
  }

  handleShowUpdateModal = () => {
    const { radiovalue } = this.state;
    if (isEmptyObject(radiovalue)) {
      CcMessege.info('请先选择一条有效信息!');
      return;
    }
    this.setState({ updateVisible: true });
  }

  handleOk = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { routeid, radiovalue } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      if (!err) {
        const birthdate = values && moment(values.birthdate).format('YYYYMMDD');
        dispatch({
          type: 'table/addleData',
          routeid,
          payload: { ...values, birthdate },
        }).then(() => {
          const { tableData } = this.props;
          if (tableData[routeid] == null) {
            return;
          }
          const { message, code } = tableData[routeid];
          if (code === 200) {
            CcMessege.success(message);
            this.setState({ visible: false });
            if (radiovalue) {
              this.setState({ updateVisible: false, radiovalue: {} });
            }
            this.initQuery();
          }
        });
      }
    });
  }

  handleUpdate = (fieldsValue) => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const birthdate = fieldsValue && moment(fieldsValue.birthdate).format('YYYYMMDD');
    dispatch({
      type: 'table/addleData',
      routeid,
      payload: { ...fieldsValue, birthdate },
    }).then(() => {
      const { tableData } = this.props;
      if (tableData[routeid] == null) {
        return;
      }
      const { message, code } = tableData[routeid];
      if (code === 200) {
        CcMessege.success(message);
        this.setState({ visible: false });
        this.setState({ updateVisible: false, radiovalue: {} });
        this.positionQuery();
      }
    });
  }

  handleDelete = (record) => {
    Modal.confirm({
      content: `确定要删除${record && record.name}吗`,
      onOk: () => {
        this.sureDelete(record);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  sureDelete(record) {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    dispatch({
      type: 'table/addleData',
      routeid,
      payload: { id: record.id, flag: 'delete' },
    }).then(() => {
      const { tableData } = this.props;
      if (tableData[routeid] == null) {
        return;
      }
      const { message, code } = tableData[routeid];
      if (code === 200) {
        CcMessege.success(message);
        this.positionQuery();
      }
    });
  }
  renderButton() {
    return (
      <Fragment>
        <Button type="primary" onClick={this.handleShowModal} style={{ marginBottom: '18px', marginRight: '10px' }}>新增</Button>
        <Button type="primary" onClick={this.handleShowUpdateModal} style={{ marginBottom: '18px' }}>更新</Button>
      </Fragment>
    );
  }

  renderAddModal() {
    const { visible, optionsData } = this.state;
    const {
      form: { getFieldDecorator },
      form,
    } = this.props;
    return (
      <Modal
        title="用户新增"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel} type="primary">
            返回
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form>
          <Row>
            <Col {...colLayout}>
              <FormItem label="描述" {...formItemLayout}>
                {getFieldDecorator('description', {
                })(<CcInput.TextArea placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label="姓名" {...formItemLayout}>
                {getFieldDecorator('name', {
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="号码" {...formItemLayout}>
                {getFieldDecorator('idnumber', {
                  rules: [
                    { required: true, message: '请输入号码' },
                  ],
                })(
                  <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label="生日" {...formItemLayout}>
                {getFieldDecorator('birthdate', {
                  rules: [
                    { required: true, message: '请选择生日' },
                  ],
                })(
                  <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                )}
              </FormItem>
            </Col>
            {/* <Col {...colLayout}>
              <FormItem label="性别" {...formItemLayout}>
                {getFieldDecorator('sex', {
                  rules: [
                    { required: true, message: '请选择性别' },
                  ],
                })(
                  <CcSelect placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">男</Option>
                    <Option value="1">女</Option>
                  </CcSelect>
                )}
              </FormItem>
            </Col> */}
            <CcLoanSelect
              columnLayout={2}
              columnIndex={1}
              form={form}
              label="性别"
              placeholder="请输入性别"
              dicCode="SEX"
              field="sex"
              options={optionsData.SEX}
              valueProp="dictionaryNo"
              titleProp="dictionaryNm"
            // ChooseFlag
            />
          </Row>
        </Form>
      </Modal>
    );
  }

  render() {
    const { dataSource, pagination, optionsData, radiovalue, updateVisible } = this.state;
    const { tableLoading } = this.props;
    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleCancel,
    };
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
          // if (sex === '1') {
          //   return '女';
          // } else {
          //   return '男';
          // }
          return sex && getDicNameByKey(sex, 'SEX', this.state.optionsData);
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
          return <a onClick={() => this.handleDelete(record)}>删除</a>;
        },
      },
    ];
    return (
      <Card
        title="table常用场景"
      >
        {/* <h1><span>{!isEmptyArray(data) ? data[0].userName : null}</span></h1> */}
        {this.renderButton()}
        {this.renderAddModal()}
        {/* this.renderUpdateModal() */}
        <UpdateForm
          {...parentMethods}
          modalVisible={updateVisible}
          optionsData={optionsData}
          radiovalue={radiovalue}
        />
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

export default connect(mapStateToProps)(Form.create()(DiyTable));
