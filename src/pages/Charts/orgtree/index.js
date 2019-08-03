import React from 'react';
import { Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/tree';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { toThousands } from '@/utils/utils';

const sendData = [
  {
    value: ['100', '200', '300', '400'],
    name: '测试',
    children: [
      { value: ['1008777', '200', '300', '400'],
        name: '测试1',
        children: [
          { value: ['100', '200', '3004444', '400'],
            name: '测试11' },
          { value: ['1004444', '200', '300555', '400'],
            name: '测试12' },
          { value: ['100', '200', '300', '400333'],
            name: '测试13' },
          { value: ['100', '2004433', '300', '400'],
            name: '测试14' },
        ] },
      { value: ['100', '2002222', '300', '400'],
        name: '测试2' },
    ],
  },
];
class OrgTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataLoading: true,
      // dataSource: [],
    };
  }

  componentDidMount() {
    // getTreeData().then((result) => {
    //   if (isEmptyArray(result)) {
    //     return;
    //   }
    // this.setState({ dataSource: result, dataLoading: false });
    this.inittree(sendData);
    // });
  }

  inittree = (data) => {
    const myChart = echarts.init(document.getElementById('main'), 'macarons');
    const option = this.getOption(data);
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }
  getOption = (data) => {
    const curve = '---------------------------------------';
    const option = {
      title: {
        text: '手机品牌',
        // subtext: '线、节点样式',
        show: false,
      },
      tooltip: {
        show: true,
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (obj) => {
          const { value } = obj;
          const showData =
          `已有金额: ${toThousands(value[0])}元<br>
          已用金额: ${toThousands(value[1])}元<br>
          `;
          return `<div
          style="border-bottom: 1px solid rgba(255,255,255,.3);
          font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">
          ${obj.name}:${toThousands(value[2])}元
          </div>
          ${showData}`;
        },
      },
      toolbox: {
        show: true,
        left: '10px',
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: false },
          saveAsImage: { show: true },
          myFull: {
            show: true,
            title: '全屏查看',
            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: () => {
              const element = document.getElementById('main');
              const echart = echarts.init(element, 'light');
              window.onresize = () => {
                echart.resize();
              };
              // IE 10及以下ActiveXObject
              if (window.ActiveXObject) {
                const WsShell = new ActiveXObject('WScript.Shell');
                WsShell.SendKeys('{F11}');
              } else if (element.requestFullScreen) { // HTML W3C 提议
                element.requestFullScreen();
              } else if (element.msRequestFullscreen) { // IE11
                element.msRequestFullScreen();
              } else if (element.webkitRequestFullScreen) { // Webkit (works in Safari5.1 and Chrome 15)
                element.webkitRequestFullScreen();
              } else if (element.mozRequestFullScreen) { // Firefox (works in nightly)
                element.mozRequestFullScreen();
              }
            },
          },
        },
      },
      series: [
        {
          name: '树图',
          type: 'tree',
          orient: 'vertical', // vertical horizontal
          rootLocation: { x: 'center', y: '60%' }, // 根节点位置  {x: 'center',y: 10}
          nodePadding: 20,
          symbol: ['circle', 'arrow'],
          symbolSize: [140, 120],
          itemStyle: {
            color: '#F2EEED',
          },
          label: {
            show: true,
            position: 'insideLeft',
            color: '#333333',
            fontSize: 10,
            fontWeight: 'bolder',
            formatter: (obj) => {
              const { value } = obj;
              const showData = [
                `已有金额:\n{a|${toThousands(value[0])}}元`,
                `已用金额:\n{a|${toThousands(value[1])}}元`,
              ].join(`\n${curve}\n`);
              return `${obj.name}:\n{a|${value[2]}}元\n${curve}\n${showData}`;
            },
            // textStyle: {
            //   color: '#cc9999',
            //   fontSize: 15,
            //   fontWeight: 'bolder',
            // },
            rich: {
              a: {
                color: 'red',
              },
            },
          },
          lineStyle: {
            color: 'blue',
            width: 2,
            type: 'broken', // 'curve'|'broken'|'solid'|'dotted'|'dashed'
            curveness: '0.8',
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //   },
          // },
          data,
          initialTreeDepth: 10,
          animationDuration: '550',
          animationDurationUpdate: 750,
        },
      ],
    };
    return option;
  }
  render() {
    return (
      <Card
        title="组织结构图"
        bordered
      >
        <div style={{ width: '100%', height: '100%' }}>
          <div id="main" style={{ width: '100%', height: '600px', position: 'relative' }} />
        </div>
      </Card>
    );
  }
}
export default OrgTree;
