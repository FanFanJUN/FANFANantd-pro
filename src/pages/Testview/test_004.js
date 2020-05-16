import React from 'react';

class Example004 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Number: 1, // 设state中Number值为1
    };
  }
  // 这里调用了setState但是并没有改变setState中的值
  handleClick = () => {
    const preNumber = this.state.Number;
    this.setState({
      Number: this.state.Number,
    });
  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     if (nextState.Number !== this.state.Number) {
  //       return true;
  //     }
  //     return false;
  //   }

  render() {
    // 当render函数被调用时，打印当前的Number
    console.log('render begin----->', this.state.Number);
    return (<h1 onClick={this.handleClick} style={{ margin: 30 }}>
      {this.state.Number}
    </h1>);
  }
}
export default Example004;
// 省略reactDOM的渲染代码...
