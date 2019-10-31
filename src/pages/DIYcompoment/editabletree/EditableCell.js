import React from 'react';
import { Input, InputNumber, Form } from 'antd';
import { EditabletreeContext } from './TableContext';
import { CcInput } from '@/cc-comp/basic';
import './index.css';

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

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
        if (rule.field === 'amount') {
          if (value < record[dataIndex]) {
            callback(`输入金额必须大于原有金额${record[dataIndex]}`);
          }
        }
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback();
    }

    renderCell = form => {
      this.form = form;
      const { children, dataIndex, record, title } = this.props;
      const { editing } = this.state;
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            validateFirst: true,
            rules: [
              {
                required: true,
                message: `请输入${title}`,
              },
              // {
              //   validator: this.validatorRule,
              // },
            ],
            initialValue: record[dataIndex],
          })(<InputNumber ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    };

    render() {
      const {
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
      } = this.props;
      let editable = false;
      /** 授信额度这一列可修改且只有最底层可更改 */
      if (dataIndex === 'amount') {
        if (record.children) {
          editable = false;
        } else {
          editable = true;
        }
      }
      return (
        <td {...restProps}>
          {editable ? (
            <EditabletreeContext.Consumer>{this.renderCell}</EditabletreeContext.Consumer>
          ) : (
            children
          )}
        </td>
      );
    }
}

export default EditableCell;
