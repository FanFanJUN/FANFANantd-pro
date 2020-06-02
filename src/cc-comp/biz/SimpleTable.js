/**
 * @description 封装 antd table,统一样式和配置，默认每列宽150，支持本地分页
 * @author 刘松林
 * @date 2018.9.19
 */
import React, {PureComponent} from 'react';
import {message, Table} from 'antd';
import {Resizable } from 'react-resizable';
import DefaultPage from './DefaultPage';
import PropTypes from 'prop-types';
import './StandardTable.css';
import { defaultPageSize } from '@/constants/comm';

//用户可以拖动列宽
const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
      return <th {...restProps} />;
    }
    return (
      <Resizable width={width} height={0} onResize={onResize}>
        <th {...restProps} />
      </Resizable>
    );
  };
//记录用户选择条数
function initTotalList(columns) {
    const totalList = [];
    columns.forEach(column => {
        if (column.needTotal) {
            totalList.push({ ...column, total: 0 });
        }
    });
    return totalList;
}

class SimpleTable extends PureComponent {
    constructor(props) {
        super(props);
        const { columns } = props;
        const needTotalList = initTotalList(columns);
        this.state = {
            selectedRowKeys: [],//已选择行的 rowkey
            selectedRows: [],//已选择的行数据
            pageInfo:{},//表格分页信息
            needTotalList,
            dataSource:[],//表格基础数据
            filterData:[],//过滤后数据，如果没有过滤条件，filterData=dataSource
            columns:[],//列配置
            scrollX:null,//是否横向滚动
            scrollY:null,//是否纵向滚动
            width:null,//宽度
            total:0,//数据总数，本地过滤用
            yHeight:1024, //表格高度，默认1024，传入的 props名为 heightY
            pageSize:props.pageSize,
        };
    }

    componentWillUnmount() {
        //移出监听表格大小变化并重绘高度和宽度
        window.removeEventListener('resize', this.updateSize.bind(this));
    }

    componentDidMount(){
        //如果没有指定高度，进行重绘监听
        if(!this.props.heightY) {
            this.updateSize();
            window.addEventListener('resize', this.updateSize.bind(this));
        }else{
            //如果指定高度不为 auto，就是设置高度+12的偏移量，否则就不设置纵向滚动
            if(this.props.heightY!=='auto'){
                this.setState({scrollY:this.props.heightY+12})
            }else{
                this.setState({scrollY:null})
            }

        }
        //自定义列配置，前增加一列序号，后增加一列空白行修复 antd table 列和数据对不齐的 bug
        this.customerCloumns(this.props.columns);
        //准备展示数据，主要为区分后端分页和前端分页
        this.prepareData(this.props.data);
    }

