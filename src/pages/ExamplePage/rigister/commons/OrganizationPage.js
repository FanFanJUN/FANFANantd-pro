import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, message, Radio, Button } from 'antd';
// import {ComboTree} from 'suid'
import { router } from 'dva';
// import SearchTable from '../../supplierRegister/components/SearchTable'
// import { checkSupplierName ,getImgUrl,UnifiedcheckCheckEmail} from '../../../services/supplierRegister'
// import {chineseProvinceTableConfig,organpurchaseCompanyPropsreg} from '../../../utils/commonProps'
// import {isEmpty} from '../../../utils'
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
        getOrganizinfo,
        form
    }));
    const { query } = router.useLocation();
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configAcc, setConfigAcc] = useState([]);
    const [configure, setConfigure] = useState([]);
    const [imgUrl, setimgUrl] = useState({});
    const [reqId, setreqId] = useState({});
    const [btnText, setbtnText] = useState('获取验证码');
    const [btnBool, setbtnBool] = useState(false);
    const [imgCode, setimgCode] = useState(''); 
    const [isemail, setisemail] = useState(false);
    //const { attachment = null } = initialValues;
    useEffect(() => {
        SendPicCode()
        displayOrgan()
    }, [])
    // 表单
    function getOrganizinfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.supplierType = '1';
                values.openId = accounts.openId;
                result = values;
            }
        });
        return result;
    }
    //检查供应商名称
    async function handleCheckName() {
        const name = form.getFieldValue('name');
        if (name.indexOf(' ') !== -1) {
            message.error('供应商名称不允许存在空格，请重新输入');
            this.setChecks('checkSupplierNameResult', false);
            return false;
        }
        if (name) {
            const { success, message: msg } = await checkSupplierName({ supplierName: name, supplierId: '' });
            if (success) {
                message.success('供应商名称可以使用');
            } else {
                message.error('供应商名称已存在，请重新输入');
            }
        }
    }
    // 图形码
    async function SendPicCode() {
        let reqId = (getUUID() + getUUID() + "-" + getUUID() + "-" + getUUID() + "-" + getUUID() + "-" + getUUID() + getUUID() + getUUID());
        setreqId(reqId)
        getImgUrl({reqId:reqId}).then(res=>{
            if(res.success){
                setimgUrl(res.data)
            }else{
                message.error(res.msg);
            }
        })
    }
    function getUUID () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function blurImgCode(e) {
        setimgCode(e.target.value)
    }
    // 短信验证码
    async function SendCode () {
        let email = form.getFieldValue('email');
        let verifyCode = form.getFieldValue('verifyCode');
        let maxTime = 59;
        let timer;
        clearInterval(timer);
        if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email))) {
            message.error('请输入正确的邮箱');
            return false;
        }
        if(!verifyCode.trim()){
            message.error('请填写图形验证码');
            return false;
        }
        let random = Math.floor(Math.random()*Math.pow(10,13))
        console.log(reqId)
        const { success, message: msg } = await UnifiedcheckCheckEmail({
            email: email,reqId:reqId,code:imgCode
        })
        if (success) {
            message.success('邮箱验证码已发送，请注意查收');
                timer = setInterval(() => {
                    if (maxTime > 0) {
                        --maxTime;
                        setbtnText(maxTime + '秒后重新获取')
                        setbtnBool(true)
                    } else {
                        setbtnText('获取验证码')
                        setbtnBool(false)
                        clearInterval(timer);
                    }
                }, 1000);
            return
        }
        message.error(msg)
    }
    function displayOrgan() {
        let email =query.email;
        if (isEmpty(email) || email === 'undefined') {
            setisemail(false)
        }else {
            setisemail(true)
        }
    }
    return (
        <Form style={{paddingTop:'50px'}}>
            <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'组织全称'}
                    >
                        {
                            getFieldDecorator('name', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入组织全称' },
                                //{ validator: this.checkName },
                                ],
                            })(
                                <Input
                                    //onChange={this.supplierNameChange}
                                    onBlur={handleCheckName}
                                    placeholder={'请输入组织全称'}
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
                        label={'供应商分类'}
                    >
                        {
                            getFieldDecorator('supplierCategoryId'),
                            getFieldDecorator('supplierCategoryName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商分类' },
                                ],
                            })(
                                <ComboTree
                                    {...organpurchaseCompanyPropsreg}
                                    form={form} showSearch={false}
                                    name='supplierCategoryName'
                                    field={['supplierCategoryId']}
                                    //afterSelect={(item) => handletypeSelect(item)}

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
                        label={'手机'}
                    >
                        {
                            getFieldDecorator('mobile', {
                                initialValue: accounts && accounts.mobile,
                                rules: [{
                                    required: true, message: '手机不能为空'
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
            <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'电子邮箱'}
                    >
                        {
                            getFieldDecorator('email', {
                                initialValue: accounts && accounts.email,
                                rules: [
                                    //{ validator: onMailCheck, message: '请输入正确格式的电子邮箱！', whitespace: true },
                                    { required: true, message: '请输入电子邮箱' }
                                ],
                            })(
                                <Input
                                    disabled={isemail}
                                    maxLength={50}
                                    placeholder={'请输入电子邮箱'} />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            {
                !isemail ?  <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'图形验证码'}
                    >
                        {
                            getFieldDecorator('verifyCode', {
                                initialValue: '',
                                rules: [{ message: '请输入图形验证码！', whitespace: true },
                                    { required: true, message: '请输入图形验证码' }],
                            })(
                                <Input placeholder="请输入图形验证码" onBlur={blurImgCode}/>,
                            )
                        }

                    </FormItem>
                </Col>
                <Col span={2}>
                    <img src={imgUrl} alt="" style={{ marginTop: 7, marginLeft: 8 }} onClick={SendPicCode}/>
                </Col>
            </Row>
             : null
            }
            {!isemail ? <Row>
                <Col span={15}>
                    <FormItem
                        {...formItemLayout}
                        label={'邮箱验证码'}
                    >
                        {
                            getFieldDecorator('authCode', {
                                initialValue: '',
                                rules: [{ message: '请输入邮箱验证码！', whitespace: true },
                                    { required: true, message: '请输入邮箱验证码' }],
                            })(
                                <Input placeholder="请输入邮箱验证码" type="number"/>,
                            )
                        }

                    </FormItem>
                </Col>
                <Col span={2}>
                    <Button onClick={SendCode} disabled={btnBool}
                            style={{ marginTop: 3, marginLeft: 8 }}>
                        {btnText}
                    </Button>
                </Col>
            </Row> : null}
        </Form>
    )
}
)
const CommonForm = create()(OrganizatRef)

export default CommonForm