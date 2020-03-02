// import React from 'react';
// import G6 from '@antv/g6';
// import { Minimap, dagre } from '@antv/g6/plugins';
// // import '@antv/g6/build/minimap';
// import { Card } from 'antd';
// import Hierarchy from '@antv/hierarchy';
// import { toThousands } from '@/utils/utils';
// import './index.css';
// // 2. 引入数据源
// // 引入数据源是需要声明节点和边，分别用数组表示
// // 节点上的 id, x, y 都是必需的字段，id 用于连接边，x,y 用于定位。
// // 边上 source 和 target 是必须的，是指向节点的 id。
// // const Minimap = require('@antv/g6/build/minimap');

// // 测试数据
// const custData = {
//   id: 'Modeling Methods',
//   children: [
//     {
//       id: 'Classification',
//       children: [
//         { id: 'Logistic regression阿里世界排名' },
//         { id: 'Linear discriminant analysis' },
//         { id: 'Rules' },
//         { id: 'Decision trees' },
//         { id: 'Naive Bayes' },
//         { id: 'K nearest neighbor' },
//         { id: 'Probabilistic neural network' },
//         { id: 'Support vector machine' },
//       ],
//     },
//     {
//       id: 'Consensus',
//       children: [
//         {
//           id: 'Models diversity',
//           children: [
//             { id: 'Different initializations' },
//             { id: 'Different parameter choices' },
//             { id: 'Different architectures' },
//             { id: 'Different modeling methods' },
//             { id: 'Different training sets' },
//             { id: 'Different feature sets' },
//           ],
//         },
//         {
//           id: 'Methods',
//           children: [
//             { id: 'Classifier selection' },
//             { id: 'Classifier fusion' },
//           ],
//         },
//         {
//           id: 'Common',
//           children: [
//             { id: 'Bagging' },
//             { id: 'Boosting' },
//             { id: 'AdaBoost' },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'Regression',
//       children: [
//         { id: 'Multiple linear regression' },
//         { id: 'Partial least squares' },
//         { id: 'Multi-layer feedforward neural network' },
//         { id: 'General regression neural network' },
//         { id: 'Support vector regression' },
//       ],
//     },
//   ],
// };
// // 测试数据2
// const sendData =
//   {
//     value: ['100', '200', '300', '400'],
//     id: '测试',
//     children: [
//       { value: ['1008777', '200', '300', '400'],
//         id: '测试1',
//         children: [
//           { value: ['100', '200', '3004444', '400'],
//             id: '测试11' },
//           { value: ['1004444', '200', '300555', '400'],
//             id: '测试12' },
//           { value: ['100', '200', '300', '400333'],
//             id: '测试13' },
//           { value: ['100', '2004433', '300', '400'],
//             id: '测试14' },
//         ] },
//       { value: ['100', '2002222', '300', '400'],
//         id: '测试2' },
//     ],
//   };
// // 基础的节点
// // {
// //     x: 300,
// //     y: 100,
// //     size: [60, 30],
// //     shape: 'ellipse',
// //     label: 'ellipse',
// //     color: '#fa8c16',
// //     labelCfg: {
// //       position: 'bottom',
// //       offset: 5
// //     },
// //     style: {
// //       lineWidth: 2
// //     }
// // }
// // 边的设置
// // {
// //     source: '5',
// //     target: '6',
// //     shape: 'quadratic',
// //     color: '#722ed1',
// //     size: 2,
// //     style: {
// //       lineDash: [2, 2]
// //     },
// //     label: 'quadratic',
// //     labelCfg: {
// //       position: 'center', // 其实默认就是 center，这里写出来便于理解
// //       autoRotate: true,
// //       style: {
// //         lineWidth: 5,
// //         fill: '#722ed1',
// //         stroke: 'white' // 给文本添加白边和白色背景
// //       }
// //     }
// //   },
// //   {
// //     source: '7',
// //     target: '8',
// //     shape: 'cubic',
// //     label: 'quadratic',
// //     labelCfg: {
// //       autoRotate: true,
// //       refY: -10 // refY 默认是顺时针方向向下，所以需要设置负值
// //     }
// //   }
// // graph.on('click', ev =&gt; {
// //     const shape = ev.target;
// //     const item = ev.item;
// //     if (item) {

// //       const type = item.getType();
// //     }
// //   });

// //   graph.on('node:click', ev =&gt; {
// //     const shape = ev.target;
// //     const node = ev.item;
// //   });

