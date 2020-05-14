/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import { Example001, Example002, Example003 } from './exportcomponents';

class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      ponents: [
        {
          test: <Example001 />,
          text: '组件状态setState同步异步问题?',
          href: 'https://www.javascriptc.com/interview-tips/zh_cn/react/reactjs-setstate-interview/',
        },
        {
          test: <Example002 />,
          text: 'shouldComponentUpdate, 基础类型浅比较',
        },
        {
          test: <Example003 />,
          text: 'shouldComponentUpdate, 对象类型',
        },
      ],
    };
  }


  render() {
    const { ponents } = this.state;
    return (
      <Fragment>
        {
        ponents.map((item) => {
          return <Fragment><a href={item.href} target="_blank"><strong>{item.text}</strong></a>{item.test}<hr /><br /></Fragment>;
        })
      }
      </Fragment>
    );
  }
}

export default Example;
