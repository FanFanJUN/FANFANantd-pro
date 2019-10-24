import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Card } from 'antd';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
    sex: ['1', '2'][i % 2],
  });
}
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
const EditableCell = ({ ...props }) => {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  } = props;

  const getInput = () => {
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  const validatorRule = (rule, relValue, callback) => {
    console.log(record);
    console.log(rule, relValue);
    if (rule && rule.field === 'age') {
      if (relValue < record.age) {
        callback('年龄必须小于当前年龄!');
      }
      callback();
    }
  };

  return <EditableContext.Consumer>
    {(form) => {
      const { getFieldDecorator } = form;
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                // validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                //   {
                //     validator: validatorRule,
                //   },
                ],
                initialValue: record[dataIndex] || '',
              })(<div>{ getInput() }</div>)}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    }}
         </EditableContext.Consumer>;
};

/**
 * @description 可编辑表格
 * @author LC@1981824361
 * @date 2019-10-24
 * @class EditableTable
 * @extends {React.Component}
 */
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      editingKey: '', // 正在编辑的key
    };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        align: 'center',
        editable: false,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        align: 'center',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        align: 'center',
        editable: true,
      },
      //   {
      //     title: '性别',
      //     dataIndex: 'address',
      //     width: '40%',
      //     align: 'center',
      //     editable: true,
      //     render: (sex) => {
      //       return sex === 1 ? '男' : '女';
      //     },
      //   },
      {
        title: 'operation',
        align: 'center',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  renderTable() {
    const components = {
      body: {
        cell: EditableCell,
        row: EditableFormRow,
      },
    };

    // 重组columns
    const columns = this.columns.map(col => {
      // editable为false 返回原有col
      if (!col.editable) {
        return col;
      }
      // 否则为col加上onCell属性
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        //   rowClassName="editable-row"
        pagination={{
          onChange: this.cancel,
        }}
      />
    );
  }


  render() {
    return (
      <Card
        title="可编辑表格"
      >
        {this.renderTable()}
      </Card>
    );
  }
}
export default Form.create()(EditableTable);
