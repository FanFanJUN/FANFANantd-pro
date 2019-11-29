/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Card, Row, Col, Tree, Tabs, Tooltip, Icon, Alert, Form, Modal } from 'antd';
import { CcMessege } from '@/cc-comp/basic';
import { createRouteid } from '@/utils/utils';
import { connect } from 'dva';
import BasicInfo from './basicinfo';

const { TreeNode } = Tree;
const { TabPane } = Tabs;

class ResourcePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      NodeTreeItem: null, // 右键菜单
      routeid: createRouteid(),
      rightNodeinfo: {},
      selectedNodeInfo: {},
      defaultKeys: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    dispatch({
      type: 'resource/create',
      routeid,
    });
    this.initQuery();
  }

    onLoadData = treeNode => {
      const { dispatch } = this.props;
      const { routeid } = this.state;
      const parentNo = treeNode.props.dataRef.resourceNo; // 节点资源编号
      return new Promise(resolve => {
        if (treeNode.props.children) {
          resolve();
          return;
        }
        // unitTree为命名空间，fetch 为effects 中的方法
        dispatch({
          type: 'resource/getTreeData',
          payload: { parentNo },
          routeid,
        }).then(() => {
          const { resData } = this.props;
          const { dataSource } = resData[routeid];
          treeNode.props.dataRef.children = dataSource;
          // treeData 为数据源
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        });
      });
    }

    getNodeTreeMenu() {
      const { pageX, pageY } = { ...this.state.NodeTreeItem };
      const tmpStyle = {
        position: 'absolute',
        maxHeight: 40,
        textAlign: 'center',
        left: `${pageX + 20}px`,
        top: `${pageY + 130}px`,
        // left: `${pageX - 220}px`,
        // top: `${pageY - 102}px`,
        display: 'flex',
        flexDirection: 'row',
        border: '1px soild #d9d9d9',
      };
      const menu = (
        <div
          style={tmpStyle}
        >
          <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={this.handleAddSub}>
            <Tooltip placement="bottom" title="添加子组织">
              <Icon type="plus-circle-o" />
            </Tooltip>
          </div>
          <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={this.handleEditSub}>
            <Tooltip placement="bottom" title="修改">
              <Icon type="edit" />
            </Tooltip>
          </div>
          {this.state.NodeTreeItem.category === 1 ? '' : (
            <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={this.handleDeleteSub}>
              <Tooltip placement="bottom" title="删除">
                <Icon type="minus-circle-o" />
              </Tooltip>
            </div>
          )}
        </div>
      );
      return (this.state.NodeTreeItem == null) ? '' : menu;
    }

    initQuery=() => {
      const { dispatch } = this.props;
      const { routeid } = this.state;
      const params = {
        parentNo: '000000',
        resourceLvl: '1',
      };
      dispatch({
        type: 'resource/getTreeData',
        routeid,
        payload: params,
      }).then(() => {
        const { resData } = this.props;
        if (resData[routeid] == null) {
          return;
        }
        const { dataSource } = resData[routeid];
        this.setState({
          treeData: dataSource,
          defaultKeys: [dataSource[0].resourceId], // 初始时选中的节点
          selectedNodeInfo: dataSource[0],
        });
      });
    }

    handleDeleteSub=() => {
      const { rightNodeinfo } = this.state;
      Modal.confirm({
        content: `确定要删除【资源名称】为${rightNodeinfo && rightNodeinfo.resourceNm}【资源编号】为${rightNodeinfo && rightNodeinfo.resourceNo}吗`,
        onOk: () => {
        //   this.sureDelete(record);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    handleOnChange = (activeKey) => {
      console.log(activeKey);
      if (activeKey === 'delete') {
        CcMessege.warning('删除');
      }
    }

    handleRightClick = ({ event, node }) => {
      const x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
      const y = event.currentTarget.offsetTop;
      this.setState({
        NodeTreeItem: {
          pageX: x,
          pageY: y,
          id: node.props.eventKey,
          name: node.props.title,
        //   category: node.props.dataRef,
        },
        rightNodeinfo: node.props.dataRef,
      });
      //   const nodeInfo = event.node.props.dataRef;
      console.log(event, node);
    }

    handleSelect=(selectedKeys, e) => {
      if (e.selected) {
        this.setState({ selectedNodeInfo: e.node.props.dataRef, defaultKeys: selectedKeys });
      }
    }
    clearMenu = () => {
      this.setState({
        NodeTreeItem: null,
      });
    }

    renderTreeNodes = data =>
      data.map(item => {
        const isLeaf = item.isLeaf === '1';
        if (item.children) {
          return (
            <TreeNode title={item.resourceNm} key={item.resourceId} dataRef={item} isLeaf={isLeaf}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.resourceId} title={item.resourceNm} dataRef={item} isLeaf={isLeaf} />;
      });

    renderResourceTree() {
      return (
        <div style={{ overflowY: 'scroll', height: '400px' }}>
          <Tree
            loadData={this.onLoadData}
            onRightClick={this.handleRightClick}
            onSelect={this.handleSelect}
            selectedKeys={this.state.defaultKeys}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        </div>
      );
    }

    renderTabs = () => {
      return (
        <Tabs onChange={this.handleOnChange} type="card">
          <TabPane tab="基本信息" key="basicinfo">
            <BasicInfo data={this.state.selectedNodeInfo} />
          </TabPane>
          {/* <TabPane tab="新增" key="add">
                    Content of Tab Pane 2
          </TabPane>
          <TabPane tab="删除" key="delete" /> */}
        </Tabs>
      );
    }

    // renderMenu = () => {
    //   const { menuVisible } = this.state;
    //   const menus =
    //     <Menu>
    //       <Menu.Item>菜单项</Menu.Item>
    //       <Menu.Item key="5">Option 5</Menu.Item>
    //       <Menu.Item key="6">Option 6</Menu.Item>
    //     </Menu>;
    //   return menuVisible ? menus : null;
    // }
    render() {
      return (
        <Card title="资源管理" onClick={this.clearMenu}>
          <Alert
            type="info"
            showIcon
            // closable
            message="左键点击菜单树可查看该节点下的人员，右键点击该节点可以进行添加、修改、删除操作"
            style={{ marginBottom: '20px' }}
          />
          <Row gutter={20}>
            <Col span={5}>{this.renderResourceTree()}</Col>
            <Col span={19}>{this.renderTabs()}</Col>
          </Row>
          {this.state.NodeTreeItem != null ? this.getNodeTreeMenu() : null}
        </Card>
      );
    }
}
function mapStateToProps(state) {
  return {
    resData: state.resource,
  };
}

export default connect(mapStateToProps)(Form.create()(ResourcePage));
