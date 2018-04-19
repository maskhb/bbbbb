# 表格过滤选择栏

## 参数

  - radioOptions tabBar参数 array
    > - label tab名称
    > - value 判断或请求参数，在onChange中返回
  - onChange tab更改后回调 function

## 例子
      <TableSearchFilterBar
          {...this.props}
          radioOptions={this.getRadioOptions()}
          onChange={this.handleChange}
        />

      getRadioOptions = () => {
        return [
          {
            label: '全部订单',
            value: {
              orderStatus: '',
            },
          },
          {
            label: '待支付',
            value: {
              orderStatus: '1',
            },
          },
        ];
      }

      handleChange = (values) => {
        const { dispatch } = this.props;
        return dispatch({
          type: 'orders/list',
          payload: values,
        });
      }


