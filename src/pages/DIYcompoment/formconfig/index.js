import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import AdvancedSearch from '@/cc-comp/biz/AdvancedSearch';
import { treeCofig, userConfig } from '@/cc-comp/biz/selectwithserviceConfig';
import { getUserData, filterEmptyFileds } from '@/utils/utils';
import SimpleTable from '@/cc-comp/biz/SimpleTable';
import './index.css';
import { CcCard, CcMessege } from '@/cc-comp/basic';

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
  {
    name: '审批状态',
    code: 'flowState',
    type: 'selectWithData',
    data: [{
      value: '',
      text: '全部',
    }, {
      value: 'INIT',
      text: '未审批',
    },
    {
      value: 'INPROCESS',
      text: '审批中',
    },
    {
      value: 'COMPLETED',
      text: '审批完成',
    }],
  },
  {
    name: '状态',
    code: 'state',
    type: 'selectWithData',
    data: [{
      value: '',
      text: '全部',
    }, {
      value: 'DRAFT',
      text: '草稿',
    },
    {
      value: 'EFFECT',
      text: '生效',
    },
    {
      value: 'CHANGING',
      text: '变更中',
    }],
  },
  {
    name: '来源类型',
    code: 'sourceType',
    type: 'selectWithData',
    data: [{
      value: '',
      text: '全部',
    }, {
      value: 'SYSTEM_GENERATED',
      text: '系统生成',
    },
    {
      value: 'MANUALLY_CREATE',
      text: '手工创建',
    }],
  },
  { name: '采购物料类别', code: 'materialCategoryCode', type: 'treeSelect', children: treeCofig },
  { name: '用户', code: 'id', type: 'searchTable', children: userConfig },
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
      pageNum: 1,
      pageSize: 10,
      quickSearchValue: {},
      advancedSearchValue: {},
      loading: false,
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.getDataSource();
  }

  // 获取列表数据公用方法
  getDataSource = (params = {}) => {
    // this.setState(() => ({
    //     loading: true,
    // }));
    let queryData = {
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      quickSearchValue: this.state.quickSearchValue,
      ...this.state.advancedSearchValue,
    };
    queryData = Object.assign(queryData, params);
    this.setState(() => ({
      loading: true,
    }));
    getUserData(filterEmptyFileds(queryData)).then((res) => {
      if (res) {
        const { dataSource, pagination } = res;
        const secRes = this.dealData(pagination, dataSource);
        this.setState({ dataSource: secRes });
      }
      this.setState(() => ({
        loading: false,
      }));
    });
  };

  handleAdvancedSearch=(params) => {
    console.log(params);
  }

  // 分页查询
  handlePageChange = (pageInfo) => {
    this.setState({
      pageSize: pageInfo.rows,
      pageNum: pageInfo.page,
    }, () => { this.getDataSource(); });
  }

   // 表格行选中
   handleRowSelectChange = (selectedRows) => {
     this.ButtonPermissions(selectedRows);
     this.setState({
       selectedRows,
     });
   }

checkOnlyOneSelect = () => {
  if (this.state.selectedRows.length === 0) {
    CcMessege.warning('请选择一行数据！');
    return false;
  }
  return true;
};

// 按钮权限
ButtonPermissions = (rows) => {
  let { buttonDisabled } = this.state;
  switch (rows.length) {
    case 0:
      buttonDisabled = {
        add: false, // 新增
        sync: false, // 同步
        edit: false, // 编辑
        del: false, // 删除
        details: false, // 明细
        confirm: false, // 提交审核
        history: false, // 审核历史
        withdraw: false, // 撤回
        syncHistory: false, // 同步历史
        updateState: false, // 同步状态修改
      };

      break;
    case 1:
      buttonDisabled = {
        add: false, // 新增
        sync: false, // 同步
        edit: false, // 编辑
        del: false, // 删除
        details: false, // 明细
        confirm: false, // 提交审核
        history: false, // 审核历史
        withdraw: false, // 撤回
        syncHistory: false, // 同步历史
        updateState: false,
      };
      // 同步 只有synchState状态为：待同步 UNSYNC ，同步失败SYNC_FAIL；流程状态flowState为：审批结束的才能点同步按钮
      const { synchState, flowState } = rows[0];
      if (flowState != 'COMPLETED' || (synchState === 'SYNC_SUCCESS' || synchState === 'SYNC')) {
        buttonDisabled.sync = true;
      }
      // 编辑  //删除
      if (rows[0].state != 'DRAFT' || rows[0].flowState != 'INIT') { buttonDisabled.edit = true; buttonDisabled.del = true; }
      // 提交审核
      if (rows[0].flowState != 'INIT') { buttonDisabled.confirm = true; }
      // 审核历史
      if (rows[0].flowState == 'INIT') { buttonDisabled.history = true; }
      // 撤回
      if (rows[0].synchState != 'SYNC_FAIL' || rows[0].sourceType == 'SYSTEM_GENERATED') { buttonDisabled.withdraw = true; }
      // //同步历史
      // if(rows[0].state =='DRAFT')  {buttonDisabled.syncHistory = true}
      // 只有已同步状态可修改
      if (synchState != 'SYNC') {
        buttonDisabled.updateState = true;
      }
      break;
    default:
      buttonDisabled = {
        add: false, // 新增
        sync: true, // 同步
        edit: true, // 编辑
        del: true, // 删除
        details: true, // 明细
        confirm: true, // 提交审核
        history: true, // 审核历史
        withdraw: true, // 撤回
        syncHistory: true, // 同步历史
      };
      break;
  }
  this.setState({ buttonDisabled });
}

  dealData =(pagination, dataSource) => {
    return {
      // message: '操作成功！',
      // status: 'SUCCESS',
      // statusCode: 200,
      // success: true,
      page: pagination.current,
      records: pagination.total,
      total: 2,
      rows: dataSource,
    };
  }

  // 高级查询
  handleAdvancedSearch = (params) => {
    // 创建时间
    // if(params.createdDate){
    //     params.createdStartDate = params.createdDate[0].format('YYYY-MM-DD 00:00:01');
    //     params.createdEndDate = params.createdDate[1].format('YYYY-MM-DD 23:59:59');
    // }
    // delete params.createdDate;
    this.setState(() => ({
      pageNum: 1,
      advancedSearchValue: params,
    }), () => { this.getDataSource(); });
  };

  // 快速查询
  handleSearch = (value) => {
    this.setState({
      quickSearchValue: value,
      pageNum: 1,
    }, () => { this.getDataSource(); });
  }

  handleDelete=() => {
    if (this.checkOnlyOneSelect()) {

    }
  }
  render() {
    const { dataSource, selectedRows } = this.state;
    return (
      <div className="table-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 5, paddingBottom: 5 }}>
          <div style={{ width: 'calc(100% - 480px)' }}>
            <Button style={{ marginRight: '5px' }} type="primary" onClick={this.handleDelete}>删除</Button>
          </div>
          <div style={{ display: 'flex', width: '480px', justifyContent: 'flex-end', paddingRight: 20 }}>
            <Search placeholder="请输入" enterButton onSearch={value => this.handleSearch(value)} />
            <AdvancedSearch initToggle={false} handleSearch={this.handleAdvancedSearch} config={advancedSearchConfig} />
          </div>
        </div>
        <SimpleTable
          rowKey="id"
          radio
          rowsSelected={selectedRows}
          onSelectRow={this.handleRowSelectChange}
          pageChange={this.handlePageChange}
          data={dataSource}
          loading={this.state.loading}
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
