/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-09-18 17:58:57
 * @LastEditTime: 2020-09-23 15:56:23
 * @Description:  高级查询表单组件 可拓展其他表单元素组件
 * @FilePath: /FANFANantd/src/cc-comp/basic/AdvancedForm/index.js
 */
import React from 'react';
import { Button, Row, Col, Form, Input, DatePicker } from 'antd';
// import { MixinSelect, ComboMultiple } from '@/components';
// import {
//   ComboGrid,
//   ComboList,
//   ComboTree
// } from 'suid'
import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Combos = {
  // grid: ComboGrid,
  // list: ComboList,
  // tree: ComboTree,
  // searchTable: ComboGrid,
  // multiple: ComboMultiple,
  // select: MixinSelect,
  // selectTree: ComboTree,
  rangePicker: RangePicker,
};

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function AdvancedForm({
  formItems = [],
  onOk = () => null,
  form = {},
}) {
  const {
    getFieldDecorator,
    resetFields,
    validateFields,
  } = form;
  function handleSubmit() {
    validateFields((err, val) => {
      if (!err) {
        onOk(val);
      }
    });
  }
  function handleReset() {
    resetFields();
  }
  return (
    <div>
      <Row>
        {
          formItems.map((item, index) => {
            const Item = Combos[item.type] || Input;
            if (!!item.type && item.type !== 'rangePicker') {
              return (
                <Col
                  key={`${item.key}-${index}`}
                  span={8}
                >
                  <FormItem style={{ width: '100%' }} label={item.title} {...formLayout}>
                    {
                      getFieldDecorator(`${item.key}`),
                      getFieldDecorator(`${item.key}_name`)(
                        <Item
                          form={form}
                          {...item.props}
                          name={`${item.key}_name`}
                          field={[item.key]}
                        />
                      )
                    }
                  </FormItem>
                </Col>
              );
            }
            return (
              <Col
                key={`${item.key}-${index}`}
                span={8}
              >
                <FormItem style={{ width: '100%' }} label={item.title} {...formLayout}>
                  {
                    getFieldDecorator(`${item.key}`)(
                      <Item
                        form={form}
                        {...item.props}
                        name={`${item.key}`}
                        field={[item.key]}
                      />
                    )
                  }
                </FormItem>
              </Col>
            );
          })
        }
      </Row>
      <div className={styles.btnWrapper}>
        <Button onClick={handleReset} className={styles.btns}>重置</Button>
        <Button type="primary" onClick={handleSubmit} className={styles.btns}>查询</Button>
      </div>
    </div>
  );
}
export default Form.create()(AdvancedForm);
