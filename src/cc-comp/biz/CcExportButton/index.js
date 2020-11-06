/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-11-05 13:37:41
 * @LastEditTime: 2020-11-05 13:51:52
 * @Description: 导出 get POST 请求
 * @FilePath: /FANFANantd/src/cc-comp/biz/CcExportButton/index.js
 */
import { Button, message } from 'antd';
import React from 'react';
import httpUtils from '@/utils/FeatchUtils';
// 导出excel
/**
 *
 * @param api 导出的接口
 * @param params 当前的查询条件
 * @param fileName 导出的文件名（和后端确认文件扩展名是xls还是xlsx）
 * @param method 请求方式（默认get方式）
 * @param object 指向对象（接收传的this对象）
 * @param disabled 是否禁用
 * @param restProps 其余参数
 */
const exportButton = ({ api = '', params = {}, fileName = '未知文件名.xlsx', type = 'default', method = 'get', object, disabled = false, ...restProps }) => {
  return (
    <Button
      style={restProps.style || { marginLeft: 8 }}
      type={type}
      loading={object.state.exportButtonLoading}
      onClick={() => {
        handleClick(api, params, fileName, method, object);
      }}
      disabled={disabled}
    >
      {restProps.btnName || '导出'}
    </Button>
  );
};
const handleClick = (api, params, fileName, method, object) => {
  object.setState({
    exportButtonLoading: true,
  });
  if (method === 'get') {
    httpUtils.getExport(api, params).then(res => {
      object.setState({
        exportButtonLoading: false,
      });
      const content = res;
      const blob = new Blob([content]);
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    })
      .catch(err => {
        message.error(err);
      });
  } else {
    httpUtils.postExport(api, params).then(res => {
      object.setState({
        exportButtonLoading: false,
      });
      const content = res;
      const blob = new Blob([content]);
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    }).catch(err => {
      message.error(err);
    });
  }
};

export default exportButton;
