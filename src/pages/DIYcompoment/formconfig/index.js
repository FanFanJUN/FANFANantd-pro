import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import AdvancedSearch from '@/cc-comp/biz/AdvancedSearch';
import { treeCofig, userConfig } from '@/cc-comp/biz/selectwithserviceConfig';
import { getUserData, filterEmptyFileds, getDicNameByKey } from '@/utils/utils';
import SimpleTable from '@/cc-comp/biz/SimpleTable';
import './index.css';
import { CcCard, CcMessege } from '@/cc-comp/basic';
import { toExcel, formatJson } from '@/utils/commonutil/ToExcelUtils';
import { ApproveHistory } from '@/cc-comp/biz';
import { mock } from '@/constants/comm';

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
  { name: '用户', code: 'id', type: 'searchTable', children: userConfig }, // 单选
  { name: '用户', code: 'id', type: 'SearchTableForMultiple', children: userConfig }, // 多选
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

const columsor  = [
  {
      title: '状态', dataIndex: 'state', width: 60, align: 'center', render: ((text) => {
          switch (text) {
              case 'DRAFT':
                  return '草稿';
              case 'EFFECT':
                  return '生效';
              case 'CHANGING':
                  return '变更中'
          }
      })
  },
  {title: '审批状态', dataIndex: 'flowStatusRemark', align: 'center', width: 100},
  {
      title: '生成状态',
      dataIndex: 'calibrationResultStatus',
      align: 'center',
      width: 100,
      render: (text) => (text === true ? '生成成功' : text === false ? '生成失败' : '')
  },
  {title: '是否作废', dataIndex: 'whetherDeleted', width: 80, align: 'center', render: (text) => (text ? '是' : '否')},
  {title: '是否变更', dataIndex: 'whetherChanged', width: 80, align: 'center', render: (text) => (text ? '是' : '否')},
  {title: '定价单号', dataIndex: 'calibrationCode', align: 'center',},
  {title: '来源类型', dataIndex: 'srcDocTypeEnumRemark', align: 'center', width: 80},
  {title: '来源单号', dataIndex: 'sourceCode'},
  {title: '说明', dataIndex: 'calibrationExplain', width: 240},
  {title: '采购公司', dataIndex: 'calibrationCorporationName', width: 200,},
  {title: '采购组织代码', dataIndex: 'purchaseOrgCode', width: 120,align: 'center'},
  {title: '采购组织', dataIndex: 'purchaseOrgName', width: 200,},
  {title: '专业组', dataIndex: 'purchaseDepartmentName', width: 200,},
  {title: '申请人', dataIndex: 'operatorName',},
  {title: '申请日期', dataIndex: 'workDate', render: (text) => (text.slice(0, 10)), align: 'center',},
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
      data: [],
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
        this.setState({ dataSource: secRes, data: dataSource });
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
    // return {
    //   // message: '操作成功！',
    //   // status: 'SUCCESS',
    //   // statusCode: 200,
    //   // success: true,
    //   page: pagination.current,
    //   records: pagination.total,
    //   total: 2,
    //   rows: dataSource,
    // };
    return mock;
  }

  // 高级查询
  handleAdvancedSearch = (params) => {
    console.log(params);
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

  // 导入数据导出 方便校验
  handleExport =() => {
    const { data } = this.state;
    if (data.length === 0) {
      message.warning('无数据可导出');
      return;
    }
    const th = columns.map(item => {
      return item.title;
    });
    const index = columns.map(item => {
      return item.dataIndex;
    });
    data.forEach((item) => {
      if (item.sex === '1') {
        item.sex = '男';
      } else {
        item.sex = '女';
      }
    });

    const chooseData = formatJson(index, data);
    toExcel(th, chooseData, '前端导出数据', 'xlsx', 'sheet');
  }

  render() {
    const { dataSource, selectedRows } = this.state;
    return (
      <div className="table-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 5, paddingBottom: 5 }}>
          <div style={{ width: 'calc(100% - 480px)' }}>
            <Button style={{ marginRight: '5px' }} type="primary" onClick={this.handleDelete}>删除</Button>
            <Button style={{ marginRight: '5px' }} type="primary" onClick={this.handleExport}>前端导出</Button>
          </div>
          <div style={{ display: 'flex', width: '480px', justifyContent: 'flex-end', paddingRight: 20 }}>
            <Search placeholder="请输入" enterButton onSearch={value => this.handleSearch(value)} />
            <AdvancedSearch initToggle={false} handleSearch={this.handleAdvancedSearch} config={advancedSearchConfig} />
          </div>
        </div>
        <SimpleTable
          rowKey="id"
          // radio
          rowsSelected={selectedRows}
          onSelectRow={this.handleRowSelectChange}
          pageChange={this.handlePageChange}
          data={dataSource}
          loading={this.state.loading}
          columns={columsor}
        />
        {/* <ApproveHistory
          relatedId={selectedRows[0] ? selectedRows[0].id : ''}
          // historyKey={this.state.historyKey}
          // setHistoryKey={this.setHistoryKey}
        /> */}
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
