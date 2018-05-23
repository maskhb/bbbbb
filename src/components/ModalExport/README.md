# 导出公共组件（可修改导出文件名称）


# ModalExport/index.js UI组件

## 参数
  - hideBtn 是否使用组件自带的导出按钮 boolen
    > - true 不使用
    > - false或不写 使用
  - title 标题
  - params 导出tab和字段参数 array
    > ##### 必填 数组为1个时不显示tab栏
    > - title 导出tab的标题
    > - fields 导出内容显示字段 array[string]
    > - params 请求参数， 会在onOk中返回或以后在公共调用接口中使用 object
  - exportModalType 导出类型 1可修改导出文件名的弹框 2有时间按的弹框 3弹框
  - convertParam 请求参数格式化

## 例子
    <ModalExport tabOptions={this.getExportModalOptions()} onOk={this.handleExportOk} />
    getExportModalOptions = () => {
      return [
        {
          title: '订单基本信息',
          fields: ['订单号', '所属商家', '订单来源'],
          params: {
            code: 1,
          },
        },
        {
          title: '订单商品信息',
          fields: ['订单号'],
          params: {
            code: 2,
          },
        },
        {
          title: '订单信息',
          fields: ['订单来源'],
          params: {
            code: 3,
          },
        },
      ];
    }


# ModalExport/business.js 业务组件





