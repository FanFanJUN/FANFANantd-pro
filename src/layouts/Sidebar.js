import React from 'react';
import styles from './sider.less';

class Mudle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <span className={styles.toolbar}>
          <span className={styles.right} />
          工具框
        </span>
      </div>
    );
  }
}

export default (Mudle);
