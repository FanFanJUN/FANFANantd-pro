/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-10 17:14:04
 * @LastEditTime: 2020-10-10 17:49:34
 * @Description:
 * @FilePath: /FANFANantd/src/pages/ExamplePage/rigister/commons/RegistrationAgreement.js
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';

const { create } = Form;
const BaseAccountRef = forwardRef(({
  hidden,

}, ref) => {
  useImperativeHandle(ref, () => ({

  }));
  return (
    <div style={{ padding: '10px auto', display: hidden ? 'none' : 'block', width: '80%', margin: '10px auto' }}>
      <h1 align="center" style={{ fontSize: '1.5em', fontFamily: '宋体（中文正文）', fontWeight: 'bold', color: '#5B5B5B' }}>
        注意
      </h1>
      <br />
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>一、遵守诚实守信原则</h1>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）', fontwWeight: 'bold' }}>
        xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>二、遵守廉洁阳光原则</h1>
      <p style={{ marginLeft: '0em', textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>三、遵守保密义务原则</h1>
      <p style={{ marginLeft: '0em', textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 3.1  </span>xx
      </p>
      <p style={{ marginLeft: '0em', textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 3.2  </span>xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>四、</h1>
      <p style={{ marginLeft: '0em', textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
       xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>五、</h1>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>六、</h1>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
         xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>七、免责条款</h1>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 7.1  </span>xx
      </p>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 7.2  </span>xx
      </p>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 7.3  </span>xx
      </p>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 7.4  </span>xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>八、申报条款</h1>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 8.1  </span>xx
      </p>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 8.2  </span>xx
      </p>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        <span> 8.3  </span>xx
      </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: '1.1em', fontWeight: 'bold', color: '#5B5B5B' }}>九、监察部门投诉举报热线</h1>
      <p style={{ textIndent: '2em', lineHeight: '1.5em', fontFamily: '宋体（中文正文）' }}>
        邮箱：xxx
      </p>
    </div>
  );
});
const CommonForm = create()(BaseAccountRef);

export default CommonForm;
