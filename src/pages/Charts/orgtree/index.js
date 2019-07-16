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
        show: false,
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: false },
          saveAsImage: { show: true },
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
