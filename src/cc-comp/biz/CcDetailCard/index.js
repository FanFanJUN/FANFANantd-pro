import React from 'react';
import {Card, Icon, Tooltip, Button} from 'antd';
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
           showContent: isEmpty(this.props.showContentState)? true : this.props.showContentState,
           showKeyWords: false, // 是否查看关键字段
           noKeyWordsContent: this.props.noKeyWordsContent, // 无关键信息
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

    setShow = (type) => {
        if(type==='show'){
            this.setState({showContent:false});
        }else {
            this.setState({showContent:true});
        }
    }

    handleShow = (type) => {
        this.setState(()=>({
                showKeyWords: !this.state.showKeyWords
         }))
         if(this.props.noKeyWordsContent) {
            this.props.setShowStatus(true);
            return;
        } 
        this.props.setShowStatus(type); // false 显示关键字段  true 查看详细字段
    }

    showSimple =() => {
       return <Tooltip title='查看关键信息'>
                    <Button key="keyWord" style={{marginRight: '20px', cursor: 'pointer', fontSize: '16px'}} onClick={()=>this.handleShow(false)}>更多</Button>
        </Tooltip>
    }

    showDetail = () => {
        return <Tooltip title='查看详细信息'>
        <Button key="detail" style={{marginRight: '20px'}} onClick={()=>this.handleShow(true)}>更多</Button>
    </Tooltip>
    }

    render() {
        const {collapse} = this.props;
        const {showContent, showKeyWords, noKeyWordsContent} = this.state;
        const title = this.props.title;
        const style = this.props.style;
        return (
            <Card
                style={{ width: '100%',border:'none',...style,}}
                title={title?[<div key="line" style={{'height':'80%','width':'5px',float:'left',
                    marginTop:'2px'}}>&nbsp;</div>
                    ,<span key="title" style={{fontWeight:"bold"}}>{title}</span>]:null}
                headStyle={{border:'none'}}
                bodyStyle={{padding:"0 24px 24px 15px",...this.props.bodyStyle}}
                bordered={false}
                extra={collapse===false ? null :
                showContent?
                [this.props.extra,
                    this.props.showKeyWord && (showKeyWords ?
                        this.showSimple()
                        :
                        this.showDetail()),    
                noKeyWordsContent? 
                <Icon type="right" key='downIcon' onClick={() => this.setShow('show')} style={{fontSize: '16px'}}/> 
                :   
                <Icon type="down" key='downIcon' onClick={() => this.showOrHidden('hidden')} style={{fontSize: '16px'}}/>,
                ]
                :
                [
                    noKeyWordsContent? 
                    [
                        this.showDetail(),
                        <Icon type="down" key='downIcon' onClick={() => this.setShow('hidden')} style={{fontSize: '16px'}}/>,
                    ]
                    :
                    <Icon type="right" key='downIcon' onClick={() => this.showOrHidden('show')} style={{fontSize: '16px'}}/>

                ]
               }
            >
                <div hidden={noKeyWordsContent ? showContent: !showContent}>

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
