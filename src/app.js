// umi 约定 src 目录下的 app.js 为运行时的配置文件。
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export function render(oldRender) {
  oldRender();
}
