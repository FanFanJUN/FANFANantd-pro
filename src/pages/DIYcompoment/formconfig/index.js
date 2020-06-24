import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import AdvancedSearch from '@/cc-comp/biz/AdvancedSearch';
import { treeCofig, userConfig } from '@/cc-comp/biz/selectwithserviceConfig';
import { getUserData } from '@/utils/utils';
import SimpleTable from '@/cc-comp/biz/SimpleTable';
import './index.css';
import { CcCard } from '@/cc-comp/basic';

const { Search } = Input;
const advancedSearchConfig = [
  {
    name: '同步状态',
    code: 'synchState',
    type: 'selectWithData',
    // mode: 'multiple', 多选
    data: [{
      value: '',
      text: '全部',
    }, {
      value: 'UNSYNC',
      text: '待同步',
    },
    {
      value: 'SYNC',
      text: '已同步',
    },
    {
      value: 'SYNC_SUCCESS',
      text: '同步成功',
    },
    {
      value: 'SYNC_FAIL',
      text: '同步失败',
    }],
  },
  // {
  //   name: '审批状态',
  //   code: 'flowState',
  //   type: 'selectWithData',
  //   data: [{
  //     value: '',
  //     text: '全部',
  //   }, {
  //     value: 'INIT',
  //     text: '未审批',
  //   },
  //   {
  //     value: 'INPROCESS',
  //     text: '审批中',
  //   },
  //   {
  //     value: 'COMPLETED',
  //     text: '审批完成',
  //   }],
  // },
  // {
  //   name: '状态',
  //   code: 'state',
  //   type: 'selectWithData',
  //   data: [{
  //     value: '',
  //     text: '全部',
  //   }, {
  //     value: 'DRAFT',
  //     text: '草稿',
  //   },
  //   {
  //     value: 'EFFECT',
  //     text: '生效',
  //   },
  //   {
  //     value: 'CHANGING',
  //     text: '变更中',
  //   }],
  // },
  // {
  //   name: '来源类型',
  //   code: 'sourceType',
  //   type: 'selectWithData',
  //   data: [{
  //     value: '',
  //     text: '全部',
  //   }, {
  //     value: 'SYSTEM_GENERATED',
  //     text: '系统生成',
  //   },
  //   {
  //     value: 'MANUALLY_CREATE',
  //     text: '手工创建',
  //   }],
  // },
  // { name: 'SRM采购信息记录号', code: 'purchaseInfoRecordNumber' },
  // { name: '来源定价单号', code: 'calibrationCode' },
  { name: '采购物料类别', code: 'materialCategoryCode', type: 'treeSelect', children: treeCofig },
  { name: '用户', code: 'id', type: 'searchTable', children: userConfig },
  //   { name: '采购组织', code: 'purchaseOrgCode', type: 'searchTable', children: purchaseOrgConfigWithDataAuthForCode },
  //   { name: '专业组', code: 'purchaseDepartmentName', type: 'searchTable', children: purchaseDepartmentConfigForName },
  { name: '创建人', code: 'creatorName' },
  {
    name: '创建时间',
    code: 'createdDate',
    type: 'rangePicker',
  },
];

const columns = [
  {
    dataIndex: 'id',
    title: '编号',
    align: 'center',
  },
  {
    dataIndex: 'name',
    title: '名字',
    align: 'center',
  },
  {
    dataIndex: 'sex',
    title: '性别',
    align: 'center',
    // render: (sex) => {
    //   // if (sex === '1') {
    //   //   return '女';
    //   // } else {
    //   //   return '男';
    //   // }
    //   return sex && getDicNameByKey(sex, 'SEX', this.state.optionsData);
    // },
  },
  {
    dataIndex: 'idnumber',
    title: '号码',
    align: 'center',
  },
  {
    dataIndex: 'description',
    title: '介绍',
    align: 'center',
  },
  // {
  //   dataIndex: 'birthdate',
  //   title: '生日',
  //   align: 'center',
  //   render: (birthdate) => {
  //     return birthdate && moment(birthdate).format('YYYY-MM-DD');
  //   },
  // }
];

class Mudle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  componentDidMount() {
    getUserData({ pageSize: 10, pageNum: 1 }).then((res) => {
      if (res) {
        const { dataSource, pagination } = res;
        const secRes = {
          // message: '操作成功！',
          // status: 'SUCCESS',
          // statusCode: 200,
          // success: true,
          page: pagination.current,
          records: pagination.total,
          total: 2,
          rows: dataSource,
        };
        this.setState({ dataSource: secRes });
      }
    });
  }

  handleAdvancedSearch=(params) => {
    console.log(params);
  }

  render() {
    const { dataSource } = this.state;
    return (
        <div className="table-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 5, paddingBottom: 5 }}>
            <div style={{ width: 'calc(100% - 480px)' }}>
              <Button style={{ marginRight: '5px' }} type="primary">测试</Button>
            </div>
            <div style={{ display: 'flex', width: '480px', justifyContent: 'flex-end', paddingRight: 20 }}>
              <Search placeholder="请输入SRM采购信息记录号" enterButton />
              <AdvancedSearch initToggle={false} handleSearch={this.handleAdvancedSearch} config={advancedSearchConfig} />
            </div>
          </div>
          <SimpleTable
            rowKey="id"
            radio
        // rowsSelected={selectedRows}
        // onSelectRow={this.handleRowSelectChange}
        // pageChange={this.handlePageChange}
            data={dataSource}
        // loading={loading}
            columns={columns}
          />
        </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tableData: state.namespace,
    tableLoading: state.loading.effects['sysdic/method'],
  };
}
export default connect(mapStateToProps)(Form.create()(Mudle));
