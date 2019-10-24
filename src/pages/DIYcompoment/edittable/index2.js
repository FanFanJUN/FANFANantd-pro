import React from 'react';
import TfEditTable from './components';

const dataSource = [
  { userId: 163, name: '张三', age: 27, position: '功能', jobId: 13496 },
  { userId: 165, name: '李四', age: 22, position: '平台', jobId: 18893 },
];

const Page = () => {
  const handleDel = (record) => {
    console.log('删除', record);
  };

  const handleSave = (record) => {
    console.log('保存', record);
  };

  const handleView = (record) => {
    console.log('查看', record);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      editable: true,
      formType: 'select',
      formTypeProps: {
        placeholder: '请输入名字',
      },
      formTypeRules: {
        required: true,
        message: '请输入名字',
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 200,
      editable: true,
      formType: 'input',
      formTypeProps: {
        placeholder: '请输入年龄',
      },
      formTypeRules: {
        required: true,
        message: '请输入年龄',
      },
    },
    {
      title: '所在组',
      dataIndex: 'position',
      key: 'position',
      editable: true,
      formType: 'select',
    },
    {
      title: '工号',
      dataIndex: 'jobId',
      key: 'jobId',
      editable: true,
      formType: 'input',
      formTypeProps: {
        placeholder: '请输入工号',
      },
      formTypeRules: {
        required: true,
        message: '请输入工号',
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      actions: [
        { title: '编辑', type: 'edit' },
        { title: '删除', type: 'del', callback: handleDel, delName: 'name' },
        { title: '保存', type: 'save', callback: handleSave },
        { title: '取消', type: 'cancel' },
        { title: '查看', type: 'view', callback: handleView },
      ],
    },
  ];

  const tfEditTableProps = {
    columns,
    dataSource,
    rowKey: 'userId',
    addText: '新增',
    formData: {
      nameLoading: false,
      nameDataSource: [
        { key: 1001, label: '丰雨桥' },
        { key: 1009, label: '查柳' },
      ],
      positionDataSource: [
        {
          groupKey: '业务组',
          groupLabel: 'busiTeam',
          list: [
            { key: '2001', label: '功能' },
            { key: '2002', label: '平台' },
            { key: '2003', label: '项目' },
          ],
        },
      ],
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <TfEditTable {...tfEditTableProps} />
    </div>
  );
};

export default Page;
