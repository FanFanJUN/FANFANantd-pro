import React from 'react';

class Son extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // nextProps.number == this.props.number不能写成nextProps == this.props，它总返回false因为它们是堆中内存不同的两个对象。
    // if (nextProps.number === this.props.number) {
    if (nextProps.number.number === this.props.number.number) {
      return false;
    }
    return true;
  }
  render() {
    const { index, number, handleClick } = this.props;
    // 在每次渲染子组件时，打印该子组件的数字内容
    console.log(number);
    return <h1>{number.number}<button onClick={() => handleClick(index)}>点击</button></h1>;
  }
}

export default Son;
