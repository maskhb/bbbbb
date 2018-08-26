# 导入弹窗公共组件
## 参数
  - dragger 是否支持使用拖拉上传 boolen
    > - true 不使用
    > - false或不写 使用
  - title 标题
  - onOk 点击确认时回调(此参数与actionProps 冲突) function
    > - onOk({url:'...', originalFileName: '...'})
    > 当存在这个参数时,不再根据 actionProps 自动提交
  - actionProps 批量提交参数 Object
    > - url 导入的URL String
    > - params 获取提交参数的函数 function(file)
    > - params 请求参数， 会在onOk中返回或以后在公共调用接口中使用 object
  - templateLabel 下载模板的label
  - templateUrlProps 模板下载的参数,对应Download组件. Object
  - uploadProps 文件上传的参数 Object
  - onCancel 取消 function
  - onSuccess 成功导入的回调,如果为空,自动modal弹窗提示跳转到批量导入管理页面 function
  - remark 导入显示的备注文字
  - visible 是否显示
## 例子
```javascript
  <ModalImport
    dragger
    title="导入属性"
    // onOk={this.handleOk}
    actionProps={{
      url: '/mj/ht-mj-goods-server/exportTemplate/goods/importData',
      params(file) {
        return {
          uploadFileVo: {
            propertyGroupId,
            fileUrl: file.url,
            prefixBusinessType,
          },
        };
      },
    }}
    templateLabel="属性模板"
    templateUrlProps={{
      baseUrl: '/ht-mj-goods-server/exportTemplate/goods/exportTemplate',
      query: {
        bussinessType: 2,
      },
      title: '下载属性模板',
    }}
    // ref={(ref) => { this.import = ref; }}
    uploadProps={{
      maxSize: 1024 * 5,
    }}
    onCancel={this.handleCancel}
    remark={this.renderRemark()}
    visible={visible}
    onSuccess={() => console.log('成功导入')}
  />
);
```
