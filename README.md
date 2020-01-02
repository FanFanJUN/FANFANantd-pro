## [前台访问地址NGINX](www.yangwenshu.com.cn)
## [前台访问地址dockerNGINX](http://129.28.167.200:8888)
## [知识日志](https://github.com/FanFanJUN/STUDY-DAY-BY-DAY)
## 对AntdPro UI一些方面的封装

#### 登陆页面
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1559133673/antd/indexPage.png)
#### 侧边栏工具栏
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1560587440/antd/%E4%BE%A7%E8%BE%B9%E6%A0%8F.png)
#### 全屏界面
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1560587495/antd/%E5%85%A8%E5%B1%8F.png)
#### 组件（二维码||条形码）
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1560682023/antd/0616.png)
#### 公共组件
![公共组件](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1574216556/antd/common.png)
#### 地图
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1560840107/antd/map.png)
#### table
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1560840106/antd/table.png)
#### [echarts](https://echarts.baidu.com/index.html)
![组织结构图](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1563325301/antd/echarts.jpg)
#### [React中使用AntV-G6](https://www.yuque.com/antv/g6/intro)
![G6](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1566027291/antd/G6.jpg)
![G6update](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1566217462/antd/G6up.jpg)

#### 工具类util.js


#### 页面常用工具方法封装
[详细会在博客](lcccc.com.cn)


### 安装运行
##### 1.下载或克隆项目源码
##### 2.yarn 或者 npm安装相关包文件(使用yarn或者[淘宝镜像源](https://npm.taobao.org/)）

```js
// 首推荐使用yarn装包
yarn or npm or cnpm istall
```
##### 3.启动项目
```js
yarn start or npm start
```
##### 4.打包项目
```js
yarn build or npm run build
```
##### 5.样式替换
```
src/antd-style 目录下替换node_modules/antd/es/style
```
#### 官方antd组件版本更新日志

[更新日志](https://ant.design/changelog-cn)

#### npm常用命令

```
npm -v
查看npm当前版本

node -v
查看node当前版本

where node/npm
查看node或者npm位置

npm show 包名 versions
查看指定包的所有版本

npm ls 包名
查看当前项目中应用的包版本

npm install 包名 -s 或者 --save
下载包至本地并写入dependencies

npm install 包名 -g
全局安装

npm install -d 或者--save-dev
下载包至本地并写入devDependencies

npm install 包名@latest -g
下载最新版本的包

npm uninstall <package>
删除 node_modules 目录下面的包（package）

npm uninstall --save <package>
如需从 package.json 文件中删除依赖，需要在命令后添加参数 --save

```
#### node

```
 sudo npm install -g n
 安装 n 工具，这个工具是专门用来管理node.js版本的，别怀疑这个工具的名字，是他是他就是他，他的名字就是 "n"
 
 sudo n stable
安装最新版本的node.js

```

#### 201905271833
- 登陆用户存入sessionstorage（storage工具）
- 登录界面样式修改
- 删除pacage.json提交前校验
```
"husky": {
    "hooks": {
      "pre-commit": "npm run lint-staged"
    }
  },
  "lint-staged": {
    "**/*.less": "stylelint --syntax less",
    "**/*.{js,jsx}": "npm run lint-staged:js",
    "**/*.{js,ts,tsx,json,jsx,less}": [
      "node ./scripts/lint-prettier.js",
      "git add"
    ]
  },
```
#### 201905292042
- 登录界面
- 未登录跳转至首页
#### 201906010950
- 数据字典通用组件
#### 201906071620
- 数据字典bug fixed，新增工具方法数据字典码值=>数据字典名称(数据字典翻译)
#### 201906112002
- 详情页使用DescriptionList组件样式修改
- 更新antd组件至"antd": "^3.19.3"
#### 201906151625
```
全屏||退出全屏 纯js代码
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
 ```
#### 201906161844
```
新增在react中生成二维码||条形码
```
#### 201906181436
```
新增在react中使用地图组件
新增回到顶部backtop组件
table样式修改
内容区域样式修改
```
#### 201906192047
```
SpringBoot与AntDPro整合,初步实现前后端分离
```
#### 201907170900
```
全屏bug fixed  echarts树图
```
#### 201908171520
```
antv-g6的使用
```
#### 201908201427
```
antd Card&&pagination 样式重构
```
![样式修改](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1566283612/antd/cardpag.jpg)
#### 201909031030
```
金钱组件
今日头条西瓜播放器https://github.com/bytedance/xgplayer
```
[Spring-Boot整合AntD-Pro](https://github.com/FanFanJUN/Spring-Boot)
### 推荐依赖模块
- [screenfull](https://github.com/sindresorhus/screenfull.js/)(<span style="color: rgb(243,121,52);">全屏插件</span>)
- [react-qmap](https://github.com/yezihaohao/react-qmap)(<span style="color: rgb(243,121,52);">一个对腾讯web地图简单封装的React组件</span>)
- [react-amap](https://github.com/ElemeFE/react-amap)(<span style="color: rgb(243,121,52);">基于 React 封装的高德地图组件</span>)
- [animate.css](https://github.com/daneden/animate.css)(<span style="color: rgb(243,121,52);">css动画库</span>)
- [JsBarcode](https://github.com/lindell/JsBarcode)(<span style="color: rgb(243,121,52);">前端JavaScript条形码生成解决方案</span>)
- [react-barcode](https://github.com/kciter/react-barcode)(<span style="color: rgb(243,121,52);">在React中生成条形码</span>)
- [qrcode.react](https://github.com/zpao/qrcode.react)(<span style="color: rgb(243,121,52);">A React component to generate QR codes</span>)
# 正完善。。。。待续。。。