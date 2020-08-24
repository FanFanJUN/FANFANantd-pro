
import React, {PureComponent} from 'react';
import {Button, Row, Input, Col} from 'antd';
import PropTypes from 'prop-types'
import { filterEmptyFileds, checkNull } from '@/utils/utils';
import SimpleTable from '../SimpleTable';

class TransferTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rightRowsSelected: [],
            leftRowsSelected: [],
            keyWord: '',
            quickSearchValue: '',
            rightLoading:false,
            leftLoading:false,
            rightDisabled:true,
            leftDisabled:true,
            leftPageInfo:{
                page: 1,
                rows: 15,
            },
            rightPageInfo:{
                page: 1,
                rows: 15,
            },
            rightData: [],
            leftData: [],
            rightSearch: '',
        }
    }

    componentWillMount() {
        this.loadLeftData(null, this.state.leftPageInfo);
        this.loadRightData(null,this.state.rightPageInfo);

    }

    loadLeftData = (value,pageInfo) => {
        const {leftService, formData} = this.props;
        this.setState({leftLoading:true});
        // 左table接口请求 暂时屏蔽
        // leftService({...value,...pageInfo, ...formData}).then(res => {
        //     this.setState({leftData: res,leftLoading:false,leftRowsSelected:[],rightDisabled:true,leftDisabled:true})
        // }).catch(err => {
        //     this.setState({leftLoading:false});
        // })
    }

    loadRightData = (value,pageInfo) => {
        const {formData, rightSearchService, rightService} = this.props;
        const { rightSearch } = this.state;
        this.setState({rightLoading:true});
        let service = null;
        if(!checkNull(rightSearch)) {
            service = rightSearchService;
        } else{
            service = rightService;
        }
        // 右table接口请求 暂时屏蔽
        // service(filterEmptyFileds({...value,...pageInfo,...formData})).then(res => {
        //     this.setState({rightData: res,rightLoading:false,rightRowsSelected:[],rightDisabled:true,leftDisabled:true})
        // }).catch(err => {
        //     this.setState({rightLoading:false});
        // })
    }

    rightOnSelectRow = (selectedRows) => {
        if(selectedRows.length === 0){
            this.setState({rightDisabled:true})
        }else {
            this.setState({rightDisabled:false})
        }
        this.setState({rightRowsSelected: selectedRows})
    }

    leftOnSelectRow = (selectedRows) => {
        if(selectedRows.length === 0){
            this.setState({leftDisabled:true})
        }else {
            this.setState({leftDisabled:false})
        }
        this.setState({leftRowsSelected: selectedRows})
    }

    leftPageChange = (pageInfo) => {
        this.setState({leftPageInfo:pageInfo});
        this.loadLeftData({keyWord:this.state.keyWord},pageInfo);
    }

    rightPageChange = (pageInfo) => {
        this.setState({rightPageInfo:pageInfo});
        this.loadRightData({quickSearchValue:this.state.quickSearchValue},pageInfo);
    }

    handleLeftSearch = (value) => {
        this.setState({keyWord:value})
        this.loadLeftData({keyWord:value}, this.state.leftPageInfo)
    }

    handleRightSearch = (value) => {
        this.setState(()=>({
            quickSearchValue:value,
            rightSearch: 'rightSearch',
        }), ()=>{this.loadRightData({quickSearchValue:value}, this.state.rightPageInfo);})
    }

    handleRightClick = () => {
        this.props.handleRightClick(this.state.leftRowsSelected).then(() => {
            this.loadRightData();
            this.loadLeftData();
        })
    }

    handleLeftClick = () => {
        this.props.handleLeftClick(this.state.rightRowsSelected).then(()=>{
            this.loadLeftData();
            this.loadRightData();
        })
    }

    render() {
        const {
            rightData,
            leftData,
        } = this.state

        const {leftColumns, rightColumns, leftTitle, rightTitle} = this.props

        const leftSearch = () => {
            return (<Input.Search
                placeholder="请输入代码或名称查询"
                onSearch={value => this.handleLeftSearch(value)}
                enterButton
            />)
        }

        const rightSearch = () => {
            return (<Input.Search
                placeholder="请输入代码或名称查询"
                onSearch={value => this.handleRightSearch(value)}
                enterButton
            />)
        }

        return (
            <Row style={{
                width:this.props.width?this.props.width:'100%'}}
                 type="flex" justify="space-around" align="middle" gutter={8}>
                <Col key='left' span={11}>
                    <Row style={{background:'#F3F8FC',paddingTop:10,paddingBottom:5}}>
                        <Col span={12}>{<span className='header-span'>&nbsp;{leftTitle}</span>}</Col>
                        <Col span={12} style={{textAlign:'right'}}>{leftSearch()}</Col>
                    </Row>
                    <SimpleTable
                        checkBox
                        data={leftData}
                        loading={this.state.leftLoading}
                        style={{overflow: 'auto',height:this.state.yHeight}}
                        rowsSelected={this.state.leftRowsSelected}
                        columns={leftColumns}
                        pageChange={this.leftPageChange}
                        scroll={{y: this.state.yHeight}}
                        onSelectRow={this.leftOnSelectRow}
                        radio={false}
                    />
                </Col>
                <Col key='middle' span={1} style={{textAlign:'center'}}>
                    <Button key="rightButton" style={{'marginBottom': '30px', 'width': '44px'}} icon="left"
                            disabled={this.state.rightDisabled}
                            onClick={this.handleLeftClick}/>
                    <Button key="leftButton" style={{'marginBottom': '30px', 'width': '44px'}} icon="right"
                            disabled={this.state.leftDisabled}
                            onClick={this.handleRightClick}/>
                </Col>
                <Col key='right' span={11}>
                    <Row style={{background:'#F3F8FC',paddingTop:10,paddingBottom:5}}>
                        <Col span={12}>{<span className='header-span'>&nbsp;{rightTitle}</span>}</Col>
                        <Col span={12} style={{textAlign:'right'}}>{rightSearch()}</Col>
                    </Row>
                    <SimpleTable
                        checkBox
                        style={{overflow: 'auto',height:this.state.yHeight}}
                        loading={this.state.rightLoading}
                        data={rightData}
                        columns={rightColumns}
                        rowsSelected={this.state.rightRowsSelected}
                        onSelectRow={this.rightOnSelectRow}
                        pageChange={this.rightPageChange}
                        radio={false}
                    />
                </Col>
            </Row>
        );
    }
}

TransferTable.propTypes = {
    rightService: PropTypes.any,
    leftService: PropTypes.any,
    handleRightClick: PropTypes.func,
    handleLeftClick: PropTypes.func,
    leftColumns: PropTypes.any,
    rightColumns: PropTypes.any,
    leftTitle: PropTypes.any,
    rightTitle: PropTypes.any,
};

export default TransferTable;
