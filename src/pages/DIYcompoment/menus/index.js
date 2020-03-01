import React from 'react';
import styles from './index.css';
import { CcCard } from '@/cc-comp/basic';

class Menus extends React.Component {
  constructor() {
    super();
    this.state = {
      menutv: [
        {
          href: 'xxx',
          title: '首页',
        },
        {
          href: 'aaa',
          title: '喜剧片',
        },
        {
          href: 'bbb',
          title: '动作片',
        },
        {
          href: 'ccc',
          title: '爱情片',
        },
      ],
    };
  }

  /**
   * @description 6V电影网
   * @memberof Menus
   */
  renderFirMenus =() => {
    const { menutv } = this.state;
    return (
      <ul>
        {menutv.map((item) => {
          return <li><a href={item.href}>{item.title}</a></li>;
        })}
      </ul>
    );
  }

  render() {
    return (
      <CcCard title="菜单大全">
        <div className={styles.menutv}>{this.renderFirMenus()} </div>
        <div className={styles.nav}>{this.renderFirMenus()} </div>
        <div className={styles.menubox}>{this.renderFirMenus()} </div>
      </CcCard>
    );
  }
}

export default Menus;
