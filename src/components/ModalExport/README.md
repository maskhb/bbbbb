# 导出公共组件（可修改导出文件名称）


# ModalExport/index.js UI组件

## 参数
  - hideBtn 是否使用组件自带的导出按钮 boolen
    > - true 不使用
    > - false或不写 使用
  - tabOptions 导出tab和字段参数 array
    > ##### 必填 数组为1个时不显示tab栏
    > - title 导出tab的标题
    > - fields 导出内容显示字段 array[string]
    > - params 请求参数， 会在onOk中返回或以后在公共调用接口中使用 object
  - onOk 导出回调事件 function
    > ##### 必填
    > - 暂时需自己调用接口，把返回结果return
    > - 如导出接口确定在修改
  - isOkHide 导出后调事件执行后是否自动关闭弹框 boolean
    > - true或不写 自动关闭
    > - false 不自动关闭
  - onCancel 取消回调事件 function
    > - 不写 自动关闭

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
    handleExportOk = (values) => {
      //values包括params中的内容
      console.log(values);

      return {
        code: 0,
        title: '订单导出失败',
        msg: '订单导出失败',
        isHide: true,
        succ: {
          title: '订单',
          count: 200,
          min: 10,
        },
      };
    }

# ModalExport/business.js 业务组件





