/* eslint-disable import/extensions */
import React from 'react';
import { Drawer, Tooltip } from 'antd';
import left from '@/assets/arrow.svg';
import book from '@/assets/book.svg';
import styles from './sider.less';

class Mudle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checked: false,
    };
  }

  showDrawer=() => {
    this.setState({ visible: true });
  }

  onClose=() => {
    this.setState({ visible: false });
  }

  changePosition=() => {
    this.setState({
      visible: false,
      checked: false,
    });
  }

  showChildrenDrawer=() =>{
    this.setState({ checked: true})
  }

  render() {
    const { visible, checked } = this.state;
    const diffWidth = 506; // 区分IE
    return (
      <div>
        <span className={styles.toolbar} onClick={this.showDrawer}>
          <span className={styles.right} />
          工具框
        </span>
        <Drawer
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          width={checked ? diffWidth : 36}
          className={styles.toggleBody}
          // style={{ height: '100%', position: 'relative' }}
          mask={false}
        >
          <ul style={checked ? { position: 'absolute', top: '20%', right: 0 } : { position: 'absolute', top: '20%' }}>
          <li style={{ height: 36 }} onClick={this.showChildrenDrawer}>
              <Tooltip placement="right" title="指导手册">
                <img src={book} alt="" style={{ width: '36px' }} />
              </Tooltip>
            </li>
            <li style={{ height: 36 }} onClick={this.changePosition}>
              <Tooltip placement="right" title="返回上一级">
 {/*             
    -(document.body.clientHeight * 0.8 - 370 + 36 - 36 * 1)
 */}                <img src={left} alt="" style={{ width: '36px', position: 'absolute', bottom: 0 }} />
              </Tooltip>
            </li>
          </ul>
        </Drawer>
      </div>
    );
  }
}

export default (Mudle);
