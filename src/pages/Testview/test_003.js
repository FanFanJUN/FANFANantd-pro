/* eslint-disable react/destructuring-assignment */
import React from 'react';

// extends PureComponent 深层次比较（一层一层比较  浪费性能） 最好使用shouldComponentUpdate 浅层比较
class Example003 extends React.Component {
  constructor() {
    super();
    this.state = {
      count: {
        a: 0,
      },
    };
    let autoIndex = 0;
    setInterval(() => {
      const countNew = this.state.count; // 相等其实未改变指针 ==》不会改变

      // const countNew = {}; // 改变存储指针  ===》会改变 浅层比较方式1

      // const countNew = { ...this.state.count }; // 浅层比较方式2

      // const countNew = Object.assign({}, this.state.count); // // 浅层比较方式3
      countNew.a = autoIndex++;

      // 覆盖
      // const countNew = Object.assign({}, this.state.count, {
      //   a: autoIndex++,
      // });
      this.setState((prevState) => ({
        count: countNew,
      }));
      console.log(`setInterval call count->${this.state.count.a}`);
    }, 1000);
  }

  componentDidMount() {

  }

  // 去掉此生命周期  相当于是pureComponent 是深层次比较
  shouldComponentUpdate(nextProps, nextState) {
    // 一下if判断无论返回 true or false 均不会更新
    if (nextState.count !== this.state.count) {
      return true;
    }
    // 强制更新  return true
    return false;
  }

  render() {
    console.log('render begin');
    return JSON.stringify(this.state.count);
  }
}

export default Example003;
