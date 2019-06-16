import React from 'react';
import { Collapse, Form, Icon, Card, Divider } from 'antd';
import JsBarcode from 'jsbarcode';
import Barcode from 'react-barcode';
import QRCode from 'qrcode.react';
import Canvas from 'canvas';
import { getDicOptions } from '@/utils/utils';
import { CcLoanSelect } from '@/cc-comp/biz';
import DescriptionList from '@/components/DescriptionList';
import Tencent from '../map/Tencent';

const { Panel } = Collapse;
const { Description } = DescriptionList;
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
    // this.getQRcode();
  }

  getQRcode=() => {
    // const canvas = new Canvas();
    // JsBarcode(canvas, 'Hello');
    JsBarcode(this.barcode, 'QRcode', {
      displayValue: false,
      width: 1.5,
      height: 50,
      margin: 0,
    });
  }
  // eslint-disable-next-line class-methods-use-this
  renderDetail() {
    return (
      <Card
        title="详情页"
      >
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
          <Description term="描述2">第一个用途，基本的字符串格式化。将表达式嵌入字符串中进行拼接。用${}来界定。</Description>
          <Description>&nbsp;</Description>
        </DescriptionList>
      </Card>
    );
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
        // notoptions={[{ dictionaryNm: '身份证', dictionaryNo: '1' }]}
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
        defaultActiveKey={['1', '2', '4']}
        de
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel header="数据字典组件" key="1" style={customPanelStyle}>
          {this.renderForm()}
        </Panel>
        <Panel header="详情页-底层样式修改" key="2" style={customPanelStyle}>
          {this.renderDetail()}
        </Panel>
        <Panel header="地图" key="3" style={customPanelStyle}>
          <Tencent />
        </Panel>
        <Panel header="二维码||条形码" key="4" style={customPanelStyle}>
          {/* <div className="barcode-box">
            <svg
              ref={(ref) => {
                this.barcode = ref;
              }}
            />
          </div> */}
          <Divider>条形码</Divider>
          <Barcode value="https://github.com/FanFanJUN" />
          <Divider>二维码</Divider>
          <QRCode value="https://github.com/FanFanJUN" />
        </Panel>
      </Collapse>
    );
  }
}

export default Form.create()(Commoncomponent);
