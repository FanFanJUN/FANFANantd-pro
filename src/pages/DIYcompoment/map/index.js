/* eslint-disable no-new */
import React from 'react';
import { Form, Icon, Card, Divider } from 'antd';
import { Map } from 'react-amap';
// import Canvas from 'canvas';
import Tencent from './Tencent';
import UIMarker from './uimarker';

// const UIMarker = (props) => {
//   window.AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
//     // eslint-disable-next-line no-underscore-dangle
//     const map = props.__map__;
//     // 这个例子来自官方文档 http://lbs.amap.com/api/javascript-api/guide/amap-ui/intro
//     new SimpleMarker({
//       // 前景文字
//       iconLabel: 'A',
//       // 图标主题
//       iconTheme: 'default',
//       // 背景图标样式
//       iconStyle: 'red',
//       // ...其他Marker选项...，不包括content
//       map,
//       position: [120, 31],
//     });

//     // 创建SimpleMarker实例
//     new SimpleMarker({
//       // 前景文字
//       iconLabel: {
//         innerHTML: '<i>B</i>', // 设置文字内容
//         style: {
//           color: '#fff', // 设置文字颜色
//         },
//       },
//       // 图标主题
//       iconTheme: 'fresh',
//       // 背景图标样式
//       iconStyle: 'black',
//       // ...其他Marker选项...，不包括content
//       map,
//       position: [120, 29],
//     });
//   });
// };
/**
 * @description 地图组件
 * @param react-amap 高德地图饿了么API文档https://elemefe.github.io/react-amap/
 * @author LC@1981824361
 * @date 2019-06-17
 * @class MapComponent
 * @extends {React.Component}
 */
class MapComponent extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Card
        title="地图"
      >
        <Divider><Icon type="github" theme="filled" /><a href="https://github.com/yezihaohao/react-qmap">react-qmap</a></Divider>
        <Tencent />
        <Divider><Icon type="github" theme="filled" /><a href="https://github.com/ElemeFE/react-amap">react-amap</a></Divider>
        {/* <div style={{ width: '100%', height: '400px' }}>
          <Map amapkey="9517e896f48bd98cef03bb475c0bf2f5" />
        </div> */}
        <div style={{ width: '100%', height: '400px' }}>
          <Map useAMapUI>
            <UIMarker zoom={6} center={[120, 30]} />
          </Map>
        </div>
      </Card>
    );
  }
}

export default Form.create()(MapComponent);