// // Minimap 缩略图
// const minimap = new Minimap({
//   size: [200, 150],
//   type: 'delegate',
//   delegateStyle: { fill: '#fff', stroke: '#666' },
//   // position: 'relative',
//   className: 'g6-minimap',
// });
// const COLLAPSE_ICON = (x, y, r) => {
//   return [
//     ['M', x, y],
//     ['a', r, r, 0, 1, 0, r * 2, 0],
//     ['a', r, r, 0, 1, 0, -r * 2, 0],
//     ['M', x + 2, y],
//     ['L', x + 2 * r - 2, y],
//   ];
// };
// const EXPAND_ICON = (x, y, r) => {
//   return [
//     ['M', x, y],
//     ['a', r, r, 0, 1, 0, r * 2, 0],
//     ['a', r, r, 0, 1, 0, -r * 2, 0],
//     ['M', x + 2, y],
//     ['L', x + 2 * r - 2, y],
//     ['M', x + r, y - r + 2],
//     ['L', x + r, y + r - 2],
//   ];
// };
// const { Util } = G6;
// /**
//  * @description AntV-G6 https://antv.alipay.com/zh-cn/g6/3.x/index.html
//  * @author LC@1981824361
//  * @date 2019-08-19
//  * @class G6Charts
//  * @extends {React.PureComponent}
//  */
// class G6Charts extends React.PureComponent {
//   componentDidMount() {
//     this.initCharts(sendData);
//   }

