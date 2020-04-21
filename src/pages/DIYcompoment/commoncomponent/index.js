import React, { Fragment } from 'react';
import { Collapse, Form, Icon, Card, Divider, Row, Col, Tabs } from 'antd';
import JsBarcode from 'jsbarcode';
import Barcode from 'react-barcode';
import QRCode from 'qrcode.react';
import Player from 'xgplayer';
// import Canvas from 'canvas';
import { getDicOptions, getEllipsis } from '@/utils/utils';
import { CcLoanSelect, CcAmtCpl, CcRegionCasCader, CcTree } from '@/cc-comp/biz';
import DescriptionList from '@/components/DescriptionList';
import { CcInput, CcCard, CcButton } from '@/cc-comp/basic';
import { getFormItemLayout } from '@/utils/layout';
import styles from './common/index.css';

const { Panel } = Collapse;
const { Description } = DescriptionList;
const columnLayout = getFormItemLayout(3);
const formItemLayout = getFormItemLayout(1);
const FormItem = Form.Item;
/**
 * @description 通用组件
 * @param 数据字典
 * @param 详情组件
 * @param 条形码||二维码
 * @author LC@1981824361
 * @date 2019-06-17
 * @class Commoncomponent
 * @extends {React.Component}
 */
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
    // this.initPlayer();
    // this.getQRcode();
    // this.initAmap();
  }

  // initPlayer=() => {
  //   const player = new Player({
  //     id: 'mse',
  //     url: 'http://s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
  //     // height: window.innerHeight,
  //     // width: window.innerWidth,
  //   });
  // }
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
          <Description term="描述2">{getEllipsis('第一个用途，基本的字符串格式化。将表达式嵌入字符串中进行拼接。用${}来界定', 13)}</Description>
          <Description>&nbsp;</Description>
        </DescriptionList>
      </Card>
    );
  }

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { optionsData } = this.state;
    return (
      <Fragment>
        <Row>
          <CcLoanSelect
            columnLayout={3}
            columnIndex={1}
            form={form}
            label="证件类型"
            placeholder="请输入证件类型"
            dicCode="CERTFCT_TYPE"
            field="certfctType"
            options={optionsData.CERTFCT_TYPE}
            valueProp="dictionaryNo"
            titleProp="dictionaryNm"
            ChooseFlag
          />
          <CcAmtCpl
            columnLayout={3}
            columnIndex={2}
            form={form}
            label="金额"
            field="money"
            decimalsPrecision={3}
          />
          <Col {...columnLayout}>
            <FormItem label="规则名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: '测试按钮超长处理X禁用颜色加深XXXXXXXXXXX超DDDDDDDDD',
              })(<CcInput placeholder="请输入" disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <CcRegionCasCader
            columnLayout={3}
            columnIndex={1}
            form={form}
            label="行政区划"
            placeholder="请选择行政区划"
            field="areaData"
            // defaultInitiVal // 默认选中一级区域
            // initialValue={['510000', '511000', '511024']}
            // initialValue={['500000', '500100', '']} 省市区默认值
            // initialValue={['500000', '500100', '500122']}
            // initialValue={['500000']}
          />
          <CcTree
            title="产品树"
            columnLayout={3}
            columnIndex={2}
            field="proDuct"
            label="产品"
            form={form}
          />
        </Row>
      </Fragment>
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
      <Card title="公用组件">
        <Collapse
          bordered={false}
          defaultActiveKey={['1', '2', '4']}
          de
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        >
          <Panel header="复用组件" key="1" style={customPanelStyle}>
            {this.renderForm()}
            <Col className={styles.dashboard} xl={24} lg={24}>
              <Tabs defaultActiveKey="test1">
                <Tabs.TabPane tab="测试1" key="test1">
                </Tabs.TabPane>
                <Tabs.TabPane tab="测试2" key="test2">
                </Tabs.TabPane>
                <Tabs.TabPane tab="测试3" key="test3">
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Panel>
          <Panel header="详情页-底层样式修改" key="2" style={customPanelStyle}>
            {this.renderDetail()}
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
          {/* <Panel header="今日头条西瓜播放器" key="3" style={customPanelStyle}>
            <div id="mse" />
          </Panel> */}
        </Collapse>
      </Card>
    );
  }
}

export default Form.create()(Commoncomponent);
