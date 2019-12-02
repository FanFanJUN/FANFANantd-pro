## [前台访问地址NGINX](http://129.28.167.200:9999)
## [前台访问地址dockerNGINX](http://129.28.167.200:8888)
## [知识日志](https://github.com/FanFanJUN/STUDY-DAY-BY-DAY)
## 对AntdPro UI一些方面的封装

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
