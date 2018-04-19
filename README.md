# react-framework-base
开箱即用的中台前端/设计解决方案。 

- 预览
- 首页
- 使用文档
- 更新日志
- 常见问题

## 特性

- **优雅美观**：基于 Ant Design 体系精心设计
- **常见设计模式**：提炼自中后台应用的典型页面和场景
- **最新技术栈**：使用 React/dva/antd 等前端前沿技术开发
- **响应式**：针对不同屏幕大小设计
- **主题**：可配置的主题满足多样化的品牌诉求
- **国际化**：内建业界通用的国际化方案
- **最佳实践**：良好的工程实践助您持续产出高质量代码
- **Mock 数据**：实用的本地数据调试方案
- **UI 测试**：自动化测试保障前端产品质量

## 开发

启动：
```bash
$ npm install
$ npm start         # 访问 http://localhost:8000
```

环境变量说明
* API_ENV, API环境 development|dev|sit|beta|stg|release|fix|stress
* NO_RPOXY, 是否开启代理,现阶段默认false,开启时全局mock
* NODE_ENV, 编辑环境, development | production

mock 使用说明

* /mock 目录存放mock 文件,支持多级目录(可根据模块进行分级),自动生成的mock url 格式为 /mock/api/[目录]/[目录...]/[文件]/[方法], /mock/api/json/[目录]/[目录...]/[文件]/[方法]
* 可以接口请求中添加headers 属性,强制请求mock
```javascript
request('/api/login', {mock: true, ...}) # 在非production 环境下强制使用mock
request('/api/login', {mock: false, ...}) # 强制不适用mock
// 注意在请求的url 中无须加上 /mock !!!
```

## 项目结构
```
├─doc                           # 文档
├─mock                          # 本地模拟数据
├─public
│  ├─favicon.ico                # 网站图标
├─src
│  ├─assets                     # 本地静态资源
│  ├─components                 # 组件
│  ├─config                     # 配置
│  ├─core                       # 核心功能
│  ├─e2e                
│  ├─layouts                    # 模板
│  ├─models                     # dva model
│  ├─services                   # 后端接口
│  ├─utils                      # 工具
│  └─views                      # 页面
├─templates                     # 模板
├─tests                         # 测试配置
└─tools                         # 开发工具
```

## 文档
- [配置](./doc/配置.md)
- [主题](./doc/主题.md)
- [代码规范](./doc/代码规范.md)
- [less模块化编写指引](./doc/less模块化编写指引.md)
- [数据流编写指引](./doc/数据流编写指引.md)
- [mock编写指引](./doc/mock编写指引.md)
- [路由菜单权限](./doc/路由菜单权限.md)
- [开发套路指引](./doc/开发套路指引.md)
- [表单组件封装](./doc/表单组件封装.md)
- [本地自动化模拟](./doc/本地自动化模拟.md)
- [webpack打包优化指引](./doc/webpack打包优化指引.md)

## 组件
- [面包屑](./doc/面包屑.md)
- [富文本编辑](./src/components/Editor/README.md)

## 模板
- Dashboard
  - 分析页
  - 监控页
  - 工作台
- 表单页
  - 基础表单页
  - 分步表单页
  - [高级表单页](./templates/模板-表单页-高级表单页/README.md)
- 列表页
  - [查询表格](./doc/模板-列表页-查询表格/README.md)
  - 标准列表
  - 卡片列表
  - 搜索列表（项目/应用/文章）
- 详情页
  - [基础详情页](./doc/模板-详情页-基础详情页/README.md)
  - 高级详情页
- 结果
  - 成功页
  - 失败页
- 异常
  - 403 无权限
  - 404 找不到
  - 500 服务器出错
- 帐户
  - 登录
  - 注册
  - 注册成功
  
## 兼容性

现代浏览器及IE10+。

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建：

## 修改文件生效的注意项
* 修改proxy.json，保存.roadhogrc.mock.js生效
* 新增src/views/xx/view.js、src/views/xx/view.json，保存src/core/router/centra.js生效路由，保存src/core/menu/centra.js生效菜单
