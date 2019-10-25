import React from 'react';
import { Input, InputNumber, Form } from 'antd';
import { EditableContext } from './TableContext';
import { CcInput } from '@/cc-comp/basic';

const FormItem = Form.Item;

class EditableCell extends React.Component {
    getInput = () => {
      const { inputType } = this.props;
      if (inputType === 'number') {
        return <InputNumber />;
      }
      return <CcInput />;
    };

    /** 自定义校验 */
    validatorRule=(rule, value, callback) => {
      // const { getFieldValue } = this.props.form
      //   if (value && value !== getFieldValue('newPassword')) {
      //       callback('两次输入不一致！')
      //   }
      const { record, dataIndex } = this.props;
      if (rule) {
        if (rule.field === 'age') {
          if (value < record[dataIndex]) {
            callback(`输入年龄必须大于原有年龄${record[dataIndex]}`);
          }
        }
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback();
    }

    renderCell = (form) => {
      // 获取单元格属性
      const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <td {...restProps}>
          {editing ? (
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: `请输入${title}!`,
                  },
                  {
                    validator: this.validatorRule,
                  },
                ],
                initialValue: record[dataIndex],
              })(this.getInput())}
            </FormItem>
          ) : (
            children
          )}
        </td>
      );
    };

    render() {
      return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

export default EditableCell;