    //通过元素获取该元素到顶层的距离
    getElementTop(element){
        if(element){
            let actualTop = element.offsetTop;
            let current = element.offsetParent;
            while (current !== null){
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        }
        return 0;
    }

    //改变表格高度
    updateSize(){
        //当 simpleDiv 渲染后和heightY不等于 auto 的时候做
        if(this.simpleDiv&&this.props.heightY!=='auto'){
            //窗口可视高度-simpleDiv到顶高度-5的偏移量为表格的高度，此时simpleDiv正好到屏底
            let yHeight = document.body.clientHeight-this.getElementTop(this.simpleDiv)-5;
            //table 纵向滚动条长度，83为 分页条的高度
            let scrollY=(this.props.heightY?(this.props.heightY+12):(yHeight-83));
            this.setState({scrollY})
        }
    }

    /**
     * 准备数据，应为后端请求返回数据格式不统一，做一些处理
     * 后端可能返回直接展示数据也可能返回带分页信息数据，需要分别处理
     * 带分页信息的为后端分页，不带分页信息的为前端分页
     */
    prepareData = (data) => {
        let list;
        let total;
        if(data && data.status==='SUCCESS'){
            if (data.data instanceof Array) {
                list = data.data;
                total = data.data.length;
            } else {
                list = data.data.rows;
                total = data.data.records;
            }
        }
        else if(data && data.status==='FAILURE'){
            list = [];
            total =0;
            message.error(data.message)
        }
        else {
            if(data && data.rows){
                list = data.rows;
                total = data.records;
            }else {
                list = data;
                total = data?data.length:0;
            }
        }
        let size = this.state.pageInfo.rows ?
            this.state.pageInfo.rows :
            (this.props.pageSize ?
                this.props.pageSize :
                defaultPageSize);
        if(list && list.length>size && this.props.pagination !== false){
            this.setState({dataSource:list,filterData:list.slice(0,size),total});
        }else {
            this.setState({dataSource:list,filterData:list,total});
        }
        if(data && data.page !== this.state.pageInfo.page){
            this.setState({pageInfo:{...this.state.pageInfo,page:data.page}});
        }
    };

    customerCloumns = (columns) =>{
        let withSequence;
        //自动加序号列和补全列
        if(!this.props.noSequence){
            let sequence = {
                title: this.props.indexName,
                key:'sequence',
                width:this.props.sequenceWidth?this.props.sequenceWidth:60,
                align:"center",
                render: (text, record, index) => {
                    const {pageInfo} = this.state;
                    if(pageInfo.page&&pageInfo.rows){
                        return (pageInfo.page-1)*pageInfo.rows+index+1
                    }else {
                        return index+1
                    }
                }
            };
            withSequence = [sequence,...columns,
                {
                title: null,
                key:'blank',
                className:'blank-cell'
            }
        ];
        }else{
            withSequence = [...columns]
        }

        if(this.simpleDiv){
            //获取列的总长度
            let sumWidth = getTotalWith(withSequence);
            //simpleDiv宽度是否大于列总宽度，如果大于总宽度，需要设置 table 横向滚动条
            let diff = this.simpleDiv.offsetWidth - sumWidth;
            if(diff>=0){
                this.setState({columns:withSequence})
            }
            if(diff<0){
                this.setState({columns:withSequence,scrollX:sumWidth})
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        //指定选择行
        if(nextProps.rowsSelected) {
            const rowkeys = nextProps.rowsSelected.map(item => {
                return item[nextProps.rowKey || 'id']
            });
            this.setState({selectedRowKeys: rowkeys, selectedRows: nextProps.rowsSelected});
        }
        //改变数据
        if( JSON.stringify(nextProps.data)!==JSON.stringify(this.state.dataSource)){
            this.prepareData(nextProps.data);
        }
        //改变列配置
        if(nextProps.columns!==this.props.columns){
            this.customerCloumns(nextProps.columns);
        }
        // if(JSON.stringify(nextProps.columns)!==JSON.stringify(this.props.columns)){
        //     this.customerCloumns(nextProps.columns);
        // }
    }

    //行选择改变时
    handleRowSelectChange = (selectedRowKeys, selectedRows) => {
        const { needTotalList: list } = this.state;
        const { onSelectRow } = this.props;
        let needTotalList = [...list];
        needTotalList = needTotalList.map(item => {
            return {
                ...item,
                total: selectedRows.reduce((sum, val) => {
                    return sum + parseFloat(val[item.dataIndex], 10);
                }, 0),
            };
        });
        if (onSelectRow) {
            onSelectRow(selectedRows);
        }
        this.setState({ selectedRowKeys, needTotalList ,selectedRows});
    };

    onSelectAll=(selected, selectedRows, changeRows)=>{
        if(this.props.radio!==false){
            return;
        }
        if(selected){
            const {rowKey} = this.props;
            this.handleRowSelectChange(selectedRows.map(item=>item[rowKey||'id']),selectedRows)
        }else{
            this.cleanSelectedKeys()
        }
    };

    //列表分页
    handleTableChange = (pagination) => {
        const { pageChange } = this.props;
        const { dataSource } = this.state;
        this.setState({pageInfo:pagination});
        //是否是本地分页
        if(dataSource.length>pagination.rows){
            const {page , rows} = pagination;
            let filterData = dataSource.slice((page-1)*rows,page*rows);
            this.setState({filterData:filterData});
        }else {
            this.setState({filterData:dataSource});
        }
        if(pageChange){
            pageChange(pagination);
        }
    };

    //清除列选择
    cleanSelectedKeys = () => {
        this.handleRowSelectChange([], []);
    };

    //行点击事件，默认行点击选中
    rowClick = (record) => {
        const {rowKey} = this.props;
        if(this.props.radio!==false){
            //非checkBox或radio 时（单选时）如果已选则清空，否则选中
            this.state.selectedRowKeys.includes(record[rowKey||'id'])?
            this.handleRowSelectChange([],[]):
            this.handleRowSelectChange([record[rowKey||'id']],[record]);
        }else if(this.state.selectedRowKeys.includes(record[rowKey||'id'])){
            //多选时如果该条已选中，排除该条
            let keys = this.state.selectedRowKeys;
            keys.splice(keys.indexOf(record[rowKey||'id']), 1);

            let rows = this.state.selectedRows;
            rows.splice(rows.indexOf(record), 1);
            this.handleRowSelectChange(keys,rows);
        }else{
            //多选时该条未选中，新增该条选中
            let keys = this.state.selectedRowKeys;
            let rows = this.state.selectedRows;
            this.handleRowSelectChange([...keys,record[rowKey||'id']],[...rows,record]);
        }
    };

    //选中行样式设置
    rowClassName = (record) => {
        let row = this.state.selectedRows.filter(item => item === record);
        if(row && row.length>0){
            return record._isHighlightRow ? "tr-highlight-selected tr-size" : "tr-selected tr-size";
        }else{
            return record._isHighlightRow ? "tr-highlight tr-size" : "tr-size";
        }
    };

    //选择框配置，如果该条数据包含disabled字段，该行会根据这个字段的值来确定是否禁用选择框
    checkboxProps = (record) => {
        return {selectedRowKeys:this.state.selectedRowKeys.includes(record[this.props.rowKey||'id']),
                disabled:record.disabled};
    };

    //用户手动拉列宽度
    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
          const nextColumns = [...columns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return { columns: nextColumns };
        });
      };

    render() {
        const { selectedRowKeys,total,pageInfo,filterData,columns,scrollY, scrollX, pageSize} = this.state;
        const {
            checkBox,
            rowKey,
            loading,
            components,
            onRow,
            pageSizeOptions,
        } = this.props;

        const paginationProps = {
            total:total,
            pageInfo:pageInfo,
            onChange:this.handleTableChange,
            pageSize:pageSize,
            pageSizeOptions:pageSizeOptions,
        };

        const rowSelection = this.props.noCheckBox?null:{
            selectedRowKeys,
            columnWidth:62,
            type:checkBox,
            onSelect:this.rowClick,
            getCheckboxProps: this.checkboxProps,
            onSelectAll:this.onSelectAll
        };

        const columnsResize = columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
              width: column.width,
              onResize: this.handleResize(index),
            }),
            ellipsis: col.ellipsis !== false,
        }));
        return (
            <div id="defaultSimpleTable"
            className={this.props.className}
            ref={(div)=>this.simpleDiv=div}
            style={{background:'#fff',...this.props.style}}>
                <Table
                    ref={(table)=>this.table=table}
                    style={this.props.pagination === false?null:scrollY?{height:scrollY+50}:null}
                    rowKey={rowKey||'id'}
                    components={{...components,
                        header: {cell: ResizeableTitle}
                    }}
                    rowSelection={this.props.rowSelection?this.props.rowSelection:rowSelection}
                    dataSource={filterData}
                    bordered={true}
                    loading={loading}
                    pagination={false}
                    columns={columnsResize}
                    expandedRowRender={this.props.expandedRowRender}
                    rowClassName={this.rowClassName}
                    scroll={{y:scrollY?scrollY:null,x:scrollX}}
                    onRow={onRow || ((record,index) => {
                        return {
                            onClick: () => {this.rowClick(record,index)},       // 点击行
                        };
                    })
                    }
                    footer={this.props.footer}
                />
                {this.props.pagination === false ?null:<DefaultPage {...paginationProps}/>}
            </div>
        );
    }
}

