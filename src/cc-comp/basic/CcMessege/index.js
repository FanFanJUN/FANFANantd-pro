import { Modal, message } from 'antd';

const justTip = () => {
  return false;
};

const baseParams = {
  title: '提示',
  centered: true,
  maskClosable: true,
  maskStyle: { backgroundColor: 'transparent' },
  okText: '确定',
};

const exec = (method, msg) => {
  // eslint-disable-next-line no-unused-expressions
  justTip(msg) ? message.info(msg)
    :
    Modal[method].call(null, {
      content: `${msg}`,
      ...baseParams,
    });
  // call改变函数this对象指向 call立即执行 call后面的参数有序传入
};

const CcMessege = {
  info: (msg) => {
    exec('info', msg);
  },
  error: (msg) => {
    exec('error', msg);
  },
  success: (msg) => {
    exec('success', msg);
  },
  warning: (msg) => {
    exec('warning', msg);
  },
};

export default CcMessege;
