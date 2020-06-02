import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import { defaultPageSize, defaultPageSizeOptions } from '@/constants/comm';

/**
 * @description 重写 antd 分页组件，方便统一样式s
 * @author LC@1981824361
 * @date 2020-06-02
 * @class DefaultPage
 * @extends {React.Component}
 */
class DefaultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:1
        }
    }
    //分页
    onChangePage = (page,pageSize) =>{
        let pageInfo = {"page": page, "rows": pageSize};
        this.props.onChange(pageInfo);
        this.setState({currentPage:page})
    };

    onShowSizeChange = (current, size) =>{
        let pageInfo = {"page":current,"rows":size};
        this.props.onChange(pageInfo);
        this.setState({currentPage:current})
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.pageInfo && Object.keys(nextProps.pageInfo).length>0){
            this.setState({currentPage:nextProps.pageInfo.page})
        }
    }

    render() {
        return (
            <div id="pageInfo">
                <Pagination
                    size="small"
                    style={{background:'#F3F8FC',fontSize: 12,textAlign:"center",paddingTop:6,paddingBottom:6,position: 'relative'}}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    defaultPageSize={this.props.pageSize ? this.props.pageSize :defaultPageSize}
                    pageSizeOptions={this.props.pageSizeOptions ? this.props.pageSizeOptions : defaultPageSizeOptions}
                    onChange={this.onChangePage}
                    onShowSizeChange={this.onShowSizeChange}
                    total={this.props.total}
                    defaultCurrent={1}
                    current={this.state.currentPage}
                    showTotal={() => `共 ${this.props.total} 条`}/>
            </div>
        )
    }
}

DefaultPage.propTypes={
    //分页回调方法
    onChange:PropTypes.func.isRequired,
    //回传自定义页数
    pageInfo:PropTypes.object,
    //需要分页总数
    total:PropTypes.number.isRequired
};

export default DefaultPage
