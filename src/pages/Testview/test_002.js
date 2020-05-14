/* eslint-disable react/destructuring-assignment */
import React from 'react';

class Example002 extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
    setInterval(() => {
      this.setState((prevState) => ({
        count: prevState.count + 1,
      }));
      console.log(`setInterval call count->${this.state.count}`);
    }, 1000);
  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState) {
    // return true;
    // if (nextState.count % 5 === 0) {
    //   return true;
    // }
    if (nextState.count !== this.state.count) {
      return true;
    }
    return false;
  }

  render() {
    console.log('render begin');
    return this.state.count;
  }
}

export default Example002;
