/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Card, Row, Col, Tree, Tabs, Tooltip, Icon, Alert, Form, Modal, Spin, Button, Divider } from 'antd';
import { connect } from 'umi'; import moment from 'moment';
import { CcMessege, CcCard } from '@/cc-comp/basic';
import { createRouteid, getDicOptions, isEmptyArray } from '@/utils/utils';
import BasicInfo from './basicinfo';
import ButtonInfoTable from './buttoninfo';
import AddModal from './addmodal';
import { getSessionStorage } from '@/utils/storage';

const { TreeNode } = Tree;
const { TabPane } = Tabs;

class ResourcePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      NodeTreeItem: null, // 右键菜单
      optionsData: {}, // 字典项
      routeid: createRouteid(),
      rightNodeinfo: {},
      selectedNodeInfo: {},
      defaultKeys: [],
      modaladdVisible: false,
      loading: true,
      buttonFlag: false,
      activeKey: 'basicinfo',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { routeid } = this.state;
    dispatch({
      type: 'resource/create',
      routeid,
    });
    const dictionaryCategoryNos = [
      { dictionaryCategoryNo: 'YES_OR_NO' },
      { dictionaryCategoryNo: 'RESOURCE_TYPE' },
    ];
    getDicOptions(dictionaryCategoryNos).then(result => {
      this.setState({
        optionsData: result || {},
      });
    });
    this.initQuery();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/clear',
    });
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
            <Tooltip placement="bottom" title="添加子节点">
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
          loading: false,
          treeData: dataSource,
          defaultKeys: [dataSource[0].resourceId], // 初始时选中的节点
          selectedNodeInfo: dataSource[0],
        });
      });
    }

    handleAddSub=() => {
      this.setState({ modaladdVisible: true, buttonFlag: false });
    }

    handleButtonAdd=() => {
      this.setState({ modaladdVisible: true, buttonFlag: true });
    }

    handleDeleteSub=() => {
      const { rightNodeinfo } = this.state;
      Modal.confirm({
        content: `确定要删除【资源名称】为${rightNodeinfo && rightNodeinfo.resourceNm}【资源编号】为${rightNodeinfo && rightNodeinfo.resourceNo}吗`,
        onOk: () => {
          this.sureDelete(rightNodeinfo);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    handleOnChange = (activeKey) => {
      console.log(activeKey);
      if (activeKey === 'add') {
        this.setState({ activeKey: 'basicinfo' });
        this.handleButtonAdd();
      } else {
        this.setState({ activeKey });
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
        rightNodeinfo: node.props.dataRef, // 右键节点信息
      });
      //   const nodeInfo = event.node.props.dataRef;
      console.log(event, node);
    }

    handleSelect=(selectedKeys, e) => {
      if (e.selected) {
        this.setState({
          selectedNodeInfo: e.node.props.dataRef,
          defaultKeys: selectedKeys,
          activeKey: 'basicinfo',
        });
      }
    }
    clearMenu = () => {
      this.setState({
        NodeTreeItem: null,
      });
    }

    /** 新增操作 */
    handleAddCancel=() => {
      this.setState({ modaladdVisible: false });
      // this.initQuery();
    }

    handleAddOk=() => {
      const { dispatch } = this.props;
      const { routeid } = this.state;
      this.form.validateFields((err, values) => {
        if (err) return;
        if (!err) {
          dispatch({
            type: 'resource/addleData',
            payload: {
              ...values,
              // createUserNo: JSON.parse(getSessionStorage('currentUser')),
              // maintenanceDate: moment(new Date()).format('YYYYMMDD'),
            },
            routeid,
          }).then(() => {
            const { resData } = this.props;
            const { message, code } = resData[routeid];
            if (code === 200) {
              CcMessege.success(message);
              this.setState({ modaladdVisible: false });
              // this.props.location.reload();
            }
          });
        }
      });
    }

    saveForm=(form) => {
      this.form = form;
    }


    sureDelete(rightNodeinfo) {
      const { dispatch } = this.props;
      const { routeid } = this.state;
      dispatch({
        type: 'resource/addleData',
        routeid,
        payload: { resourceId: rightNodeinfo.resourceId, flag: 'delete' },
      }).then(() => {
        const { resData } = this.props;
        if (resData[routeid] == null) {
          return;
        }
        const { message, code } = resData[routeid];
        if (code === 200) {
          CcMessege.success(message);
        }
      });
    }

    renderTreeNodes = data =>
      data.map(item => {
        const isLeaf = item.isLeaf === '1'; // 叶子节点
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
        <Spin spinning={this.state.loading}>
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
        </Spin>
      );
    }

    renderTabs = () => {
      const { activeKey, defaultKeys, selectedNodeInfo } = this.state;
      return (
        <Tabs onChange={this.handleOnChange} type="card" activeKey={activeKey}>
          <TabPane tab="基本信息" key="basicinfo">
            {activeKey === 'basicinfo' ? <BasicInfo data={this.state.selectedNodeInfo} optionsData={this.state.optionsData} /> : null }
          </TabPane>
          {!isEmptyArray(defaultKeys) && selectedNodeInfo && selectedNodeInfo.isLeaf === '1' ?
            <TabPane tab="按钮权限信息" key="buttoninfo">
              {activeKey === 'buttoninfo' ? <ButtonInfoTable data={this.state.selectedNodeInfo} optionsData={this.state.optionsData} /> : null }
            </TabPane> : null }
          <TabPane tab="根节点新增" key="add" />
        </Tabs>
      );
    }

    renderAddModal() {
      const { rightNodeinfo, optionsData, modaladdVisible, buttonFlag } = this.state;
      return (
        <AddModal
          data={rightNodeinfo}
          optionsData={optionsData}
          visible={modaladdVisible}
          handleAddOk={this.handleAddOk}
          handleAddCancel={this.handleAddCancel}
          saveForm={this.saveForm}
          flag={buttonFlag}
        />
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
        <CcCard onClick={this.clearMenu}>
          <Alert
            type="info"
            showIcon
            // closable
            message="左键点击菜单树可查看该节点下的信息，右键点击该节点可以进行添加、修改、删除操作"
            style={{ marginBottom: '20px' }}
          />
          {/* <Button type="primary" onClick={this.handleButtonAdd}>增加</Button> */}
          {/* <Divider /> */}
          <Row gutter={20}>
            <Col span={5}>{this.renderResourceTree()}</Col>
            <Col span={19}>{this.renderTabs()}</Col>
          </Row>
          {this.state.NodeTreeItem != null ? this.getNodeTreeMenu() : null}
          {this.renderAddModal()}
        </CcCard>
      );
    }
}
function mapStateToProps(state) {
  return {
    resData: state.resource,
  };
}

export default connect(mapStateToProps)(Form.create()(ResourcePage));
