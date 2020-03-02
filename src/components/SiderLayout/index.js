import React, { PureComponent } from 'react';
import { Layout, Popover, Tooltip, Switch } from 'antd';
import { Debounce } from 'lodash-decorators/debounce';
// import history from 'umi';
import { connect, history } from 'umi'; import styles from './index.less';
import NoticeIcon from '@/components/NoticeIcon';
import { getSessionStorage } from '@/utils/storage';

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

  handleLoginout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
      payload: {},
    });
    // history.push('/user');
  }

  returnHome = () => {
    // const {location: { pathname }} = this.props;
    history.push('/dashboard/analysis');
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

  openPage=() => {
    window.open('https://github.com/FanFanJUN');
  }
  @Debounce(600)
  triggerResizeEvent = () => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    // const textUser = '用户信息';
    // const textLoginout = '登出';
    const text = {
      textUser: '用户信息',
      textGitHub: 'FanFanJUN的GitHub',
      textLoginout: '登出',
    };
    const content = (
      <div>
        <span><strong>当前登陆用户:{getSessionStorage('currentUser')}</strong></span>
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
            title={text.textUser}
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
          <div className={styles.button}>
            <Tooltip placement="right" title={text.textGitHub}>
              <img src="/iconfont/github.svg" style={{ width: 30 }} alt="logo" onClick={this.openPage} />
            </Tooltip>
          </div>
        </div>
        <div className={styles.d1}>
          <Tooltip placement="right" title={text.textLoginout}>
            <div className={styles.button}>
              <img src="/iconfont/logout.svg" style={{ width: 30 }} alt="logo" onClick={this.handleLoginout} />
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