//获取列宽度，默认每列宽150
function getTotalWith(columns) {
    let sum = 0;
    for(let i=0;i<columns.length;i++){
        let item  =  columns[i];
        if(!item.width){
            item.width=150;
            sum+=150;
        }else if(typeof item.width !== 'string'){
            sum+=item.width;
        }
        item.className='columns-size'
    }
    columns[columns.length-1].width=undefined;
    return sum-40;
}

SimpleTable.protoType={
    //指定高度，不指定高度会自动计算一屏的高度作为 table 高度，指定为 auto 不设定高度
    heightY:PropTypes.any,
    //列配置
    columns:PropTypes.array,
    //表格展示数据
    data:PropTypes.object.isRequired,
    //是否自动加序号列
    noSequence:PropTypes.bool,
    //父组件指定选择行
    rowsSelected:PropTypes.array,
    //行选择改变时回调
    onSelectRow:PropTypes.func,
    //列表分页时回调，返回pagination对象,当前页和每页条数{page:1,rows:15}
    pageChange:PropTypes.func,
    //rowKey,默认为 id
    rowKey:PropTypes.string,
    //noCheckBox,不显示选择框
    noCheckBox:PropTypes.bool,
    //是否显示加载
    loading:PropTypes.bool,
    //如果要去掉行点击选中需重写该方法
    onRow:PropTypes.any,
    //同 antd，重写成自己需要的
    rowSelection:PropTypes.any,
    //设置 div 样式
    className:PropTypes.string,
    //是否分页
    pagination:PropTypes.bool,
    //radio,是否是单选，默认为 true，
    radio:PropTypes.bool,
    // 序号的列名
    indexName: PropTypes.string
};

export default SimpleTable;
