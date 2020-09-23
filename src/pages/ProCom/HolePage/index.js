/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-09-23 15:31:04
 * @LastEditTime: 2020-09-23 15:46:33
 * @Description: 函数组件
 * @FilePath: /FANFANantd/src/pages/ProCom/HolePage/index.js
 */
import React, { useRef } from 'react';
import { AdvancedForm, CcCard, Header } from '@/cc-comp/basic';
import { Button, Input, Table } from 'antd';

const { Search } = Input;
function HolePage() {
  const headerRef = useRef(null);
  // 高级查询配置
  const formItems = [
    // { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
    // { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
    // { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
    // { title: '环保管理人员', key: 'environmentAdminName', props: { placeholder: '输入申请人查询' } },
    // { title: '申请人', key: 'applyPersonName', props: { placeholder: '输入申请人查询' } },
    // { title: '状态', key: 'effectiveStatus', type: 'list', props: statusProps },
    // { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: distributionProps },
    // { title: '物料标记状态', key: 'assignSupplierStatus', type: 'list', props: materialStatus },
    // { title: '同步PDM状态', key: 'syncStatus', type: 'list', props: PDMStatus },
    { title: '书剑', key: 'time', type: 'rangePicker' },
    { title: '输入框', key: 'test' },
  ];

  const columns = [
    {
      dataIndex: 'id',
      title: '编号',
      align: 'center',
    },
    {
      dataIndex: 'articleTitle',
      title: '文章标题',
      align: 'center',
    },
    {
      dataIndex: 'articleHref',
      title: '文章链接',
      align: 'center',
    },
  ];

  const headerLeft = () => {
    return [
      <Button type="primary" style={{ marginRight: '18px' }}>新增</Button>,
      <Button type="danger">删除</Button>,
    ];
  };
  const headerRight = () => {
    return <Search
      placeholder="请输入物料代码和物料组代码查询"
            //   className={styles.btn}
            // onSearch={handleQuickSearch}
      allowClear
    />;
  };

  function handleSearch(formData) {
    console.log(formData);

    headerRef.current.hide();
  }
  return (
    <CcCard title="标准页面">
      <Header
        left={headerLeft()}
        right={headerRight()}
        ref={headerRef}
                // onRef={(ref) => this.LinedetailsRef = ref }
        content={<AdvancedForm formItems={formItems} onOk={handleSearch} />}
        advanced
      />
      <Table
        columns={columns}
      />
    </CcCard>
  );
}

export default HolePage;
