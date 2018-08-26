# 下载公共业务组件


# Download/index.js 业务组件

## 参数
  - baseUrl String 下载Url,[服务名]/[url]
  - query Object 参数
  - async boolean 是否异步请求加密 data
    > - 默认true
  
## 例子
```javascript
  import Download, { ExportDownload } from 'components/Download';
  // or
  // import ExportDownload from 'components/Download/ExportDownload';
  // 新的下载
  // baseUrl 下载URL([服务名]/[对应的URL])
  // title 显示文字 可选
  // query 参数 可选
  <Download
    baseUrl="/ht-mj-goods-server/exportTemplate/goods/exportTemplate"
    query={{bussinessType: 2}}
    title="下载属性导入模板" />

  // 旧的导出下载
  // exportId 导出ID
  // title 显示文字 可选
  // loginType 用户类型 可选
  <ExportDownload exportId="1032" />

```



