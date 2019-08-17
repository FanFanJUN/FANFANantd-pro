import React from 'react';
import G6 from '@antv/g6';
import { Minimap } from '@antv/g6/plugins';
// import '@antv/g6/build/minimap.js';
import { Card } from 'antd';
import Hierarchy from '@antv/hierarchy';
import './index.css';
// 2. 引入数据源
// 引入数据源是需要声明节点和边，分别用数组表示
// 节点上的 id, x, y 都是必需的字段，id 用于连接边，x,y 用于定位。
// 边上 source 和 target 是必须的，是指向节点的 id。
// const Minimap = require('@antv/g6/build/minimap');

const custData = {
  id: 'Modeling Methods',
  children: [
    {
      id: 'Classification',
      children: [
        { id: 'Logistic regression' },
        { id: 'Linear discriminant analysis' },
        { id: 'Rules' },
        { id: 'Decision trees' },
        { id: 'Naive Bayes' },
        { id: 'K nearest neighbor' },
        { id: 'Probabilistic neural network' },
        { id: 'Support vector machine' },
      ],
    },
    {
      id: 'Consensus',
      children: [
        {
          id: 'Models diversity',
          children: [
            { id: 'Different initializations' },
            { id: 'Different parameter choices' },
            { id: 'Different architectures' },
            { id: 'Different modeling methods' },
            { id: 'Different training sets' },
            { id: 'Different feature sets' },
          ],
        },
        {
          id: 'Methods',
          children: [
            { id: 'Classifier selection' },
            { id: 'Classifier fusion' },
          ],
        },
        {
          id: 'Common',
          children: [
            { id: 'Bagging' },
            { id: 'Boosting' },
            { id: 'AdaBoost' },
          ],
        },
      ],
    },
    {
      id: 'Regression',
      children: [
        { id: 'Multiple linear regression' },
        { id: 'Partial least squares' },
        { id: 'Multi-layer feedforward neural network' },
        { id: 'General regression neural network' },
        { id: 'Support vector regression' },
      ],
    },
  ],
};

// 基础的节点
// {
//     x: 300,
//     y: 100,
//     size: [60, 30],
//     shape: 'ellipse',
//     label: 'ellipse',
//     color: '#fa8c16',
//     labelCfg: {
//       position: 'bottom',
//       offset: 5
//     },
//     style: {
//       lineWidth: 2
//     }
// }
// 边的设置
// {
//     source: '5',
//     target: '6',
//     shape: 'quadratic',
//     color: '#722ed1',
//     size: 2,
//     style: {
//       lineDash: [2, 2]
//     },
//     label: 'quadratic',
//     labelCfg: {
//       position: 'center', // 其实默认就是 center，这里写出来便于理解
//       autoRotate: true,
//       style: {
//         lineWidth: 5,
//         fill: '#722ed1',
//         stroke: 'white' // 给文本添加白边和白色背景
//       }
//     }
//   },
//   {
//     source: '7',
//     target: '8',
//     shape: 'cubic',
//     label: 'quadratic',
//     labelCfg: {
//       autoRotate: true,
//       refY: -10 // refY 默认是顺时针方向向下，所以需要设置负值
//     }
//   }
// graph.on('click', ev =&gt; {
//     const shape = ev.target;
//     const item = ev.item;
//     if (item) {

//       const type = item.getType();
//     }
//   });

//   graph.on('node:click', ev =&gt; {
//     const shape = ev.target;
//     const node = ev.item;
//   });

// Minimap 缩略图
const minimap = new Minimap({
  size: [200, 150],
  type: 'delegate',
  delegateStyle: { fill: '#fff', stroke: '#666' },
  position: 'relative',
  className: 'g6-minimap',
});
const COLLAPSE_ICON = (x, y, r) => {
  return [
    ['M', x, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x + 2, y],
    ['L', x + 2 * r - 2, y],
  ];
};
const EXPAND_ICON = (x, y, r) => {
  return [
    ['M', x, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x + 2, y],
    ['L', x + 2 * r - 2, y],
    ['M', x + r, y - r + 2],
    ['L', x + r, y + r - 2],
  ];
};
class G6Charts extends React.PureComponent {
  componentDidMount() {
    this.initCharts(custData);
  }

    initCharts=(data) => {
      // 3. 创建关系图
      const graph = new G6.TreeGraph({
        container: 'mountNode',
        // width: window.innerWidth,
        // height: window.innerHeight,
        // width: window.innerWidth,
        // height: window.innerHeight,
        width: 800,
        height: 600,
        plugins: [minimap],
        modes: {
          default: [{
            type: 'collapse-expand',
            onChange(item, collapsed) {
              const icon = item.get('group').findByClassName('collapse-icon');
              if (collapsed) {
                icon.attr('symbol', EXPAND_ICON);
              } else {
                icon.attr('symbol', COLLAPSE_ICON);
              }
            },
          }, 'drag-canvas', 'zoom-canvas'],
        },
        defaultNode: {
          shape: 'tree-node',
          anchorPoints: [[0, 0.5], [1, 0.5]],
        },
        defaultEdge: {
          shape: 'cubic-horizontal',
        },
        edgeStyle: {
          default: {
            stroke: '#A3B1BF',
          },
        },
        layout: () => {
          return Hierarchy.compactBox(data, {
            direction: 'LR',
            getId(d) { return d.id; },
            getHeight() { return 16; },
            getWidth() { return 16; },
            getVGap() { return 20; },
            getHGap() { return 80; },
          });
        },
      });
      G6.registerNode('tree-node', {
        drawShape(cfg, group) {
          const rect = group.addShape('rect', {
            attrs: { fill: '#fff', stroke: '#666' },
          });
          const content = cfg.id.replace(/(.{19})/g, '$1\n');
          const text = group.addShape('text', {
            attrs: {
              text: content,
              x: 0,
              y: 0,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#666',
            },
          });
          const bbox = text.getBBox();
          const hasChildren = cfg.children && cfg.children.length > 0;
          if (hasChildren) {
            group.addShape('marker', {
              attrs: {
                x: bbox.maxX + 6,
                y: bbox.minX + bbox.height / 2 - 6,
                r: 6,
                symbol: COLLAPSE_ICON,
                stroke: '#666',
                lineWidth: 2,
              },
              className: 'collapse-icon',
            });
          }
          rect.attr({
            x: bbox.minX - 4,
            y: bbox.minY - 6,
            width: bbox.width + (hasChildren ? 26 : 8),
            height: bbox.height + 12 });
          return rect;
        },
      }, 'single-shape');
      //   graph.read(TreeData);
      graph.data(data);
      graph.render();
      graph.refresh();
      graph.fitView();
    }

    render() {
      // 1. 创建容器
      return (
        <Card title="G6">
          <div id="mountNode" />
        </Card>
      );
    }
}

export default G6Charts;
