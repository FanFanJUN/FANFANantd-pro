/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-10 17:14:04
 * @LastEditTime: 2020-10-10 17:16:21
 * @Description: 
 * @FilePath: /FANFANantd/src/pages/ExamplePage/rigister/commons/BaseAccountInfo.js
 */
import React, { forwardRef, useImperativeHandle, useEffect, useState,useRef } from 'react';
import {Form, Input, message, Row, Tabs} from 'antd';
// import { onlyNumber, toUpperCase, onMailCheck } from '@/utils/index'
// import OrganizationPage from './OrganizationPage'
// import PersonalPage from './PersonalPage'
const { create } = Form;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const BaseAccountRef = forwardRef(({
    hidden,
    form,
    accounts = {},
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAccountinfo,
    form
  }));
  const OrganRef = useRef(null);
  const PersonRef = useRef(null);
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [defaultActiveKey, setdefaultActiveKey] = useState([1]);
  //const { attachment = null } = initialValues;
  useEffect(() => {

  }, [])
  // 表单
  function getAccountinfo() {
    if (defaultActiveKey[0] === '1') {
        const { getOrganizinfo } = OrganRef.current; //组织用户
        let organData = getOrganizinfo()
        if (!organData) {
          message.error('请先完成表单填写！');
          return false;
        }else {
          return organData
        }
    }else if (defaultActiveKey[0] === '2') {
      const { getpersoninfo } = PersonRef.current; //个人用户
      let personaData = getpersoninfo()
      if (!personaData) {
        message.error('请先完成表单填写！');
        return false;
      } else {
        return personaData
      }
    }
    
  }
  function tabClickHandler(params) {
    setdefaultActiveKey(params)
  }
  return (
    <div style={{display: hidden ? "none" : "block",textAlign:'center'}}>
        <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)}>
            <TabPane forceRender tab="组织成为供应商" key="1">
              <OrganizationPage
                accounts={accounts}
                 wrappedComponentRef={OrganRef}
              />
            </TabPane>
            <TabPane forceRender tab="个人成为供应商" key="2">
              <PersonalPage 
                accounts={accounts}
                 wrappedComponentRef={PersonRef}
              />
            </TabPane>
          </Tabs>
    </div>
  )
}
)
const CommonForm = create()(BaseAccountRef)

export default CommonForm