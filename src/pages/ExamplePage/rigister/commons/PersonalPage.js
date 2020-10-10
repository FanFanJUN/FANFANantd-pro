import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, message, Radio, Button } from 'antd';
// import SearchTable from '../../supplierRegister/components/SearchTable'
// import { checkCreditCode ,checkAccount} from '../../../services/supplierRegister'
// import {chineseProvinceTableConfig} from '../../../utils/commonProps'
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
};
const tipsLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const OrganizatRef = forwardRef(({
    isView,
    form,
    accounts=[],
}, ref) => {
    useImperativeHandle(ref, () => ({
        getpersoninfo,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configAcc, setConfigAcc] = useState([]);
    const [configure, setConfigure] = useState([]);
    //const { attachment = null } = initialValues;
    useEffect(() => {
        // let fieldsListed = []
        // accountinfo.map(item => {
        //   fieldsListed.push({
        //     title: item.title,
        //     key: item.key,
        //     verifi: item.verifi,
        //     type: 'input',
        //   })
        // })
    }, [])
    // 表单
    function getpersoninfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.supplierType = '0';
                values.openId = accounts.openId;
                values.name = values.name  + values.mobile
                result = values;
            }
        });
        return result;
    }
    async function handleCheck() {
        let name = form.getFieldValue('name');
        if (!name) {
            message.error('请输入用户名');
            return false;
        }
        if (name) {
            const {success, message: msg } = await checkAccount({ supplierName: name, supplierId: '' });
            if (success){
                message.error('供应商名称已存在，请重新输入');
            }else {
                message.success('供应商名称可以使用');
            }
        } else {
            message.error('请输入供应商名称');
        }
    }
    //检查供应商名称
    async function handleCheckName() {
        const creditCode = form.getFieldValue('creditCode');
        if (creditCode.indexOf(' ') !== -1) {
            message.error('社会信用代码不允许存在空格，请重新输入');
            return false;
        }
        let id = '';
        if (creditCode && creditCode.match('^[A-Z0-9]{18}$')) {
            const {data,success, message: msg } = await checkCreditCode({creditCode,id});
            if (success) {
                if (data) {
                    message.error('社会信用代码已存在，请重新输入');
                }else {
                    message.success('社会信用代码可以使用');
                }
            }

        } else {
            message.error('请输入统一社会信用代码');
        }
    }
    function creditCodeChange(event) {
        let value = event.target.value;
        event.target.value = value.toUpperCase();
        if (value && value.match('^[A-Z0-9]{18}$')) {
           
        }
    }
    return (
        <Form style={{paddingTop:'50px'}}>
            <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'姓名'}
                    >
                        {
                            getFieldDecorator('name', {
                                initialValue: '',
                                rules: [{ required: true, message: '姓名' },
                                //{ validator: this.checkName },
                                ],
                            })(
                                <Input
                                    //onChange={this.supplierNameChange}
                                    onBlur={handleCheck}
                                    placeholder={'姓名'}
                                    maxLength={10}
                                />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'身份证号'}
                    >
                        {
                            getFieldDecorator('creditCode', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入身份证号' },
                                { pattern: '^[A-Z0-9]{18}$', message: '只能是18位英文和数字' }
                                ],
                            })(
                                <Input
                                    onChange={creditCodeChange}
                                    maxLength={18}
                                    onBlur={handleCheckName}
                                    placeholder={'请输入身份证号'}
                                />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            {/* <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'所在省份'}
                    >
                        {
                            getFieldDecorator('registerProvinceId', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择所在省份' },
                                ],
                            })(
                                <SearchTable
                                    placeholder={'请选择所在省份'}
                                    config={chineseProvinceTableConfig}
                                />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row> */}
            <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'手机'}
                    >
                        {
                            getFieldDecorator('mobile', {
                                initialValue: accounts && accounts.mobile,
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <Input
                                disabled={true}
                                    maxLength={11}
                                    placeholder={'请输入手机号'} />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
)
const CommonForm = create()(OrganizatRef)

export default CommonForm