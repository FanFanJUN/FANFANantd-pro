import React from 'react';
import { Modal, Button, Form, Row, Col, InputNumber } from 'antd';
import { getFormItemLayout } from '@/utils/layout';
import { CcInput } from '@/cc-comp/basic';
import { CcLoanSelect } from '@/cc-comp/biz';
import { getEllipsis } from '@/utils/utils';

const FormItem = Form.Item;
const colLayout = getFormItemLayout(3);
const formItemLayout = getFormItemLayout(1);

class AddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedValue: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getValuePath(resourcePath, resourceLvl) {
    switch (resourceLvl) {
      case '1':
        return `${resourcePath}/*`;
      case '2':
        return `${resourcePath}/*/*`;
      case '3':
        return `${resourcePath}/*/*/*`;
      default:
        break;
    }
  }

  handleSelect=(value) => {
    this.setState({ selectedValue: value });
  }

  renderForm() {
    const { form: { getFieldDecorator }, data, optionsData, form, flag } = this.props;
    const { selectedValue } = this.state;
    return (
      <Form>
        <Row>
          <Col {...colLayout}>
            <FormItem label="父节点资源编号" {...formItemLayout}>
              {getFieldDecorator('parentNo', {
                initialValue: flag ? '000000' : data && data.resourceNo,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
          {flag ? null : <Col {...colLayout}>
            <FormItem label={getEllipsis('当前节点资源编号', 6)} {...formItemLayout}>
              {getFieldDecorator('xx', {
                initialValue: data && data.resourceNo,
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
                         </Col>}
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="资源编号" {...formItemLayout}>
              {getFieldDecorator('resourceNo', {
                initialValue: flag ? 'RES00000*' : data && `${data.resourceNo}**`,
                rules: [
                  { required: true, message: '请输入资源编号' },
                ],
              })(<CcInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="资源名称" {...formItemLayout}>
              {getFieldDecorator('resourceNm', {
                rules: [
                  { required: true, message: '请输入资源名称' },
                ],
              })(<CcInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <CcLoanSelect
            columnLayout={3}
            columnIndex={1}
            form={form}
            label="资源类型"
            valueProp="dictionaryNo"
            titleProp="dictionaryNm"
            // initialValue="0"
            field="resourceTp"
            options={optionsData.RESOURCE_TYPE}
            // onSelect={this.handleSelect}
            required
          />
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="资源路径" {...formItemLayout}>
              {getFieldDecorator('resourcePath', {
                initialValue: data && this.getValuePath(data.resourcePath, data.resourceLvl),
                rules: [
                  { required: true, message: '请输入资源路径' },
                ],
              })(<CcInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="资源层级" {...formItemLayout}>
              {getFieldDecorator('resourceLvl', {
                initialValue: flag ? '1' : data && (Number(data.resourceLvl) + 1),
                rules: [
                  { required: true, message: '请输入资源层级' },
                ],
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="资源顺序" {...formItemLayout}>
              {getFieldDecorator('resourceOrd', {
                rules: [
                  { required: true, message: '请输入资源顺序' },
                ],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <FormItem label="系统编号" {...formItemLayout}>
              {getFieldDecorator('sysId', {
                initialValue: 'TEST',
                rules: [
                  { required: true, message: '请输入字典级别编号' },
                ],
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
          <CcLoanSelect
            columnLayout={3}
            columnIndex={1}
            form={form}
            label="是否叶子节点"
            valueProp="dictionaryNo"
            titleProp="dictionaryNm"
            field="isLeaf"
            options={optionsData.YES_OR_NO}
            required
          />
        </Row>
      </Form>
    );
  }

  render() {
    const { visible, handleAddOk, handleAddCancel, saveForm, form, flag } = this.props;
    saveForm(form); // 把当前form属性传递到主页面
    return (
      <Modal
        title={flag ? '根节点新增' : '节点新增'}
        visible={visible}
        width={800}
        // onOk={this.handleOk}
        onCancel={handleAddCancel}
        destroyOnClose
        footer={[
          <Button key="back" onClick={handleAddCancel} type="primary">
         返回
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddOk}>
         确定新增
          </Button>,
        ]}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}

export default Form.create()(AddModal);
