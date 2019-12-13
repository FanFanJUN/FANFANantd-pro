import React, { Fragment } from 'react';
import { Table, Card, Button, Radio, Form, Modal, Row, Col, DatePicker, InputNumber, Switch, PageHeader } from 'antd';
import { connect } from 'dva';
import { createRouteid, getTablepag, getDicOptions, isEmptyObject } from '@/utils/utils';
import moment from 'moment';
import { CcInput, CcSelect, CcMessege, CcCard, CcButton } from '@/cc-comp/basic';
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
            <FormItem label="系统编号" {...formItemLayout}>
              {getFieldDecorator('systemNo', {
                initialValue: radiovalue && radiovalue.systemNo,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="字典编号" {...formItemLayout}>
              {getFieldDecorator('dictionaryNo', {
                initialValue: radiovalue && radiovalue.dictionaryNo,
              })(<CcInput disabled />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="字典名称" {...formItemLayout}>
              {getFieldDecorator('dictionaryNm', {
                initialValue: radiovalue && radiovalue.dictionaryNm,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="字典类别编号" {...formItemLayout}>
              {getFieldDecorator('dictionaryCategoryNo', {
                initialValue: radiovalue && radiovalue.dictionaryCategoryNo,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="字典类别名称" {...formItemLayout}>
              {getFieldDecorator('dictionaryCategoryNm', {
                initialValue: radiovalue && radiovalue.dictionaryCategoryNm,
                rules: [
                  { required: true, message: '请输入字典类别名称' },
                ],
              })(<CcInput placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="级别编号" {...formItemLayout}>
              {getFieldDecorator('levelNo', {
                initialValue: radiovalue && radiovalue.levelNo,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="字典顺序" {...formItemLayout}>
              {getFieldDecorator('sequenceNum', {
                initialValue: radiovalue && radiovalue.levelNo,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});


/**
 * @description 角色菜单
 * @author LC@1981824361
 * @date 2019-12-13
 * @class RoleTable
 * @extends {React.Component}
 */
class RoleTable extends React.Component {
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
      type: 'role/create',
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
      type: 'role/clear',
    });
  }

  initQuery = () => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const params = { pageSize: 10, pageNum: 1 };
    dispatch({
      type: 'role/getTableData',
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
      type: 'role/getTableData',
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
      type: 'role/getTableData',
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

  handleChange=(record) => {
    const statusFlag = record && record.statusFlag === '1' ? '2' : '1';
    const params = { ...record, statusFlag };
    this.handleUpdate(params);
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
        dispatch({
          type: 'role/addleData',
          routeid,
          payload: { ...values, statusFlag: '2', deleteFlag: '2' },
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
    const { routeid, radiovalue } = this.state;
    const maintenanceDate = moment(new Date()).format('YYYYMMDD');
    dispatch({
      type: 'role/addleData',
      routeid,
      payload: { maintenanceDate, statusFlag: radiovalue.statusFlag, deleteFlag: radiovalue.deleteFlag, flag: 'update', ...fieldsValue },
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
      content: `确定要删除【字典类别】为${record && record.dictionaryCategoryNm}【字典编号】为${record && record.dictionaryNo}吗`,
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
      type: 'role/addleData',
      routeid,
      payload: { ...record, flag: 'delete' },
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
        <CcButton type="primary" onClick={this.handleShowModal} style={{ marginBottom: '18px', marginRight: '10px' }}>新增</CcButton>
        <CcButton type="primary" onClick={this.handleShowUpdateModal} style={{ marginBottom: '18px', marginRight: '10px' }}>更新</CcButton>
        <CcButton type="primary" onClick={this.handleShowUpdateModal} style={{ marginBottom: '18px', marginRight: '10px' }}>已分配人员</CcButton>
        <CcButton type="danger" onClick={this.handleShowUpdateModal} style={{ marginBottom: '18px' }}>删除</CcButton>
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
        title="字典新增"
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
              <FormItem label="系统编号" {...formItemLayout}>
                {getFieldDecorator('systemNo', {
                  initialValue: 'FanFan',
                  rules: [
                    { required: true, message: '请输入系统编号' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label="字典编号" {...formItemLayout}>
                {getFieldDecorator('dictionaryNo', {
                  rules: [
                    { required: true, message: '请输入字典编号' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="字典名称" {...formItemLayout}>
                {getFieldDecorator('dictionaryNm', {
                  rules: [
                    { required: true, message: '请输入字典名称' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label="字典类别编号" {...formItemLayout}>
                {getFieldDecorator('dictionaryCategoryNo', {
                  rules: [
                    { required: true, message: '请输入字典类别编号' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="字典类别名称" {...formItemLayout}>
                {getFieldDecorator('dictionaryCategoryNm', {
                  rules: [
                    { required: true, message: '请输入字典类别名称' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <FormItem label="级别编号" {...formItemLayout}>
                {getFieldDecorator('levelNo', {
                  rules: [
                    { required: true, message: '请输入字典级别编号' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="字典顺序" {...formItemLayout}>
                {getFieldDecorator('sequenceNum', {
                  rules: [
                    { required: true, message: '请输入字典顺序' },
                  ],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
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
        dataIndex: 'dictionaryNo',
        title: '字典编号',
        align: 'center',
      },
      {
        dataIndex: 'dictionaryNm',
        title: '字典名字',
        align: 'center',
      },
      {
        dataIndex: 'dictionaryCategoryNo',
        title: '字典类别编号',
        align: 'center',
      },
      {
        dataIndex: 'dictionaryCategoryNm',
        title: '字典类别名字',
        align: 'center',
      },
      {
        dataIndex: 'levelNo',
        title: '级别编号',
        align: 'center',
      },
      {
        dataIndex: 'sequenceNum',
        title: '顺序数量',
        align: 'center',
      },
      {
        dataIndex: 'statusFlag',
        title: '状态标志',
        align: 'center',
        render: (statusFlag, record) => {
          return (
            <Switch checkedChildren="有效" unCheckedChildren="失效" checked={statusFlag === '1'} onChange={() => this.handleChange(record)} />
          );
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
      <Fragment>
        <Row gutter={20}>
          <Col span={16}>
            <CcCard>
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
            </CcCard>
          </Col>
          <Col span={8}>
            <CcCard>
              <PageHeader
                style={{
                  border: '1px solid rgb(235, 237, 240)',
                }}
                title="资源分配"
              >
                <span><strong>请先选择角色</strong></span>
              </PageHeader>
            </CcCard>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    tableData: state.role,
    tableLoading: state.loading.effects['role/getTableData'],
  };
}

export default connect(mapStateToProps)(Form.create()(RoleTable));
