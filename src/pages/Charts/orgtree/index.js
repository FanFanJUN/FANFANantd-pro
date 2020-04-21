import React from 'react';
import { Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/tree';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import html2canvas from 'html2canvas';
import { toThousands } from '@/utils/utils';
import { CcButton } from '@/cc-comp/basic';

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
      isFullScreen: false,
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

  fullScreen = () => {
    if (!this.state.isFullScreen) {
      this.requestFullScreen();
      this.setState({ isFullScreen: true });
    } else {
      this.exitFullscreen();
      this.setState({ isFullScreen: false });
    }
  };

  // 進入全屏
  requestFullScreen = () => {
    console.log('requestFullScreen');
    const de = document.getElementById('main');
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  };

    // 退出全屏
    exitFullscreen = () => {
      console.log('exitFullscreen');
      const de = document;
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
    };
  inittree = (data) => {
    const myChart = echarts.init(document.getElementById('main'), 'macarons');
    const option = this.getOption(data);
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
    // https://zhuanlan.zhihu.com/p/37484972 Echarts 骚操作自适应页面
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreen) {
        myChart.setOption({
          toolbox: {
            feature: {
              myFull: {
                show: true,
                title: '退出全屏',
                icon: 'path://M749.248 704H864a32 32 0 1 0 0-64H672a32 32 0 0 0-32 32v192a32 32 0 1 0 64 0v-114.752l137.36 137.36a32 32 0 1 0 45.232-45.264L749.248 704zM320 749.248V864a32 32 0 1 0 64 0V672a32 32 0 0 0-32-32H160a32 32 0 1 0 0 64h114.752l-137.36 137.36a32 32 0 1 0 45.264 45.232L320 749.248zM749.248 320H864a32 32 0 1 1 0 64H672a32 32 0 0 1-32-32V160a32 32 0 1 1 64 0v114.752l137.36-137.36a32 32 0 1 1 45.232 45.264L749.248 320zM320 274.752V160a32 32 0 1 1 64 0v192a32 32 0 0 1-32 32H160a32 32 0 1 1 0-64h114.752l-137.36-137.36a32 32 0 1 1 45.264-45.232L320 274.752z',
                // icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: () => {
                  this.fullScreen();
                },
              },
            },
          },
        });
      } else {
        myChart.setOption({
          toolbox: {
            feature: {
              myFull: {
                show: true,
                title: '全屏查看',
                icon: 'path://M85.333333 682.666667v128a128 128 0 0 0 128 128h128a42.666667 42.666667 0 0 0 0-85.333334H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-128a42.666667 42.666667 0 0 0-85.333334 0z m597.333334 256h128a128 128 0 0 0 128-128v-128a42.666667 42.666667 0 0 0-85.333334 0v128a42.666667 42.666667 0 0 1-42.666666 42.666666h-128a42.666667 42.666667 0 0 0 0 85.333334z m256-597.333334V213.333333a128 128 0 0 0-128-128h-128a42.666667 42.666667 0 0 0 0 85.333334h128a42.666667 42.666667 0 0 1 42.666666 42.666666v128a42.666667 42.666667 0 0 0 85.333334 0zM341.333333 85.333333H213.333333a128 128 0 0 0-128 128v128a42.666667 42.666667 0 0 0 85.333334 0V213.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h128a42.666667 42.666667 0 0 0 0-85.333334z',
                onclick: () => {
                  this.fullScreen();
                },
              },
            },
          },
        });
      }
    });

    document.addEventListener('msfullscreenchange', () => {
      fullscreenState.innerHTML = (document.msFullscreenElement) ? '' : 'not ';
    }, false);

    document.addEventListener('mozfullscreenchange', () => {
      fullscreenState.innerHTML = (document.mozFullScreen) ? '' : 'not ';
    }, false);

    document.addEventListener('webkitfullscreenchange', () => {
      if (document.webkitIsFullScreen === false) { console.log(111); } else {
        console.log(222);
      }
    }, false);
  }

  getOption = (data) => {
    // const curve = '---------------------------------------';
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
          const showData = [
            `已有金额: ${toThousands(value[0])}元<br>`,
            `已用金额: ${toThousands(value[1])}元<br>`,
          ];
          /**
           * 为每一个显示增加红色圆点标识
           */
          const showHtml = showData.map((item) => {
            return (
              `<div style="
              min-width: 10px;
            height: 10px;
            background: red;
            box-sizing: border-box;
            color: white;
            font-size: 10px;
            text-align: center;
            line-height: 20px;
            padding: 0 5px;
            border-radius: 10px;
            display: inline-block"></div>${item}`
            );
          });
          const secShowHtml = showHtml.join('');

          return `<div
          style="border-bottom: 1px solid red;
          font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">
          ${obj.name}:${toThousands(value[2])}元
          </div>
          ${secShowHtml}`;
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: false },
          saveAsImage: { show: true },
          myFull: {
            show: true,
            title: '全屏查看',
            icon: 'path://M85.333333 682.666667v128a128 128 0 0 0 128 128h128a42.666667 42.666667 0 0 0 0-85.333334H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-128a42.666667 42.666667 0 0 0-85.333334 0z m597.333334 256h128a128 128 0 0 0 128-128v-128a42.666667 42.666667 0 0 0-85.333334 0v128a42.666667 42.666667 0 0 1-42.666666 42.666666h-128a42.666667 42.666667 0 0 0 0 85.333334z m256-597.333334V213.333333a128 128 0 0 0-128-128h-128a42.666667 42.666667 0 0 0 0 85.333334h128a42.666667 42.666667 0 0 1 42.666666 42.666666v128a42.666667 42.666667 0 0 0 85.333334 0zM341.333333 85.333333H213.333333a128 128 0 0 0-128 128v128a42.666667 42.666667 0 0 0 85.333334 0V213.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h128a42.666667 42.666667 0 0 0 0-85.333334z',
            // icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: () => {
              this.fullScreen();
              // const element = document.getElementById('main');
              // const echart = echarts.init(element, 'light');
              // window.onresize = () => {
              //   echart.resize();
              // };
              // // IE 10及以下ActiveXObject
              // if (window.ActiveXObject) {
              //   const WsShell = new ActiveXObject('WScript.Shell');
              //   WsShell.SendKeys('{F11}');
              // } else if (element.requestFullScreen) { // HTML W3C 提议
              //   element.requestFullScreen();
              // } else if (element.msRequestFullscreen) { // IE11
              //   element.msRequestFullScreen();
              // } else if (element.webkitRequestFullScreen) { // Webkit (works in Safari5.1 and Chrome 15)
              //   element.webkitRequestFullScreen();
              // } else if (element.mozRequestFullScreen) { // Firefox (works in nightly)
              //   element.mozRequestFullScreen();
              // }
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
            // shadowColor: 'rgba(0, 0, 0, 0.5)', // 设置图形的阴影效果
            // shadowBlur: 10,
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
              ].join('\n\n');
              return `${obj.name}:\n{a|${toThousands(value[2])}}元\n\n${showData}`;
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
            width: 0.5,
            type: 'solid', // 'curve'|'broken'|'solid'|'dotted'|'dashed'
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

  takeScreenshot=() => {
    console.log('test');
    html2canvas(document.getElementById('main')).then(canvas => {
      // document.body.appendChild(canvas);
      const img = new Image();
      img.src = canvas.toDataURL('image/jpeg');
      img.style.cssText += 'position:relative;width:100%;height: 300px;left:0;top:0;';
      document.body.appendChild(img);
    });
  }

  render() {
    // html2canvas将HTML内容写入Canvas生成图片 http://caibaojian.com/html2canvas.html https://html2canvas.hertzen.com/
    return (
      <Card
        title="组织结构图"
        bordered
      >
        {/* <CcButton type="primary" onClick={this.takeScreenshot}>截图</CcButton> */}
        <div id="main" style={{ width: '100%', height: '600px', position: 'relative', background: '#FFFFFF' }} />
      </Card>
    );
  }
}
export default OrgTree;
