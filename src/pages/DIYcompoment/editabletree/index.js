import React from 'react';
import { Form, Table } from 'antd';
// import PropTypes from 'prop-types';
import { EditabletreeContext } from './TableContext';
import EditableCell from './EditableCell';
import './index.css';
import { gridDataformTree, getParentNodes, translateDataToTree } from '@/utils/utils';

const EditableRow = ({ form, index, ...props }) => (
  <EditabletreeContext.Provider value={form}>
    <tr {...props} />
  </EditabletreeContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
// 树形数据结构
const tabledata = [
  {
    id: 'A',
    name: '1',
    parentId: '0',
    amount: 10000,
    useamount: 0,
    aviamount: 10000,
    children: [
      {
        id: 'A1',
        name: '1-1',
        parentId: 'A',
        amount: 4000,
        useamount: 0,
        aviamount: 4000,
        children: [
          {
            id: 'A11',
            name: '1-1-1',
            parentId: 'A1',
            amount: 1000,
            useamount: 0,
            aviamount: 1000,
          },
          {
            id: 'A12',
            name: '1-1-2',
            parentId: 'A1',
            amount: 500,
            useamount: 0,
            aviamount: 500,
          },
          {
            id: 'A13',
            name: '1-1-3',
            parentId: 'A1',
            amount: 499,
            useamount: 0,
            aviamount: 499,
          },
          {
            id: 'A14',
            name: '1-1-4',
            parentId: 'A1',
            amount: 2001,
            useamount: 0,
            aviamount: 2001,
          },
        ],
      },
      {
        id: 'A2',
        name: '1-2',
        parentId: 1,
        amount: 6000,
        useamount: 0,
        aviamount: 6000,
        children: [
          {
            id: 'A21',
            name: '1-2-1',
            parentId: 'A2',
            amount: 2000,
            useamount: 0,
            aviamount: 2000,
          },
          {
            id: 'A22',
            name: '1-2-2',
            parentId: 'A2',
            amount: 4000,
            useamount: 0,
            aviamount: 4000,
          },
        ],
      },
    ],
  },
];
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: tabledata,
    };
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '25%',
        editable: true,
      },
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: '授信额度',
        dataIndex: 'amount',
        width: '15%',
        align: 'center',
        editable: true,
      },
      {
        title: '已用额度',
        dataIndex: 'useamount',
        align: 'center',
        editable: true,
      },
      {
        title: '可用额度',
        dataIndex: 'aviamount',
        align: 'center',
        editable: true,
      },
    ];
  }

  handleSave=(row) => {
    const { data } = this.state;
    // 原树状数据转化为list
    const dataList = gridDataformTree([], data);
    // 树状数据所有节点
    const allNodes = dataList.map((item) => {
      return item.id;
    });
    // 当前修改的节点
    const currentNode = row.id;
    // 当前修改节点的所有父节点
    const currentpidNode = getParentNodes(data, currentNode);
    // 排除相同节点
    const diffNodes = allNodes.filter((item) => {
      return !currentpidNode.includes(item);
    });
    // 当前节点的对象数据
    const originRow = dataList.filter((item) => {
      return item.id === currentNode;
    });
    // 获取差值
    const diffNumber = row.amount - originRow[0].amount;

    // 数据处理
    const currentTreeDataList = [];
    for (let i = 0; i < dataList.length; i++) {
      for (let j = 0; j < currentpidNode.length; j++) {
        if (currentpidNode[j] === dataList[i].id) {
          const dataNow = dataList[i];
          dataNow.amount += diffNumber;
          dataNow.aviamount += diffNumber;
          currentTreeDataList.push(dataNow);
        }
      }
    }
    const oriTreeDataList = [];
    for (let i = 0; i < dataList.length; i++) {
      for (let j = 0; j < diffNodes.length; j++) {
        if (diffNodes[j] === dataList[i].id) {
          const oridataNow = dataList[i];
          oriTreeDataList.push(oridataNow);
        }
      }
    }
    // 处理后的数据list
    const currentList = [...currentTreeDataList, ...oriTreeDataList];
    // 处理后的数据list转化为树形结构数据
    const currentTreeData = translateDataToTree(currentList);
    this.setState({ data: currentTreeData });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
        row: EditableFormRow,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        // 设置单元格属性
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const { data } = this.state;
    const { form } = this.props;
    return (
      <EditabletreeContext.Provider value={form}>
        <Table
          components={components}
          bordered
          defaultExpandAllRows
          dataSource={data}
          columns={columns}
          rowClassName={() => 'editable-row'}
          rowKey={(record) => record.id}
        />
      </EditabletreeContext.Provider>
    );
  }
}

const EditabletreeFormTable = Form.create()(EditableTable);
export default EditabletreeFormTable;
