/**
*当服务需要传递参数时候使用
 */

import React, {Component} from 'react';
import {TreeSelect} from 'antd';

const TreeNode = TreeSelect.TreeNode;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;
export default class TreeSelectWithService extends Component{
    constructor(props){
        super(props);
        this.state={
            value:undefined,
            dataSource:[],
            params:this.props.params ? this.props.params : ''
        }
    }

    componentDidMount(){
        if(!this.props.noRequest){
            this.getDataSource(this.state.params)
        }
    }

    componentWillReceiveProps(nextProp) {
        //  console.log(nextProp,this.state.params)
        if(nextProp.params && nextProp.params!==this.state.params){
            this.setState({
                params:nextProp.params
            },()=>{
                if(!this.props.noRequest){
                    this.getDataSource(this.state.params)
                }
            });
        }
    }

    getDataSource(){
        this.props.config.service(this.props.params).then((res)=>{
            if(this.props.initValue && res.data && res.data.length>0){
                const {key} = this.props.config;
                this.setState({dataSource:res.data,value:res.data[0][key]})
            }else if(res.data&&res.data.rows){
                this.setState({dataSource:res.data.rows})
            } else if(res.data){
                this.setState({dataSource:res.data})
            }else{
                this.setState({dataSource:res})
            }

        })
    };

    handleChange = (value) => {
        this.setState({value:value});
        if(this.props.onChange){
            this.props.onChange(value,this.getNodesByKeys(this.state.dataSource,value));
        }
    };

    getAllTreeNode(){
        const {key,text,extraText} = this.props.config;
        return this.getTreeNode(this.state.dataSource,key,text,extraText)
    }

    filterTreeNode = (inputValue,treeNode) =>{
        if(treeNode.props.data.code && treeNode.props.data.name){
            return treeNode.props.data.code.startsWith(inputValue)||treeNode.props.data.name.startsWith(inputValue)
        }
    };

    /**
     * 根据key获取节点信息
     * @param treeData
     * @param key
     * @returns {*}
     */
    getNodeByKey = (treeData, key) => {
        for (let item of treeData) {
            if (item[key] === key) {
                return item
            }
            else if(item[`${this.props.config.key}`]===key){
                return item
            }else {
                if (item.children&&item.children.length > 0) {
                    if (this.getNodeByKey(item.children, key)) {
                        return this.getNodeByKey(item.children, key);
                    }
                }else if (item.childrenList&&item.childrenList.length > 0) {
                    if (this.getNodeByKey(item.childrenList, key)) {
                        return this.getNodeByKey(item.childrenList, key);
                    }
                }
            }
        }
    };
    getNodesByKeys=(treeData, keys)=>{
        let nodes=[];
        if(keys instanceof Array){
            for (let key of keys){
                let node=this.getNodeByKey(treeData,key);
                nodes.push(node)
            }
        }else {
            return this.getNodeByKey(treeData,keys)
        }
        return nodes;
    };

