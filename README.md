## 对AntdPro UI一些方面的封装

#### 登陆页面
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1559133673/antd/indexPage.png)
#### 侧边栏工具栏
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1558786486/QQ20190525-201354.png)
#### 全屏界面
![image](https://res.cloudinary.com/dnmtpbj1g/image/upload/v1558787213/3.png)
#### 工具类util.js


#### 页面常用工具方法封装
[详细会在博客](lcccc.com.cn)


#### 使用

```
- $ git clone https://github.com/FanFanJUN/FANFANantd-pro.git --depth=1 FanFanantd-Pro
- $ cd FanFanantd-Pro
- $ npm install
- $ npm start
```
#### 201905271833
- 登陆用户存入sessionstorage（storage工具）
- 登录界面样式修改
- 删除pacage.json提交前校验
#### 201905292042
- 登录界面
- 未登录跳转至首页
#### 201906010950
- 数据字典通用组件
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

# 正完善。。。。待续。。。