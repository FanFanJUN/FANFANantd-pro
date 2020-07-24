import React, { Fragment } from 'react'
import { Form, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import { getFormItemLayout } from '@/utils/layout';

const FormItem = Form.Item;

/**
 * @description 日期区间组件
 * @author LC@1981824361
 * @date 2020-07-24
 * @class RangeDate
 * @extends {React.Component}
 */
class RangeDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    disabledStartDate = (startDate) => {
        const { form } = this.props;
        const endDate = form.getFieldValue('effectiveEndDate');
        if (endDate) {
            return endDate < startDate;
        }
    }

    disabledEndDate = (endDate) => {
        const { form } = this.props;
        const startDate = form.getFieldValue('effectiveStartDate');
        if (startDate) {
            return startDate > endDate;
        }
    }

    getItemLayout = (formItemLayout) =>{
        if(formItemLayout === '1') {
            return {labelCol:{ span: 8 },wrapperCol:{ span: 14 }}
        } else if(formItemLayout === '2') {
            return {labelCol: {span: 9}, wrapperCol: {span: 15}};
        } else {
            return {labelCol:{ span: 6 },wrapperCol:{ span: 16 }}
        }
    }

    createFormItem = (colLayout, formItemLayout) =>  {
        const {
            form,
            required,
            disabled,
            initialValueStartDate,
            initialValueEndDate,
            labelStart,
            labelEnd,
            keyStart,
            keyEnd,
            // formItemLayout,
            colSpan,
            isView,
        } = this.props;
        const { getFieldDecorator } = form;
        
        // const ItemLayout = this.getItemLayout(formItemLayout);
        const  ItemLayout = formItemLayout;
        
        return (
            <Fragment>
                <Col {...colLayout}>
                    <FormItem key={keyStart} {...ItemLayout} label={labelStart || '开始有效期'}>
                        {
                            isView?
                            <span>{initialValueStartDate ? moment(initialValueStartDate).format('YYYY-MM-DD') : ''}</span> :
                            getFieldDecorator(keyStart || 'effectiveStartDate', {
                                initialValue: initialValueStartDate ? moment(initialValueStartDate) : '',
                                rules: [{ required: required || true, message: labelStart ? `${labelStart}不能为空` : '有效期开始时间不能为空' }],
                            })(<DatePicker
                                disabledDate={this.disabledStartDate}
                                disabled={disabled || false}
                                placeholder={labelStart ? `请选择${labelStart}` : '请选择有效期开始时间'}
                                format={'YYYY-MM-DD'}
                                style={{ width: '100%' }}
                            />)
                        }
                    </FormItem>
                 </Col>
                 <Col {...colLayout}>     
                    <FormItem key={keyEnd} {...ItemLayout} label={labelEnd || '结束有效期'}>
                        {
                            isView?
                            <span>{initialValueEndDate ? moment(initialValueEndDate).format('YYYY-MM-DD') : ''}</span> :
                            getFieldDecorator(keyEnd || 'effectiveEndDate', {
                                initialValue: initialValueEndDate ? moment(initialValueEndDate) : '',
                                rules: [{ required: required || true, message: labelEnd ? `${labelEnd}不能为空` : '有效期结束时间不能为空' }],
                            })(<DatePicker
                                disabledDate={this.disabledEndDate}
                                disabled={disabled || false}
                                placeholder={labelEnd ? `请选择${labelEnd}` : '请选择有效期结束时间'}
                                format={'YYYY-MM-DD'}
                                style={{ width: '100%' }}
                            />)
                        }
                    </FormItem>
                </Col>   
            </Fragment>
        )
    }

    createLayout=() => {
        const columnLayout = this.props.columnLayout == null ? 1 : this.props.columnLayout;
        const columnIndex = this.props.columnIndex == null ? 0 : this.props.columnIndex;
        const colLayout = getFormItemLayout(columnLayout, columnIndex);
        const C1FormItemLayout = getFormItemLayout(1);
        if (columnLayout === 1) {
          return <div>{this.createFormItem(C1FormItemLayout)}</div>;
        }
        return this.createFormItem(colLayout, C1FormItemLayout);
      }


    render() {
        return this.createLayout();
    }
}

export default RangeDate;