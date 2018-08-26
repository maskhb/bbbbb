import * as status from '../List/status';

export default () => {
  return [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: '250px',
    },
    {
      title: 'SKU编码',
      dataIndex: 'skuCode',
    },
    {
      title: '规格信息',
      dataIndex: 'property',
    }, {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return status.GOODS_STATUS[val];
      },
    },
    {
      title: '可售库存',
      dataIndex: 'remainNum',
    },
  ];
};
