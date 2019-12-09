// https://umijs.org/config/
// p地址可以使用node的内置模块os模块获取，os模块中的networkInterfaces方法可以获取设备网卡的相关信息，包括IP地址和mac地址等
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
// import { CleanWebpackPlugin } from "clean-webpack-plugin";
import slash from 'slash2';

const { pwa, primaryColor } = defaultSettings;
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
// const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST } = process.env;

  /*
    类型：Array
    默认值：[]
    */
  // 如果插件有参数，则通过数组的形式进行配置，第一项是路径，第二项是参数，类似 babel 插件的配置方式。
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
        exclude: ['@babel/runtime', 'netlify-lambda'],
      },
      hardSource: false,
      // pwa: pwa
      //   ? {
      //       workboxPluginMode: 'InjectManifest',
      //       workboxOptions: {
      //         importWorkboxFrom: 'local',
      //       },
      //     }
      //   : false,
      // ...(!TEST && os.platform() === 'darwin'
      //   ? {
      //       dll: {
      //         include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //         exclude: ['@babel/runtime', 'netlify-lambda'],
      //       },
      //       hardSource: false,
      //     }
      //   : {}),
    },
  ],
  // 控制台打印出二维码 确保电脑和手机处于同一个局域网内，手机扫码即可预览，手机端支持实时刷新。
  // ['umi-plugin-qrcode',{
  //   small: false, // 二维码大小，默认small=true
  //   once: false // 第一次编译完成输出（默认）或者每次编译完成输出],
  // } ]
  // [new CleanWebpackPlugin()]
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
// if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
// }

export default {
  // add for transfer to umi
  plugins,
  // 通过 webpack 的 DefinePlugin 传递给代码，值会自动做 JSON.stringify 处理 用于配置全局变量
  // define: {
  //   ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
  //     ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  // },
  define: {
    UMI_ENV: process.env.UMI_ENV,
    APP_TYPE: process.env.APP_TYPE || '',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // devtool: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION ? 'source-map' : false,
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin, // 自定义webpack配置

  // 服务器代理配置
  "proxy": {
    "/api/lc": {
      "target": "http://129.28.167.200:20080",
      // "target": "http://localhost:20080", 
      "changeOrigin": true,
      // "pathRewrite": { "^/api" : "" }
    }
  }
};
