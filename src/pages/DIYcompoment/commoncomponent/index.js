import React from 'react';
import { Collapse, Form, Icon } from 'antd';
import { getDicOptions } from '@/utils/utils';
import { CcLoanSelect } from '@/cc-comp/biz';

const { Panel } = Collapse;

class Commoncomponent extends React.Component {
  constructor() {
    super();
    this.state = {
      optionsData: {},
    };
  }

  componentDidMount() {
    const dictionaryCategoryNos = [{
      dictionaryCategoryNo: 'CERTFCT_TYPE',
    }];
    getDicOptions(dictionaryCategoryNos).then(result => {
      this.setState({
        optionsData: result || {},
      });
    });
  }

  renderForm() {
    const { form } = this.props;
    const { optionsData } = this.state;
    return (
      <CcLoanSelect
        columnLayout={2}
        columnIndex={1}
        form={form}
        label="证件类型"
        placeholder="请输入证件类型"
        dicCode="CERTFCT_TYPE"
        field="xx"
        options={optionsData.CERTFCT_TYPE}
        valueProp="dictionaryNo"
        titleProp="dictionaryNm"
        ChooseFlag
        // mode="multiple"
        // required
        // disabled
        // initialValue="2"
        notoptions={[{ dictionaryNm: '身份证', dictionaryNo: '1' }]}
      />
    );
  }
  render() {
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      // marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel header="数据字典组件" key="1" style={customPanelStyle}>
          {this.renderForm()}
        </Panel>
        <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
          <p>test</p>
        </Panel>
        <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
          <p>test</p>
        </Panel>
      </Collapse>
    );
  }
}

export default Form.create()(Commoncomponent);
