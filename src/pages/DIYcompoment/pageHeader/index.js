import React, { Fragment } from 'react';
import { CcPageHeader, CcTransferTable } from '@/cc-comp/biz';
import DetailCard from '@/cc-comp/biz/CcDetailCard';
import { CardWrapper } from '@/constants/comm';
import DescriptionList from '@/components/DescriptionList';
import { getEllipsis, getUserData } from '@/utils/utils';
import { Button } from 'antd';

const { Description } = DescriptionList;
const columns = [
  { title: '物料代码', dataIndex: 'materialCode' },
  { title: '物料描述', dataIndex: 'materialDesc' },
];

const oriColumns = [
  { title: '物料代码', dataIndex: 'materialCode' },
  { title: '物料描述', dataIndex: 'materialRemark' },
];

class Mudle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderDetail =() => {
    return (
      <Fragment>
        <DescriptionList>
          <Description term="测试1">测试</Description>
          <Description term="测试2">测试1</Description>
          <Description term="测试3">测试2</Description>
        </DescriptionList>
        <DescriptionList>
          <Description term="姓名">李彩</Description>
          <Description term="年龄">23</Description>
          <Description term="性别">男</Description>
        </DescriptionList>
        <DescriptionList>
          <Description term="描述1">对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。</Description>
          <Description term="描述2">{getEllipsis('第一个用途，基本的字符串格式化。将表达式嵌入字符串中进行拼接。用${}来界定', 13)}</Description>
          <Description>&nbsp;</Description>
        </DescriptionList>
      </Fragment>
    );
  }

  renderTransferTable = () => {
    return (
      <CcTransferTable
        leftService={getUserData}
        rightService={getUserData}
        // rightSearchService={getRightSearch}
        leftTitle="未分配"
        rightTitle="已分配"
        leftColumns={columns}
        rightColumns={oriColumns}
        handleLeftClick={this.handleLeftClick}
        handleRightClick={this.handleRightClick}
      />
    );
  }

  // 增加
  handleRightClick = (leftRowsSelected) => {

}

// 删除
handleLeftClick = (rightRowsSelected) => {

}

  getExtra = () => {
    return (
      <Fragment>
        <Button type="primary">保存</Button>
        <Button style={{ marginLeft: '10px' }}>返回</Button>
      </Fragment>
    );
  }

  render() {
    return (
      <CcPageHeader
        title="详情"
        extra={this.getExtra()}
        floating
      >
        <CardWrapper className="last">
          <DetailCard
            collapse
            title="基本信息"
            content={this.renderDetail()}
          />
        </CardWrapper>
        <CardWrapper className="last">
          <DetailCard
            collapse={false}
            title="穿梭框"
            content={this.renderTransferTable()}
          />
        </CardWrapper>
        <CardWrapper className="last">
          <DetailCard
            collapse={false}
            title="卡片Card标题3"
          />
        </CardWrapper>
      </CcPageHeader>
    );
  }
}

export default Mudle;
