import React from 'react';
import { Card, Divider } from 'antd';
import EditableFormTable from './EditableFormTable';
import EditableTable from '../edittable';

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
      </Card>
    );
  }
}
