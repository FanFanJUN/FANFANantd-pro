import React from 'react';
import { Card } from 'antd';
import { Bar } from '@antv/g2plot';

const data = [
  { year: '1951 年', sales: 38 },
  { year: '1952 年', sales: 52 },
  { year: '1956 年', sales: 61 },
  { year: '1957 年', sales: 145 },
  { year: '1958 年', sales: 48 },
];
class Map extends React.PureComponent {
  componentDidMount() {
    this.initMap();
  }

  initMap=() => {
    const barPlot = new Bar('c1', {
      data,
      xField: 'sales',
      yField: 'year',
      colorField: 'year',
    });

    barPlot.render();
  }

  render() {
    return (
      <Card>
        <div id="c1" />
      </Card>
    );
  }
}

export default Map;
