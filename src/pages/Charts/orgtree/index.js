import React from 'react';
import { Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/tree';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class OrgTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.inittree();
  }

  inittree = () => {
    const myChart = echarts.init(document.getElementById('main'), 'macarons');
    const option = this.getOption();
    myChart.setOption(option);
  }
  getOption = () => {
    const option = {
      title: {
        text: '手机品牌',
        // subtext: '线、节点样式',
      },
      series: [
        {
          name: '树图',
          type: 'tree',
          orient: 'vertical', // vertical horizontal
          rootLocation: { x: 'center', y: '60%' }, // 根节点位置  {x: 'center',y: 10}
          nodePadding: 20,
          symbol: 'circle',
          symbolSize: 40,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'inside',
                textStyle: {
                  color: '#cc9999',
                  fontSize: 15,
                  fontWeight: 'bolder',
                },
              },
              lineStyle: {
                color: '#000',
                width: 1,
                type: 'broken', // 'curve'|'broken'|'solid'|'dotted'|'dashed'
              },
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          },
          data: [
            {
              name: '手机',
              value: 6,
              symbolSize: [90, 70],
              symbol: 'image://http://www.iconpng.com/png/ecommerce-business/iphone.png',
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                },
              },
              children: [
                {
                  name: '小米',
                  value: 4,
                  symbol: 'image://http://pic.58pic.com/58pic/12/36/51/66d58PICMUV.jpg',
                  itemStyle: {
                    normal: {
                      label: {
                        show: false,
                      },
                    },
                  },
                  symbolSize: [60, 60],
                  children: [
                    {
                      name: '小米1',
                      symbol: 'circle',
                      symbolSize: 20,
                      value: 4,
                      itemStyle: {
                        normal: {
                          color: '#fa6900',
                          label: {
                            show: true,
                            position: 'right',
                          },

                        },
                        emphasis: {
                          label: {
                            show: false,
                          },
                          borderWidth: 0,
                        },
                      },
                    },
                    {
                      name: '小米2',
                      value: 4,
                      symbol: 'circle',
                      symbolSize: 20,
                      itemStyle: {
                        normal: {
                          label: {
                            show: true,
                            position: 'right',
                            formatter: '{b}',
                          },
                          color: '#fa6900',
                          borderWidth: 2,
                          borderColor: '#cc66ff',

                        },
                        emphasis: {
                          borderWidth: 0,
                        },
                      },
                    },
                    {
                      name: '小米3',
                      value: 2,
                      symbol: 'circle',
                      symbolSize: 20,
                      itemStyle: {
                        normal: {
                          label: {
                            position: 'right',
                          },
                          color: '#fa6900',
                          brushType: 'stroke',
                          borderWidth: 1,
                          borderColor: '#999966',
                        },
                        emphasis: {
                          borderWidth: 0,
                        },
                      },
                    },
                  ],
                },
                {
                  name: '苹果',
                  symbol: 'image://http://www.viastreaming.com/images/apple_logo2.png',
                  symbolSize: [60, 60],
                  itemStyle: {
                    normal: {
                      label: {
                        show: false,
                      },

                    },
                  },
                  value: 4,
                },
                {
                  name: '华为',
                  symbol: 'image://http://market.huawei.com/hwgg/logo_cn/download/logo.jpg',
                  symbolSize: [60, 60],
                  itemStyle: {
                    normal: {
                      label: {
                        show: false,
                      },

                    },
                  },
                  value: 2,
                },
                {
                  name: '联想',
                  symbol: 'image://http://www.lenovo.com.cn/HomeUpload/Home001/6d94ee9a20140714.jpg',
                  symbolSize: [100, 40],
                  itemStyle: {
                    normal: {
                      label: {
                        show: false,
                      },

                    },
                  },
                  value: 2,
                },
              ],
            },
          ],
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
          <div id="main" style={{ width: '100%', height: '600px' }} />
        </div>
      </Card>
    );
  }
}
export default OrgTree;
