import React from 'react';
import { Card, Divider } from 'antd';
import EditableFormTable from './EditableFormTable';
import EditableTable from '../edittable';
import EditabletreeFormTable from '../editabletree';

/**
 * @description 利用context共享实现可编辑表格
 * @author LC@1981824361
 * @date 2019-10-25
 * @export
 * @class HelloAdmin
 * @extends {React.Component}
 */
export default class HelloAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <Card
        title="可编辑表格"
      >
        <EditableFormTable />
        <Divider />
        <EditableTable />
        <Divider>可编辑树表格（只能改变底层金额,上层金额自动计算）</Divider>
        <EditabletreeFormTable />
      </Card>
    );
  }
}
