import React from 'react';
import {Card, Icon} from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from '@/utils/utils';


/**
 * @description 继承 antd 的 card 实现展示面板共同，统一样式
 * @author LC@1981824361
 * @date 2020-08-24
 * @class DetailCard
 * @extends {React.Component}
 */
class DetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showContent: isEmpty(this.props.showContentState)? true : this.props.showContentState
        };
    }

    componentWillReceiveProps(nextProps) {
        if(!isEmpty(nextProps.showContentState) && nextProps.showContentState !== this.state.showContent){
            this.setState({showContent:nextProps.showContentState})
        }
    }

    showOrHidden = (type) => {
        if(type==='show'){
            this.setState({showContent:true})
        }else {
            this.setState({showContent:false})
        }
    };


    render() {
        const {showContent} = this.state;
        const title = this.props.title;
        const style = this.props.style;
        return (
            <Card
                style={{ width: '100%',border:'none',...style,}}
                title={title?[<div key="line" style={{'height':'80%','width':'5px',float:'left',
                    'background':'rgb(30, 160, 222)',marginTop:'2px'}}>&nbsp;</div>
                    ,<span key="title" style={{fontWeight:"bold"}}>{title}</span>]:null}
                headStyle={{border:'none'}}
                bodyStyle={{padding:"0 24px 24px 15px",...this.props.bodyStyle}}
                bordered={false}
                extra={this.props.collapse===false ? null :
                    showContent?[this.props.extra,<Icon type="down" key='downIcon' onClick={() => this.showOrHidden('hidden')}/>]
                :<Icon type="right" key='downIcon' onClick={() => this.showOrHidden('show')}/>}
            >
                <div hidden={!showContent}>

                    {
                        this.props.content?this.props.content:
                        React.Children.map(this.props.children, (child, i) => {
                        return child;
                    })}
                </div>
            </Card>
        )
    }
}

DetailCard.defaultProps={
    //默认不收起
    collapse:false
};

DetailCard.propTypes={
    //详细清单标题
    title:PropTypes.any,
    //是否显示收缩按钮
    collapse:PropTypes.bool,
    //reactNode,显示内容
    content:PropTypes.any
};


export default DetailCard
