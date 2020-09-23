/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-10 10:57:33
 * @LastEditTime: 2020-09-22 14:35:11
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/CommonUtil/EditTable.js
 * @Description:  函数式可编辑行 Table组件
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, Fragment } from 'react';
import { Input, InputNumber, Popconfirm, Form, Divider, Button, DatePicker, Select, message, Alert, Row, Col } from 'antd';
import { ExtTable, ComboList, ComboGrid } from 'suid';
import PropTypes, { any } from 'prop-types';
import AutoSizeLayout from '../../../../supplierRegister/SupplierAutoLayout';
import { guid, isEmptyArray, checkNull, hideFormItem, getDocId } from './utils';
import UploadFile from './UploadFile';
import { currencyTableProps } from '../../../../../utils/commonProps';
import moment from 'moment';

const EditableContext = React.createContext();
const { Option } = Select;

const EditableCell = (params) => {
    const {
        params: {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            form,
            required,
            inputDisabled,
            inputDefaultValue,
            selectOptions,
        }
    } = params;
    const { getFieldDecorator } = form;
    const HideFormItem = hideFormItem(getFieldDecorator);

    function afterSelect(val) {
        form.setFieldsValue({ currencyCode: val.code });
    }

    // 编辑样式
    const getInput = () => {
        const a = record[dataIndex];
        switch (inputType) {
            case 'InputNumber':
                return <InputNumber disabled={inputDisabled} min={0} />
            case 'DatePicker':
                return <DatePicker />
            case 'Select':
                if (selectOptions) {
                    return <Select
                        style={{ width: 150 }}
                        placeholder="请选择"
                        disabled={inputDisabled}
                    >
                        {selectOptions.map(item => {
                            return <Option value={item.value}>{item.name}</Option>
                        })}
                    </Select>
                }
                return <Select
                    style={{ width: 150 }}
                    placeholder="请选择"
                >
                    <Option value={true}>是</Option>
                    <Option value={false}>否</Option>
                </Select>
            case 'UploadFile':
                return <UploadFile entityId={a} />
            case 'TextArea':
                return <Input.TextArea disabled={inputDisabled} />
            case 'hideForm':
                return <Input type={"hidden"} />
            case 'selectwithService':
                return <ComboGrid {...currencyTableProps} form={form} afterSelect={afterSelect} />
            case 'percentInput':
                return <InputNumber min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')} />
            default:
                return <Input disabled={inputDisabled} />;
        }
    };

    // 有编辑状态  不处于编辑中 col 显示值
    const getRecordData = () => {
        const a = record[dataIndex];
        if (a !== null && a !== undefined) {
            if (inputType === 'Select') {
                // a有boolean 类型  判断有无值  不用&&符号
                if (!isEmptyArray(selectOptions) && a !== undefined && a !== '' && a !== null) {
                    // col 传递参数
                    const selectObj = selectOptions.filter(item => {
                        return item.value === a;
                    });
                    return selectObj[0].name;
                } else {
                    // 默认 参数
                    if (a === true) {
                        return '是';
                    }
                    return '否';
                }
            } else if (inputType === 'DatePicker') {
                return a && moment(a).format('YYYY-MM-DD');
            } else if (inputType === 'percentInput') {
                return `${a}%`;
            } else if (inputType === 'UploadFile') {
                return <UploadFile type='show' entityId={a} />
            } else {
                return a;
            }
        }
    }

    // 有编辑状态  处于编辑中col 默认值
    const getInit = () => {
        const a = record[dataIndex];
        if (inputDefaultValue) {
            return inputDefaultValue;
        } else {
            if (inputType === 'DatePicker') {
                return moment(a);
            }
            //  else if (inputType === 'UploadFile') {
            //     return getDocId(a);
            // }
            return record[dataIndex];
        }
    }

    const renderCell = () => {
        return (
            editing ? (
                <Form.Item style={{ margin: 0 }}>
                    <span style={{ color: 'red', display: required ? '' : 'none', float: inputType === 'UploadFile' ? 'left' : null }}>*</span>
                    {getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required,
                                message: `请输入${title}!`,
                            },
                        ],
                        // initialValue有false
                        initialValue: getInit(),
                    })(getInput())}
                    {dataIndex === 'currencyName' ? HideFormItem('currencyCode', record.currencyCode) : null}
                </Form.Item>
            ) : (
                    <div style={{ textAlign: 'center' }}>{getRecordData()}</div>
                )
        );
    };

    return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