//     initCharts=(data) => {
//       // 3. 创建关系图
//       const graph = new G6.TreeGraph({
//         container: 'mountNode', // DOM容器
//         // width: window.innerWidth,
//         // height: window.innerHeight,
//         // width: window.innerWidth,
//         // height: window.innerHeight,
//         width: 1000,
//         height: 500,
//         // renderer: 'svg', // 渲染引擎，支持canvas(默认)和svg。
//         // fitViewPadding: [20, 40, 50, 20],
//         plugins: [minimap],
//         // Mode指当前图的事件模式，一个Mode可能包含多个behavior
//         modes: {
//           /** 内置Behavior https://www.yuque.com/antv/g6/mode-behavior
//            * drag-canvas 拖拽画布
//            * zoom-canvas 滚轮缩放画布
//            * drag-node 拖拽节点
//            * click-select 点击选中节点
//            * tooltip 节点文本提示
//            *  */
//           default: ['drag-canvas',
//             { type: 'selectNode' },
//             {
//               type: 'tooltip',
//               formatText: (model) => { // formatText(model) 格式化函数，可以返回文本或者 html
//                 const { id, value } = model;
//                 // return id;
//                 const showData =
//           `已有金额: ${toThousands(value[0])}元<br>
//            已用金额: ${toThousands(value[1])}元<br>
//           `;
//                 return `<div
//                 style="border: 1px solid red;border-radius: 4px;color: #545454;
//                 background-color: rgba(255, 255, 255, 0.9);
//                 padding: 10px 8px;
//                 box-shadow: rgb(174, 174, 174) 0px 0px 10px;
//                 font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">
//                 ${id}<br/>
//                 ${showData}
//                 </div>`;
//               },
//               shouldUpdate: e => {
//               // 如果移动到节点文本上显示，不是文本上不显示
//                 if (e.target.type !== 'text') {
//                   return false;
//                 }
//                 return true;
//               },
//             },
//             {
//               type: 'collapse-expand',
//               onChange(item, collapsed) {
//                 const icon = item.get('group').findByClassName('collapse-icon');
//                 if (collapsed) {
//                   icon.attr('symbol', EXPAND_ICON);
//                 } else {
//                   icon.attr('symbol', COLLAPSE_ICON);
//                 }
//               },
//             }],
//         },
//         // 节点
//         defaultNode: {
//           shape: 'tree-node',
//           anchorPoints: [[0, 0.5], [1, 0.5]],
//         },
//         // 边
//         /** 内置边：line：直线，不支持控制点；
//             polyline：折线，支持多个控制点；
//             spline：直线；
//             quadratic：二阶贝塞尔曲线；
//             cubic：三阶贝塞尔曲线；
//             cubic-vertical：垂直方向的三阶贝塞尔曲线，不考虑用户从外部传入的控制点；
//             cubic-horizontal；水平方向的三阶贝塞尔曲线，不考虑用户从外部传入的控制点；
//             loop：自环。 */
//         defaultEdge: {
//           // shape: 'cubic-horizontal',
//           shape: 'hvh',
//         },
//         edgeStyle: {
//           default: {
//             stroke: '#A3B1BF',
//           },
//         },
//         layout: () => {
//           return Hierarchy.compactBox(data, {
//             direction: 'LR', // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
//             getId(d) { return d.id; },
//             getHeight() { return 16; },
//             getWidth() { return 16; },
//             getVGap() { return 20; },
//             getHGap() { return 80; },
//           });
//         },
//       });
//       // 自定义节点
//       G6.registerNode('tree-node', {
//         // cssSize: true, // 不使用内部 size 作为节点尺寸
//         drawShape(cfg, group) {
//           const { id, value } = cfg;
//           // cfg 节点信息
//           const rect = group.addShape('rect', {
//             attrs: { fill: 'rgb(76,122,187)', stroke: '#666' },
//           });
//           // 节点显示内容
//           const content = cfg.id.replace(/(.{19})/g, '$1\n');
//           // const showData =
//           // `已有金额: ${toThousands(value[0])}元<br>
//           // 已用金额: ${toThousands(value[1])}元<br>
//           // `;
//           // const content = `${id}:toThousands(1000000)元<br/>${showData}`;
//           const text = group.addShape('text', {
//             attrs: {
//               text: content,
//               x: 0,
//               y: 0,
//               textAlign: 'left',
//               textBaseline: 'middle',
//               fill: '#FFFFFF',
//               cursor: 'pointer', // 鼠标样式
//             },
//           });
//           const bbox = text.getBBox();
//           const hasChildren = cfg.children && cfg.children.length > 0;
//           if (hasChildren) {
//             group.addShape('marker', {
//               attrs: {
//                 x: bbox.maxX + 14,
//                 y: bbox.minX + bbox.height / 2 - 6,
//                 r: 4, // 半径
//                 symbol: COLLAPSE_ICON,
//                 stroke: 'red',
//                 lineWidth: 1,
//               },
//               className: 'collapse-icon',
//             });
//           }
//           rect.attr({
//             x: bbox.minX - 4,
//             y: bbox.minY - 6,
//             width: bbox.width + (hasChildren ? 26 : 8),
//             height: bbox.height + 12 });
//           return rect;
//         },
//       }, 'single-shape');
//       // 自定义边 直角连线
//       G6.registerEdge('hvh', {
//         draw(cfg, group) {
//           const { startPoint, endPoint } = cfg;
//           const shape = group.addShape('path', {
//             attrs: {
//               stroke: 'rgb(76,122,187)',
//               lineWidth: 1,
//               path: [
//                 ['M', startPoint.x, startPoint.y],
//                 ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
//                 ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
//                 ['L', endPoint.x, endPoint.y],
//               ],
//               // startArrow: {
//               //   path: 'M 10,0 L -10,-10 L -10,10 Z',
//               //   d: 10,
//               // },
//               endArrow: {
//                 path: 'M 5,0 L -5,-5 L -5,5 Z',
//                 d: 5,
//               },
//             },
//           });
//           return shape;
//         },
//       });
//       // 自定义行为
//       G6.registerBehavior('selectNode', {
//         // 定义事件及处理事件的方法
//         getEvents() {
//           return {
//             // 'node:click': 'onNodeClick',
//             // 'edge:click': 'onEdgeClick',
//             'node:mouseover': 'onMouseMove',
//           };
//         },
//         onMouseMove(evt) {
//           // TODO
//           console.log(evt);
//           // eslint-disable-next-line no-underscore-dangle
//           const nodeId = evt.item._cfg.id;
//           // 此时会完全替换掉 style
//           // graph.update(nodeId, {
//           //   style: {
//           //     fill: 'red',
//           //     stroke: 'blue',
//           //   },
//           // });
//           // 通过ID查询节点实例
//           // const item = graph.findById(nodeId);
//           // graph.findById(nodeId).get('model').style = { fill: 'red', stroke: 'blue' };
//           // graph.refreshItem(nodeId);
//         },
//       });
//       // 全局选中时的样式
//       G6.Global.nodeStateStyle.selected = {
//         stroke: '#d9d9d9',
//         fill: '#5394ef',
//       };
//       graph.read(data); // 接收数据，并进行渲染，read方法的功能相当于data和render方法的结合。 data =》object
//       // graph.data(data);
//       // graph.render();
//       graph.refresh();
//       graph.fitView();
//     }

//     render() {
//       // 1. 创建容器
//       return (
//         <Card title="G6">
//           <div id="mountNode" />
//         </Card>
//       );
//     }
// }

// export default G6Charts;
