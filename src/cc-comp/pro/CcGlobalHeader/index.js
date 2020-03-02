import React from 'react';
import { history } from 'umi';
import { Tooltip } from 'antd';
import styles from './index.css';
import { getSessionStorage, clearAllSessionStorage } from '@/utils/storage';

function CcGlobalHeader(props) {
  function handleClick(e) {
    history.push('/user/login');
    clearAllSessionStorage();
  }
  const { posses } = props;
  const possesStr = posses.map((item) => {
    return <span>{item.POSITION_NM}<br /></span>;
  });
  return (
    <div className={styles.header}>
      <div className={styles.logoTitle}>
        <p className={styles.sysLogo} />
        <h1 className={styles.sysTitle}>测试管理系统</h1>
      </div>

      <div className={styles.hdBtn}>
        <ul>
          <li className={styles.hdTitle} onClick={handleClick}>
            <span className={styles.hdTitleExit} />
            <a className={styles.hdTitleBtnLink}>
             退出
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.loginMessage}>
        <span className={styles.caraIcon} />
        <span className={styles.titleName}>您好! {getSessionStorage('currentUser')}</span>
        <span className={styles.titleName}>管理员</span>
        {posses.length > 1 ?
          <Tooltip title={possesStr} placement="bottom" className={styles.titleName}>
            [岗位信息]
          </Tooltip>
          :
          <span className={styles.titleName}>{posses[0] && posses[0].POSITION_NM || ''}</span>
        }
      </div>
    </div>
  );
}


export default CcGlobalHeader;
