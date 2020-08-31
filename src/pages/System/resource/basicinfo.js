import React, { Fragment } from 'react';
import { Card } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { getDicNameByKey, getDicOptions } from '@/utils/utils';

const { Description } = DescriptionList;
class BasicInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      // optionsData: {},
    };
  }

  componentDidMount() {
    // const dictionaryCategoryNos = [
    //   { dictionaryCategoryNo: 'YES_OR_NO' },
    //   { dictionaryCategoryNo: 'RESOURCE_TYPE' },
    // ];
    // getDicOptions(dictionaryCategoryNos).then(result => {
    //   this.setState({
    //     optionsData: result || {},
    //   });
    // });
  }

  renderBasicInfo=() => {
    const { data, optionsData } = this.props;
    return (
      <Fragment>
        <DescriptionList>
          <Description term="资源编号">{data && data.resourceNo}</Description>
          <Description term="资源名字">{data && data.resourceNm}</Description>
          <Description term="资源路径">{data && data.resourcePath}</Description>
        </DescriptionList>
        <DescriptionList>
          <Description term="资源层级">{data && data.resourceLvl}</Description>
          <Description term="资源顺序">{data && data.resourceOrd }</Description>
          <Description term="父节点资源编号">{data && data.parentNo}</Description>
        </DescriptionList>
        <DescriptionList>
          <Description term="是否叶子节点">{data && getDicNameByKey(data.isLeaf, 'IS_LEAF', optionsData)}</Description>
          <Description term="系统编号">{data && data.sysId}</Description>
          <Description term="资源类型">{data && getDicNameByKey(data.resourceTp, 'RESOURCE_TYPE', optionsData)}</Description>
          <Description>&nbsp;</Description>
        </DescriptionList>
      </Fragment>
    );
  }
  render() {
    return (
      <Card>
        { this.renderBasicInfo()}
      </Card>
    );
  }
}

export default (BasicInfo);
