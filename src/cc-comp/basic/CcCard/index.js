import React from 'react';
import { Card } from 'antd';
import { createRouteid } from '@/utils/utils';
import { getSessionStorage } from '@/utils/storage';

/**
 * @description 基于原生Card
 * @author LC@1981824361
 * @date 2019-12-13
 * @class CcInput
 * @extends {Card}
 */
class CcInput extends Card {
  constructor(props) {
    super(props);
    this.state = {
      cardStyle: props.style,
      routeid: createRouteid(),
    };
  }

  /**
   * @description 全局Card最小高度设定 不需要设定传入auto属性
   * @author LC@1981824361
   * @date 2019-12-13
   * @memberof CcInput
   */
  componentDidMount() {
    const { routeid } = this.state;
    if (!this.props.auto) {
      const CardDom = document.getElementById(routeid);
      if (getSessionStorage('contentMinHeight')) {
        const { cardStyle } = this.state;
        if (CardDom) {
          const cardMinHight = Number(getSessionStorage('contentMinHeight'));
          CardDom.style.minHeight = `${cardMinHight}px`;
          this.setState({ cardStyle: { ...cardStyle } });
        }
      }
    }
  }

  render() {
    const { ...rest } = this.props;
    const { routeid } = this.state;
    delete rest.auto;
    return (
      <Card id={routeid} title={this.props.title} bordered={false} style={this.state.cardStyle} {...rest} />
    );
  }
}

export default CcInput;
