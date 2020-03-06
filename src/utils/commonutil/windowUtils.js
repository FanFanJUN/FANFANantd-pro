import { parse } from 'date-fns';

/**
 * 浏览器窗口工具
 */

const windowUtils = {

  // 打开一个水平垂直居中的新窗口---若不设置宽高，则显示全屏
  openNewWindow: ({ url, name = url, width, height, otherSpecs = {} }) => {
    const sizeSpecs = width && height ? {
      width,
      height,
      top: (window.screen.height - height) / 2,
      left: (window.screen.width - width) / 2,
    } : {};

    const specObj = Object.assign(
      { location: 0, menubar: 0, toolbar: 0 },
      sizeSpecs,
      otherSpecs,
    );

    const specs = Object.keys(specObj)
      .map(key => `${key}=${specObj[key]}`)
      .join(',');

    return window.open(url, name, specs); // 若在父窗口中关闭子窗口，可以通过当前对象:obj.close()
  },


  // 在子窗口中关闭当前窗口
  closeCurrentWindow: () => {
    window.opener = null; // 把父窗口声明为空
    window.open('', '_self', ''); // 父窗口把自己变成“子窗口”
    window.close(); // 关闭当前窗口
  },


  // 在子窗口中使用父窗口的dispatch,从而刷新父窗口数据
  parentWindowDispatch: (action) => {
    window.opener.g_app._store.dispatch(action);

    // 调用例子：
    // parentWindowDispatch({
    //     type: 'user/getUserList',
    //     playload: {},
    //     callback: () => { }
    // });
  },

  // 获取url地址的第一个参数值
  getPageQuery: () => {
    return parse(window.location.href.split('?')[1]);

    // 调用例子：
    // localhost:8000/user?ation=Tom
    // 返回 "Tom"
  },

};

export default windowUtils;
