/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { getFormItemLayout } from '@/utils/layout';
import { Col, Form, InputNumber } from 'antd';

/**
 * @description 金钱输入组件
 * 根据输入内容进行规制校验
 * 校验规制1：设置必输时必须输入
 * 校验规制2：输入内容必须为数字，小数位数默认为2位，可通过参数指定小数位数
 * @author LC@1981824361
 * @date 2019-09-03
 * @param columnLayout 一行显示几列
 * @param columnIndex显示的顺序，摆放的列序号
 * @param form={form} 必传 form表单属性
 * @param label：标签文本
 * @param placeholder="请输入证件类型" 选择框默认文字
 * @param dicCode="CERTFCT_TYPE" 数据字典类型编码
 * @param field="xx" 必传 form表单中属性值
 * @param required 是否必须
 * @param disabled 是否禁用
 * @param allowMinus:允许负数
 * @param precision 数值精度，小数位数（可选，默认值2）
 * @param integerPrecision 整数精度（可选 类型number 总共不超过15位）
 * @param decimalsPrecision 小数精度（可选 类型number 总共不超过15位）
 * @param type: 通用数字类型(可选 类型 number 0-金额 1-面积)
 * @param initialValue 子节点的初始值，类型、可选值均由子节点决定(注意：由于内部校验时使用 === 判断是否变化，建议使用变量缓存所需设置的值而非直接使用字面量))
 * @class CcAmtCpl
 * @extends {React.Component}
 */
class CcAmtCpl extends React.PureComponent {
  constructor(props) {
    super(props);
    const { type = 0 } = props;
    if (type === 0) {
      const { integerPrecision = 13, decimalsPrecision = 2 } = props;
      this.intP = integerPrecision;
      this.decP = decimalsPrecision;
    } else if (type === 1) {
      const { integerPrecision = 10, decimalsPrecision = 5 } = props;
      this.intP = integerPrecision;
      this.decP = decimalsPrecision;
    } else {
      const { integerPrecision, decimalsPrecision = 0 } = props;
      // 以小数位数决定是否是整数或整数位数
      this.decP = decimalsPrecision;
      if (integerPrecision) {
        this.intP = integerPrecision > (15 - this.decP) ? (15 - this.decP) : integerPrecision;
      } else {
        this.intP = 15 - this.decP;
      }
    }
  }
  //   componentDidMount() {

  //   }

  createPlaceholder=() => {
    const { label, placeholder, precision } = this.props;
    let placeholderTmp = '';
    if (placeholder !== null) {
      placeholderTmp = placeholder;
    } else if (precision === 0) {
      placeholderTmp = `请输入${label},不包含小数`;
    } else if (precision === 1) {
      placeholderTmp = `请输入${label},最多包含一位小数`;
    } else if (label !== '' || typeof label !== 'undefined' || typeof label.props !== 'undefined' || label.props !== '') {
      const value = typeof label.props === 'undefined' || typeof label.props !== 'object' ? label : label.props.children;
      placeholderTmp = `${value}`;
    }
    return placeholderTmp;
  }

  /**
   * @description 组件onBlur事件触发
   * @memberof CcAmtCpl
   */
  fmtValue=(realValue) => {
    let fmtValue = '';
    if (realValue) {
      fmtValue = `${realValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return fmtValue;
  }

  validateAmt=(rule, real, callback) => {
    const value = real;
    if (!value) {
      callback();
      return;
    }
    const { allowMinus, placeholder } = this.props;
    let { label } = this.props;
    if (typeof label === 'object' && placeholder !== null) {
      label = placeholder;
    }
    const re = allowMinus ? /^(?:(?:[-,1-9]\d*|0)(?:\.\d*)?)(?:[e,E][+-]\d+)?$/ : /^(?:(?:[1-9]\d*|0)(?:\.\d*)?)(?:[e,E][+-]\d+)?$/;
    if (!re.test(value)) {
      callback(`请输入合法的${label}`);
    }
    callback();
  }

  createFormItem =(formItemLayout) => {
    const {
      form,
      form: { getFieldDecorator },
      field,
      required,
      width,
      disabled,
      initialValue,
      label,
      viewFlag,
      ...rest
    } = this.props;
    const placeholder = this.createPlaceholder();
    const styleWidth = width == null ? '100%' : width;
    const inputDisabled = disabled == null ? false : disabled;
    const viewFlagBoolean = viewFlag == null ? false : viewFlag;
    const initialValueFmt = this.fmtValue(initialValue);
    return (
      <Form.Item {...formItemLayout} label={label} required={required} {...rest}>
        {
            viewFlagBoolean === true
              ? initialValueFmt
              :
              getFieldDecorator(field, {
                initialValue: typeof initialValue === 'function' ? initialValue() : initialValue,
                validateFirst: true,
                rules: [
                  {
                    required,
                    message: `请输入${placeholder}`,
                  },
                  {
                    validator: this.validateAmt,
                  },
                ],
              })(
                <InputNumber
                  precision={this.decP}
                  style={{ width: styleWidth }}
                  placeholder={label}
                  disabled={inputDisabled}
                  form={form}
                  field={field}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => {
                    let tmpVal = value;
                    if (value.indexOf('.') > 0) {
                      const tmpVal0 = tmpVal.split('.')[0].replace(/\$\s?|(,*)/g, '').substr(0, this.intP);
                      const tmpVal1 = tmpVal.split('.')[1].replace(/\$\s?|(,*)/g, '').substr(0, this.decP);
                      tmpVal = `${tmpVal0}.${tmpVal1}`;
                    } else {
                      tmpVal = value.replace(/\$\s?|(,*)/g, '').substr(0, this.intP);
                    }
                    return tmpVal;
                  }}
                  {...rest}
                />
              )
        }
      </Form.Item>
    );
  }

  createLayout=() => {
    const columnLayout = this.props.columnLayout == null ? 1 : this.props.columnLayout;
    const columnIndex = this.props.columnIndex == null ? 0 : this.props.columnIndex;
    const colLayout = getFormItemLayout(columnLayout, columnIndex);
    const C1FormItemLayout = getFormItemLayout(1);
    if (columnLayout === 1) {
      return <div>{this.createFormItem(C1FormItemLayout)}</div>;
    }
    return (
      <div>
        <Col {...colLayout}>{this.createFormItem(C1FormItemLayout)}</Col>
      </div>
    );
  }
  render() {
    return this.createLayout();
  }
}

export default CcAmtCpl;
