/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-09-08 14:29:17
 * @LastEditTime: 2020-09-23 14:35:06
 * @Description: 页面按钮基 和操作集
 * @FilePath: /FANFANantd/src/cc-comp/basic/Header/index.js
 */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Icon } from 'antd';
import styles from './index.less';

const Header = forwardRef(
  (
    {
      left = null,
      right = null,
      extra = '高级查询',
      content = null,
      advanced = false,
      advancedProps = {},
    },
    ref,
  ) => {
    const [visible, triggerVisible] = useState(false);
    const hide = () => triggerVisible(false);
    useImperativeHandle(ref, () => ({
      hide,
    }));
    return (
      <div style={{
        position: 'relative',
      }}
      >
        <div className={classnames([styles.wrapper, styles.flexBetweenStart])}>
          <div className={styles.headerLeftWrapper}>
            {left}
          </div>
          <div className={styles.flexBetweenStart}>
            {right}
            {advanced && (
              <Button
                icon={visible ? 'up' : 'down'}
                onClick={() => triggerVisible(!visible)}
                {...advancedProps}
              >
                {extra}
              </Button>
            )}
          </div>
        </div>
        <div
          className={classnames({
            [styles.modal]: true,
            [styles.show]: visible,
            [styles.hide]: !visible,
          })}
        >
          <Icon type="close" className={styles.close} onClick={hide} />
          <div className={styles.content}>{content}</div>
        </div>
      </div>
    );
  },
);

Header.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  extra: PropTypes.string,
  content: PropTypes.node,
};

export default Header;
