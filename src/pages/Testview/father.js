import React from 'react';
import Son from './son';

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //   numberArray: [0, 1, 2],
      numberArray: [
        { number: 0 },
        { number: 1 },
        { number: 2 },
      ],
    };
  }
    // 点击后使numberArray中数组下标为index的数字值加一，重渲染对应的Son组件
    handleClick = (index) => {
      const preNumberArray = this.state.numberArray; // 这里其实是指向同一堆内存
      preNumberArray[index].number += 1;
      this.setState({
        numberArray: preNumberArray,
      });
    }
    render() {
      return (<div style={{ margin: 30 }}>{
                this.state.numberArray.map(
                  (number, key) => {
                    return <Son
                      key={key}
                      index={key}
                      number={number}
                      handleClick={this.handleClick}
                    />;
                  }
                )
                }
      </div>);
    }
}
export default Father;
