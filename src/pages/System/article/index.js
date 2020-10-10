import React, { Fragment } from 'react';
import { Table, Card, Button, Radio, Form, Modal, Row, Col, DatePicker, InputNumber, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { createRouteid, getTablepag, getDicOptions, checkNull, getDicNameByKey, getHelloWord, isEmptyArray, isEmptyObject } from '@/utils/utils';
import { CcInput, CcSelect, CcMessege, CcButton, CcCard, Header, AdvancedForm } from '@/cc-comp/basic';
import { getFormItemLayout } from '@/utils/layout';
import { CcLoanSelect } from '@/cc-comp/biz';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = CcSelect;
const formItemLayout = getFormItemLayout(1);
const colLayout = getFormItemLayout(1);
const { Search } = Input;

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
          <Col>
            <FormItem label="编号" {...formItemLayout}>
              {getFieldDecorator('id', {
                initialValue: radiovalue && radiovalue.id,
              })(<CcInput placeholder="请输入" disabled />)}
              {getFieldDecorator('flag', {
                initialValue: 'update',
              })(<CcInput hidden />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: radiovalue && radiovalue.description,
              })(<CcInput.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: radiovalue && radiovalue.name,
              })(<CcInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col>
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
          <Col>
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
 * @date 2020-08-31
 * @class ArticleTable
 * @extends {React.Component}
 */
class ArticleTable extends React.Component {
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
      type: 'article/create',
      routeid,
    });

    const dicparams = [
      { dictionaryCategoryNo: 'article_category' },
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
      type: 'article/clear',
    });
  }

  initQuery = () => {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    const params = { pageSize: 10, pageNum: 1 };
    dispatch({
      type: 'article/getTableData',
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

  positionQuery = () => {
    const { dispatch } = this.props;
    const { routeid, page } = this.state;
    const params = { pageSize: page.pageSize, pageNum: page.current };
    dispatch({
      type: 'article/getTableData',
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
      type: 'article/getTableData',
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
        dispatch({
          type: 'article/addleData',
          routeid,
          payload: { ...values },
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
      type: 'article/addleData',
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

  headerLeft = () => {
    return [
      <Button type="primary" onClick={this.handleShowModal} style={{ marginBottom: '10px', marginRight: '10px' }}>新增</Button>
    ];
  }
  headerRight = () => {
    return <Search
      placeholder="请输入物料代码和物料组代码查询"
      // className={styles.btn}
      // onSearch={handleQuickSearch}
      allowClear
    />;
  };

  handleSearch = (formData) => {
    console.log(formData);
    // console.log(headerRef);
  }

  sureDelete(record) {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    dispatch({
      type: 'article/addleData',
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
        <Button type="primary" onClick={this.handleShowModal} style={{ marginBottom: '10px', marginRight: '10px' }}>新增</Button>
        {/* <CcButton
          type="primary"
          resourceNo="RES00000232"
          resourcePath={this.props.location.pathname}
          onClick={this.handleShowUpdateModal}
          style={{ marginBottom: '10px', marginRight: '10px' }}
        >
        更新
        </CcButton> */}
        {/* <CcButton
          type="danger"
          resourceNo="RES00000231"
          resourcePath={this.props.location.pathname}
          style={{ marginBottom: '10px' }}
        >
        删除
        </CcButton> */}
      </Fragment>
    );
  }

  renderAddModal() {
    const { visible, optionsData } = this.state;
    const {
      form: { getFieldDecorator },
      form,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title="新增文章"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        width="30%"
        footer={[
          <Button key="back" onClick={this.handleCancel} type="primary">
            返回
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col>
              <FormItem label="文章标题">
                {getFieldDecorator('articleTitle', {
                  rules: [{ required: true, message: '请输入文章标题' }],
                })(<CcInput.TextArea placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="文章链接">
                {getFieldDecorator('articleHref', {
                  rules: [{ required: true, message: '请输入文章链接' }],
                })(<CcInput placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <CcLoanSelect
              formItemLayout={
                {
                  labelCol: {
                    xs: { span: 24 },
                    sm: { span: 7 },
                    md: { span: 6 },
                  },
                  wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 17 },
                    md: { span: 18 },
                  },
                }
              }
              form={form}
              label="文章分类"
              placeholder="请输入文章分类"
              dicCode="article_category"
              field="articleCategory"
              options={optionsData.article_category}
              valueProp="dictionaryNo"
              titleProp="dictionaryNm"
              required
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
      // {
      //   dataIndex: 'id',
      //   title: '编号',
      //   align: 'center',
      // },
      {
        dataIndex: 'articleTitle',
        title: '文章标题',
        align: 'center',
      },
      {
        dataIndex: 'articleHref',
        title: '文章链接',
        align: 'center',
      },
      {
        dataIndex: 'articleCategory',
        title: '文章分类',
        align: 'center',
        render: (text) => {
          return text && getDicNameByKey(text, 'article_category', optionsData);
        },
      },
      // {
      //   dataIndex: 'opration',
      //   title: '链接',
      //   align: 'center',
      //   render: (index, record) => {
      //     return <a onClick={() => this.handleDelete(record)}>删除</a>;
      //   },
      // },
    ];
    // 高级查询配置
    const formItems = [
      // { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
      // { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
      // { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
      // { title: '环保管理人员', key: 'environmentAdminName', props: { placeholder: '输入申请人查询' } },
      // { title: '申请人', key: 'applyPersonName', props: { placeholder: '输入申请人查询' } },
      // { title: '状态', key: 'effectiveStatus', type: 'list', props: statusProps },
      // { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: distributionProps },
      // { title: '物料标记状态', key: 'assignSupplierStatus', type: 'list', props: materialStatus },
      // { title: '同步PDM状态', key: 'syncStatus', type: 'list', props: PDMStatus },
      { title: '书剑', key: 'time', type: 'rangePicker' },
      { title: '输入框', key: 'test' },
    ];
    return (
      <CcCard
        title="文章系列管理"
      >
        {/* <h1><span>{!isEmptyArray(data) ? data[0].userName : null}</span></h1> */}
        {/* this.renderButton() */}
        <Header
          left={this.headerLeft()}
          right={this.headerRight()}
          // ref={headerRef}
          // onRef={(ref) => this.LinedetailsRef = ref }
          content={<AdvancedForm formItems={formItems} onOk={this.handleSearch} />}
          advanced
        />
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
          rowKey={record => record.id}
        />
      </CcCard>
    );
  }
}

function mapStateToProps(state) {
  return {
    tableData: state.article,
    tableLoading: state.loading.effects['article/getTableData'],
  };
}

export default connect(mapStateToProps)(Form.create()(ArticleTable));
