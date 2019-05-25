import React, { PureComponent } from 'react';
import { Layout, Popover, Tooltip, Switch } from 'antd';
import { Debounce } from 'lodash-decorators/debounce';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import NoticeIcon from '@/components/NoticeIcon';

const { Sider } = Layout;

class SiderDemo extends PureComponent {
  constructor() {
    super();
    this.state = {
      fullFlag: true,
    };
  }
  toggle = () => {
    const { onCollapse, collapsed } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }

  onMenuClick = () => {
    router.push('/user');
  }

  returnHome = () => {
    // const {location: { pathname }} = this.props;
    router.push('/dashboard/analysis');
  }

  // 全屏
  toggleFullScreen = (flag) => {
    this.setState({ fullFlag: flag });
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  @Debounce(600)
  triggerResizeEvent = () => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    const textUser = '用户信息';
    const textLoginout = '登出';
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );
    const { fullFlag } = this.state;
    return (
      <Sider
        className={styles.sider}
        width={48}
      >
        <div>
          <Popover
            placement="rightTop"
            title={textUser}
            content={content}
            trigger="hover"
          >
            <div className={styles.button}>
              <img src="/iconfont/user.svg" style={{ width: 30 }} alt="logo" />
            </div>
          </Popover>
          <div className={styles.button}>
            <img src="/iconfont/detail.svg" style={{ width: 30 }} alt="logo" onClick={this.toggle} />
          </div>
          <div className={styles.button}>
            <img src="/iconfont/notice.svg" style={{ width: 30 }} alt="logo" onClick={this.showNotice} />
          </div>
          {/* <NoticeIcon
            className={styles.button}
          >
            <NoticeIcon.Tab
              title="通知"
            />
            <NoticeIcon.Tab
              title="通知1"
            />
            <NoticeIcon.Tab
              title="通知2"
            />
          </NoticeIcon> */}
          <div className={styles.button}>
            <img src="/iconfont/home.svg" style={{ width: 30 }} alt="logo" onClick={this.returnHome} />
          </div>
          {/*  <li onClick={this.toggleFullScreen}>
              <a className="request-fullscreen">
                <Icon type="screen-full" />
              </a>
            </li> */}
          {fullFlag ?
            <div className={styles.button}>
              <img src="/iconfont/fullscreen.svg" style={{ width: 30 }} alt="logo" onClick={() => this.toggleFullScreen(false)} />
            </div>
            :
            <div className={styles.button}>
              <img src="/iconfont/exitfullscreen.svg" style={{ width: 30 }} alt="logo" onClick={() => this.toggleFullScreen(true)} />
            </div>
      }
        </div>
        <div className={styles.d1}>
          <Tooltip placement="right" title={textLoginout}>
            <div className={styles.button}>
              <img src="/iconfont/logout.svg" style={{ width: 30 }} alt="logo" onClick={this.onMenuClick} />
            </div>
          </Tooltip>
        </div>
      </Sider>
    );
  }
}
function mapStateToProps(state) {
  return ({
    user: state.login,
  });
}

export default connect(mapStateToProps)(SiderDemo);
