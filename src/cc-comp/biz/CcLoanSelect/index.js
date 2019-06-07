/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { getFormItemLayout } from '@/utils/layout';
import { Col, Form } from 'antd';
import CommonSelect from './CommonSelect';
import { isEmptyArray, getDicOptions, checkNull } from '@/utils/utils';

/**
 * @description 数据字典
 * @author LC@1981824361
 * @date 2019-06-01
 * @param columnLayout={2} 一行显示几列
 * @param columnIndex={1} 显示的顺序
 * @param form={form} 必传 form表单属性
 * @param label="证件类型"
 * @param placeholder="请输入证件类型" 选择框默认文字
 * @param dicCode="CERTFCT_TYPE" 数据字典类型编码
 * @param field="xx" 必传 form表单中属性值
 * @param options={optionsData.CERTFCT_TYPE} 必传 所有字典
 * @param valueProp="dictionaryNo" 必传 字典码值
 * @param titleProp="dictionaryNm" 字典显示名称
 * @param ChooseFlag 是否显示--请选择--
 * @param mode="multiple" 设置 Select 的模式为多选或标签 'multiple' | 'tags'
 * @param required 是否必须
 * @param disabled 是否禁用
 * @param notoptions 不显示的字典项 {[{dictionaryNm: '身份证',dictionaryNo: '1'}]}
 * @param initialValue 子节点的初始值，类型、可选值均由子节点决定(注意：由于内部校验时使用 === 判断是否变化，建议使用变量缓存所需设置的值而非直接使用字面量))
 * @class CcLoanSelect
 * @extends {React.Component}
 */
class CcLoanSelect extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }
  //   componentDidMount() {

  //   }

  handleChange =(value) => {
    const { cascade, form, setOptions } = this.props;
    if (isEmptyArray(cascade)) {
      return;
    }
    cascade.forEach((cascadeItem) => {
      const { dicCode, field } = cascadeItem;
      getDicOptions([{ dictionaryCategoryNo: `${dicCode}` }]).then(
        result => {
          if (!checkNull(result)) {
            form.resetFields([field]);
            const filter = result[dicCode];
            if (filter) {
              const dics = [];
              filter.forEach((dic) => {
                if (dic.dictionaryNo && dic.dictionaryNo.startsWith(value)) {
                  dics.push(dic);
                }
              });
              if (setOptions) {
                setOptions(dics, dicCode);
              }
            }
          }
        }
      );
    });
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
      mode,
      label,
      placeholder,
      options,
      titleProp,
      valueProp,
      viewFlag,
      onChange,
      cascade,
      ChooseFlag,
      ...rest
    } = this.props;
    const changeHandler = typeof onChange === 'function' ? onchange : function f() {};
    const styleWidth = width == null ? '100%' : width;
    const inputDisabled = disabled == null ? false : disabled;
    const viewFlagBoolean = viewFlag == null ? false : viewFlag;
    const selectMode = mode == null ? '' : mode;
    const prclabel = typeof label === 'function' ? label() : label;
    // const viewTitle = ge?
    return (
      <Form.Item {...formItemLayout} label={label} required={required} {...rest}>
        {
            viewFlagBoolean === true
              ? 'test'
              :
              getFieldDecorator(field, {
                initialValue: typeof initialValue === 'function' ? initialValue() : initialValue,
                validateFirst: true,
                rules: [
                  {
                    required,
                    message: typeof label === 'function' ? label() : label,
                  },
                ],
              })(
                <CommonSelect
                  onChange={cascade ? this.handleChange : changeHandler}
                  titleProp={titleProp}
                  valueProp={valueProp}
                  style={{ width: styleWidth }}
                  placeholder={label}
                  ChooseFlag={ChooseFlag}
                  disabled={inputDisabled}
                  mode={selectMode}
                  options={options}
                  form={form}
                  field={field}
                  {...rest}
                />
              )
        }
      </Form.Item>
    );
  }

  createLayout=() => {
    const columnLayout = this.props.columnLayout == null ? 1 : this.props.columnLayout;
    const columnIndex = this.props.children == null ? 0 : this.props.columnIndex;
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

export default CcLoanSelect;
