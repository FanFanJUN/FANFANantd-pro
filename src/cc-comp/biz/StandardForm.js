import React from 'react';
import { Checkbox, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
// import {isEmpty} from "./commen";
// import SelectWithService from './selectHt';
import moment from 'moment';
import TreeSelectWithService from './TreeSelectWithService';
// import UploadFile from './UploadFile'
import 'moment/locale/zh-cn';
import SearchTable from './SearchTable';
import SearchTableForMultiple from './SearchTableForMultiple';
// import SearchTableNoRequest from "../components/SearchTableNoRequest";

moment.locale('zh-cn');

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
/**
 * @description 配置表单
 * @author LC@1981824361
 * @date 2020-06-02
 * @class StandardForm
 * @param selectWithData 下拉数据字典
 * @param treeSelect 树选择数据  数据全部返回  数据格式 [{ A: 1,B:2,childrenList: []},{},{}]  childrenList可以是children
 * @extends {React.Component}
 */
class StandardForm extends React.Component {
    getItem = (item, form) => {
      /*  params-------------前端传到后端的参数名-------数组格式
            keys-------------需要获取相应form的form 字段名值----数组格式并且和1params相匹配一一对应 如果想设置为空传null
            setKeys------------需要通过onchange事件来存储和改变的form Item值--------数组格式
            valueKeys----------需要获取整条数据中的哪些值----------------------数组格式和setKeys一一对应 如果想设置为空传null
        */
      const temp = {};
      if (item.params && item.keys && item.params.length > 0 && item.keys.length === item.params.length) {
        item.params.forEach((subitem, index) => {
          Object.assign(temp, { [subitem]: item.keys[index] === null ? null : form.getFieldValue(item.keys[index]) });
        });
      }
      const onChangeItem = (record) => {
        if (item.setKeys && item.valueKeys && item.setKeys.length > 0 && item.setKeys.length === item.valueKeys.length) {
          item.setKeys.forEach((subItem, index) => {
            form.setFieldsValue(
              { [subItem]: item.valueKeys[index] === null ? null : record[item.valueKeys[index]] }
            );
          });
        }
      };
      switch (item.type) {
        // case 'select':
        //     if(item.children.params){
        //         let params={};
        //         let key = Object.keys(item.children.params)[0];
        //         params[''+key] = form.getFieldValue(item.children.params[key]);
        //         return <SelectWithService placeholder={item.placeholder?item.placeholder:'请选择'} config={item.children} params={params}/>;
        //     }else{
        //         return <SelectWithService placeholder={item.placeholder?item.placeholder:'请选择'} config={item.children} />;
        //     }
        case 'selectWithData':
          return <Select placeholder={item.placeholder ? item.placeholder : '请选择'} style={{ width: '100%' }} allowClear {...item}>
            {item.data.map((dataItem, index) =>
              <Select.Option key={index} value={dataItem.value}>{dataItem.text}</Select.Option>)}
          </Select>;
        case 'searchTable':
          return <SearchTable
            placeholder={item.placeholder ? item.placeholder : '请选择'}
            initValue={item.initValue}
            noInitValue={item.noInitValue}
            disabled={item.disabled}
            params={item.params instanceof Array ? temp : item.params}
            config={item.children}
            multiple={item.multiple}
            radio={item.radio}
          />;
        case 'SearchTableForMultiple':
          return <SearchTableForMultiple
          multiple={true}
          radio={false}
          applicationScenarios='DEMAND_COMPANY'
          config={item.children}
      />  
          // case 'searchTableLink':
          //     return <SearchTable
          //         placeholder={item.placeholder?item.placeholder:'请选择'}
          //         initValue={item.initValue}
          //         config={item.children}
          //         params={item.params instanceof Array ? temp : item.params}
          //         selectChange={(record)=>onChangeItem(record)}
          //         onChange={item.onChange}
          //     />;
          // case 'searchTableNoRequestLink':
          //     return <SearchTableNoRequest
          //         placeholder={item.placeholder?item.placeholder:'请选择'}
          //         initValue={item.initValue}
          //         config={item.children}
          //         params={item.params instanceof Array ? temp : item.params}
          //         selectChange={(record)=>onChangeItem(record)}
          //     />;
        case 'treeSelect':
          const onTreeChangeItem = (value, record) => {
            if (item.setKeys && item.valueKeys && item.setKeys.length > 0 && item.setKeys.length === item.valueKeys.length) {
              item.setKeys.forEach((subItem, index) => {
                form.setFieldsValue(
                  { [subItem]: item.valueKeys[index] === null ? null : record[item.valueKeys[index]] }
                );
              });
            }
          };
          if (item.params) {
            const params = {};
            item.params.forEach((i, index) => {
              params[i] = form.getFieldValue(item.keys[index]);
            });
            return <TreeSelectWithService placeholder={item.placeholder ? item.placeholder : '请选择'} initValue={item.initValue} config={item.children} treeCheckable={item.treeCheckable} multiple={item.multiple} params={params} onChange={(value, record) => onTreeChangeItem(value, record)} />;
          } else {
            return <TreeSelectWithService placeholder={item.placeholder ? item.placeholder : '请选择'} initValue={item.initValue} config={item.children} treeCheckable={item.treeCheckable} multiple={item.multiple} onChange={(value, record) => onTreeChangeItem(value, record)} />;
          }
        case 'datePicker':
          return <DatePicker placeholder={item.placeholder ? item.placeholder : '请选择'} style={{ width: '100%' }} />;
        case 'rangePicker':
          return <RangePicker placeholder={item.placeholder ? item.placeholder : ['请选择', '请选择']} style={{ width: '100%' }} />;
        case 'radio':
          const options = [...item.children];
          const newOpetions = options.map((value, index, array) => {
            return <Radio key={value.value} value={value.value}>{value.text}</Radio>;
          });
          return <RadioGroup onChange={item.func}>
            {newOpetions}
                 </RadioGroup>;
        case 'checkBox':
          return <Checkbox checked={isEmpty(item.checkBoxValue) ? form.getFieldValue(item.code) : item.checkBoxValue} onChange={item.checkBoxOnChange} />;
        case 'checkBoxGroup':
          return <CheckboxGroup options={item.options} />;
        case 'inputNumber':
          return <InputNumber placeholder={item.placeholder ? item.placeholder : '请输入'} style={{ width: '100%' }} formatter={item.formatter} min={item.min} max={item.max} precision={item.precision} />;
        case 'textArea':
          return <Input.TextArea placeholder={item.placeholder ? item.placeholder : '请输入'} rows={4} maxLength={item.maxLength ? item.maxLength : 500} />;
        // case 'upload':
        //   return <UploadFile entityId={item.entityId ? form.getFieldValue(item.entityId) : null} />;
        default:
          return <Input
            placeholder={item.placeholder ? item.placeholder : '请输入'}
            autoComplete="off"
            maxLength={item.unlimited ? null : 128}
            disabled={item.disabled ? item.disabled : false}
          />;
      }
    };

    render() {
      const { form, editData, doubleLine, trebleLine, oneLine, fieldsConfig, formType } = this.props;
      const editDataTemp = (formType === 'edit' ? editData : null);
      const { getFieldDecorator } = form;
      let span = 24;
      let mod = 0;
      if (doubleLine) {
        span = 12;
        mod = fieldsConfig.length % 2;
      } else if (trebleLine) {
        span = 8;
        mod = fieldsConfig.length % 3;
      } else if (oneLine) {
        span = 24;
        mod = fieldsConfig.length;
      }
      return (
        <Row gutter={12} style={this.props.style}>
          {fieldsConfig.map(item => {
            if (item instanceof Array) {
              return (<Col key={`${item.code}_col`} span={span} style={{ display: item.hidden ? 'none' : 'block' }}>
                <FormItem key={item} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={item[0].name}>
                  {item.map((subItem, i) => {
                    return (<Col key={subItem.code} style={{ paddingRight: (i === item.length - 1) ? 0 : 8 }} span={24 / item.length}>
                      <FormItem>
                        {getFieldDecorator(subItem.code, {
                          initialValue: editDataTemp ? (subItem.type === 'datePicker' ? editDataTemp[subItem.code] ? moment(editDataTemp[subItem.code], dateFormat) : null : editDataTemp[subItem.code]) : subItem.defaultValue,
                          rules: subItem.rules ? subItem.rules : '',
                          normalize: subItem.normalize ? subItem.normalize : (value) => { return value; },
                          // normalize:(value)=>{return  replaceLineBreak(value)}
                        })(this.getItem(subItem, form))}
                      </FormItem>
                            </Col>);
                  })}
                </FormItem>
              </Col>);
            } else {
              return (<Col key={`${item.code}_col`} span={span} style={{ display: item.hidden ? 'none' : 'block' }}>
                <FormItem key={item.code} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={item.name}>
                  {getFieldDecorator(item.code, {
                    initialValue: editDataTemp ? (item.type === 'datePicker' ? editDataTemp[item.code] ? moment(editDataTemp[item.code], dateFormat) : null : editDataTemp[item.code]) : item.defaultValue,
                    rules: item.rules ? item.rules : '',
                    normalize: item.normalize ? item.normalize : (value) => { return value; },
                  })(this.getItem(item, form))}
                </FormItem>
              </Col>
              );
            }
          })}
          <Col key="searchBtn" style={{ textAlign: 'center' }} span={this.props.buttonSpan ? this.props.buttonSpan : 24}>
            {this.props.extra}
          </Col>
        </Row>
      );
    }
}


export default Form.create()(StandardForm);