    getTreeNode(treeData,key,text,extraText){
        let treeNodeArray =[];
        //反向禁用下层
        if(this.props.onlyHead) {
            for (let i = 0; i < treeData.length; i++) {
                let treeNode = treeData[i];
                if (treeNode.level) {
                    treeNode['nodeLevel'] = treeNode.level;
                }
                if (treeNode.children && treeNode.children.length > 0) {
                    treeNodeArray.push(<TreeNode value={treeNode[key]} data={treeNode}
                                                 disabled={treeNode.nodeLevel > this.props.config.nodeLevel}
                                                 disableCheckbox={treeNode.nodeLevel > this.props.config.nodeLevel}
                                                 key={treeNode.id}
                                                 title={treeNode[extraText] ? (treeNode[text] + '  ' + treeNode[extraText]) : treeNode[text]}>
                      {this.getTreeNode(treeNode.children, key, text, extraText)}
                    </TreeNode>)
                } else if (treeNode.childrenList && treeNode.childrenList.length > 0) {
                    treeNodeArray.push(<TreeNode value={treeNode[key]} data={treeNode}
                                                 disabled={treeNode.nodeLevel > this.props.config.nodeLevel}
                                                 disableCheckbox={treeNode.nodeLevel > this.props.config.nodeLevel}
                                                 key={treeNode.id}
                                                 title={treeNode[extraText] ? (treeNode[text] + '  ' + treeNode[extraText]) : treeNode[text]}>
                      {this.getTreeNode(treeNode.childrenList, key, text, extraText)}
                    </TreeNode>)
                } else {
                    treeNodeArray.push(<TreeNode value={treeNode[key]} data={treeNode} isLeaf key={treeNode.id}
                                                 disabled={treeNode.nodeLevel > this.props.config.nodeLevel}
                                                 disableCheckbox={treeNode.nodeLevel > this.props.config.nodeLevel}
                                                 title={treeNode[extraText] ? (treeNode[text] + '  ' + treeNode[extraText]) : treeNode[text]}/>)
                }
            }
        }else{
            for (let i = 0; i < treeData.length; i++) {
                let treeNode = treeData[i];
                if (treeNode.level) {
                    treeNode['nodeLevel'] = treeNode.level;
                }
                if (treeNode.children && treeNode.children.length > 0) {
                    treeNodeArray.push(<TreeNode value={treeNode[key]} data={treeNode}
                                                 disabled={treeNode.nodeLevel < this.props.config.nodeLevel}
                                                 disableCheckbox={treeNode.nodeLevel < this.props.config.nodeLevel}
                                                 key={treeNode.id}
                                                 title={treeNode[extraText] ? (treeNode[text] + '  ' + treeNode[extraText]) : treeNode[text]}>
                      {this.getTreeNode(treeNode.children, key, text, extraText)}
                    </TreeNode>)
                } else if (treeNode.childrenList && treeNode.childrenList.length > 0) {
                    treeNodeArray.push(<TreeNode value={treeNode[key]} data={treeNode}
                                                 disabled={treeNode.nodeLevel < this.props.config.nodeLevel}
                                                 disableCheckbox={treeNode.nodeLevel < this.props.config.nodeLevel}
                                                 key={treeNode.id}
                                                 title={treeNode[extraText] ? (treeNode[text] + '  ' + treeNode[extraText]) : treeNode[text]}>
                      {this.getTreeNode(treeNode.childrenList, key, text, extraText)}
                    </TreeNode>)
                } else {
                    treeNodeArray.push(<TreeNode value={treeNode[key]} data={treeNode} isLeaf key={treeNode.id}
                                                 title={treeNode[extraText] ? (treeNode[text] + '  ' + treeNode[extraText]) : treeNode[text]}/>)
                }
            }
        }
        return treeNodeArray;
    }

    componentDidUpdate(){
        const defaultValue=this.props.value;
        if(this.state.value === defaultValue){
            return;
        }
        if(this.props.initValue && !defaultValue){
            const {key} = this.props.config;
            if(this.state.dataSource && this.state.dataSource.length>0){
                this.setState({value:this.state.dataSource[0][key]});
                this.props.onChange(this.state.dataSource[0][key]);
            }
        }else{
            this.setState({value:defaultValue})
        }
    }
    //展开时是否重新加载数据
    onDropdownVisibleChange=(open)=>{
        if (this.props.noRequest||open&&this.props.loadByOpen){
            this.getDataSource()
        }
    };
    render() {
        return (
          <TreeSelect
                onDropdownVisibleChange={this.onDropdownVisibleChange}
                disabled={this.props.disabled}
                showSearch
                treeDefaultExpandAll={this.props.expandAll}
                style={{ width: '100%' }}
                value={this.state.value}
                dropdownStyle={{ maxHeight: 260, overflow: 'auto' }}
                placeholder={this.props.placeholder||"请选择"}
                allowClear={true}
                multiple={this.props.multiple}
                treeCheckable={this.props.treeCheckable}
                showCheckedStrategy={SHOW_CHILD}
                treeNodeFilterProp={'title'}
                // filterTreeNode={this.filterTreeNode}
                onChange={this.handleChange}
            >
            {this.getAllTreeNode()}
          </TreeSelect>
        );
    }
}