const EditableTable = (props) => {

    const { form, dataSource, columns, rowKey, isEditTable = false, isToolBar = false, setNewData,
        recommendDemandId = '676800B6-F19D-11EA-9F88-0242C0A8442E', tableType } = props;

    const [editingKey, setEditingKey] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const tableRef = useRef(null);

    function isEditing(record) {
        return record[rowKey] === editingKey;
    };

    function cancel() {
        setEditingKey('');
    };

    function edit(key) {
        setEditingKey(key);
    }

    function deleteRow(key, type) {
        const newArray = dataSource.filter(item => {
            return item[rowKey] !== key;
        });
        setNewData(newArray, tableType);
        setButtonDisabled(false);
        setEditingKey('');
    }

    const finalCol = (record) => {
        const editable = isEditing(record);
        return editable ? (
            <span>
                <EditableContext.Consumer>
                    {form => (
                        <a
                            onClick={() => save(form, record[rowKey])}
                            style={{ marginRight: 8 }}
                        >
                            保存
                        </a>
                    )}
                </EditableContext.Consumer>
                {buttonDisabled ?
                    <a style={{ color: 'red' }} key='deteteKey' onClick={() => deleteRow(record[rowKey], 'editDelete')}>删除</a>
                    :
                    <Popconfirm title="确定取消？" onConfirm={() => cancel(record[rowKey])}>
                        <a key='cancel'>取消</a>
                    </Popconfirm>}
            </span>
        ) : (
                <Fragment>
                    <a disabled={editingKey !== ''} onClick={() => edit(record[rowKey])} key='edit'>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定删除？" onConfirm={() => deleteRow(record[rowKey], 'delete')}>
                        <a disabled={editingKey !== ''} key='delete' style={editingKey !== '' ? { color: 'rgba(0, 0, 0, 0.25)' } : { color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm>
                </Fragment>
            );
    }

    const secCol = isEditTable ? [{
        title: '操作',
        dataIndex: 'operation',
        editable: false,
        render: (text, record) => {

            return finalCol(record);
        },
    }, ...columns,].map(item => ({ ...item, align: 'center' })) : columns;

    const mergeColumns = secCol.map(col => {
        const editable = col.editable === undefined ? true : col.editable; // 默认可编辑
        if (!editable) {
            return col;
        }
        return {
            ...col,
            render: (text, record) => {
                return <EditableCell params={{
                    record,
                    inputType: col.inputType, // 默认Input
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    form,
                    required: !(col.required === false), // 默认必输
                    inputDisabled: col.inputDisabled,
                    inputDefaultValue: col.inputDefaultValue,
                    selectOptions: col.selectOptions, // 下拉选类型
                }} />
            }
        };
    });

    function save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            console.log(row);
            const newData = [...dataSource];
            const index = newData.findIndex(item => key === item[rowKey]);
            console.log(index);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setEditingKey('');
                setButtonDisabled(false);
                props.setNewData(newData, tableType);
            } else {
                newData.push(row);
                setEditingKey('');
                setButtonDisabled(false);
                props.setNewData(newData, tableType);
            }
        });
    }

    function handleAdd() {
        // 注意 一定要实现深拷贝 不然父组件状态不会更新
        // const newArray = JSON.parse(JSON.stringify(dataSource));
        const newArray = dataSource.map(item => {
            return item;
        });
        // newArray.push({ id: guid() });
        const id = guid();
        const newData = isEmptyArray(newArray) ?
            [{ id, guid: guid(), recommendDemandId }] : [{ id, guid: guid(), recommendDemandId }, ...newArray];
        setNewData(newData, tableType); // 新增数据 + 所属哪个Table
        setEditingKey(id); // 新增处于编辑行
        setButtonDisabled(true); // 未保存无法操作
    }

    return (
        <EditableContext.Provider value={props.form}>
            <AutoSizeLayout>
                {(h) => <ExtTable
                    bordered
                    size='small'
                    height={400}
                    dataSource={dataSource || []}
                    columns={mergeColumns}
                    ref={tableRef}
                    showSearch={false}
                    rowKey={rowKey}
                    remotePaging={true}
                    // pagination={{
                    //     pageSizeOptions: ['5', '10', '15'],
                    //     defaultPageSize: 5,
                    // }}
                    toolBar={isToolBar ? {
                        left: (
                            <Button type="primary" onClick={handleAdd} disabled={buttonDisabled}>
                                新增
                            </Button>
                        ),
                    } : null}
                />}
            </AutoSizeLayout>
        </EditableContext.Provider>
    );
}

const EditableFormTable = Form.create()(EditableTable);

EditableTable.protoType = {
    //数据源
    dataSource: PropTypes.array,
    //列
    columns: PropTypes.array,
    //列表唯一key
    rowKey: PropTypes.string,
    //Tables是否需要operation  编辑行  删除选项
    isEditTable: PropTypes.bool,
    //是否显示工具栏（新增||删除 ReactNode）
    isToolBar: PropTypes.bool,
    // 页面处于编辑||详细
    type: PropTypes.any,
    // 页面所属 TABLE 标志
    tableType: PropTypes.string,
}

export default React.memo(EditableFormTable);