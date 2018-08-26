import React from 'react';
import { Table, InputNumber, Popconfirm, Switch, Form } from 'antd';
import _ from 'lodash';
import { mul } from 'utils/number';
import * as status from '../List/status';
import { fenToYuan } from '../../../../utils/money';

const FormItem = ({ rules: ruleList, label, keyName, children, initialValue, form }) => {
  return (
    <Form.Item label={label}>
      {form.getFieldDecorator(keyName, {
        rules: ruleList,
        initialValue,
      })(
        children
      )}
    </Form.Item>
  );
};

export default class GoodsListTable extends React.Component {
  getColumns = () => {
    const { goodsPackage, record: { spaceId }, dispatch, form, isDetail } = this.props;
    const { detail } = goodsPackage;
    const spaceIndex = _.findIndex(detail.packageSpaceVoQs, item => item.spaceId === spaceId);
    const currSpaceGoodsList = detail.packageSpaceVoQs[spaceIndex].packageGoodsList;

    const selectedGoodsList = _.filter(currSpaceGoodsList, (item) => { return item.isDefault; });

    return [{
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (val, record, index) => {
        let disabled = false;

        if (!val) {
          disabled = Boolean(_.find(selectedGoodsList, ((item) => {
            return item.goodsId === record.goodsId;
          })));
        }

        return (
          <Switch
            disabled={disabled}
            checked={Boolean(val)}
            onChange={this.handleDefault.bind(this, { spaceIndex, index })}
          />
        );
      },
    }, {
      title: '商品名称',
      dataIndex: 'goodsName',
    }, {
      title: 'SKU编码',
      dataIndex: 'skuCode',
    }, {
      title: '规格信息',
      dataIndex: 'property',
      render(val, record) {
        return record.specifications || val;
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return status.GOODS_STATUS[Number(val)];
      },
    }, {
      title: '可售库存',
      dataIndex: 'remainNum',
    }, {
      title: '售价',
      dataIndex: 'salePrice',
      render(val) {
        return fenToYuan(val);
      },
    }, {
      title: '套餐内单价',
      dataIndex: 'packagePrice',
      render: (val, record, index) => {
        return (
          <FormItem
            form={form}
            initialValue={fenToYuan(record.packagePrice, true)}
            rules={[{
              required: true, message: '请输入套餐内单价',
            }]}
            keyName={`packagePrice__${index}__${spaceId}`}
          >
            <InputNumber
              formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
              min={0}
              max={fenToYuan(record.salePrice, true)}
              step={0.01}
              disabled={isDetail}
              onChange={(value) => {
                currSpaceGoodsList[
                  index
                ].packagePrice = mul(value, 100);
                detail.totalPrice = this.props.getTotal(detail);
                dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
              }}
            />
          </FormItem>
        );
      },
    }].concat(isDetail ? [] : [{
      title: '操作',
      dataIndex: 'goodsId',
      render: (val, record, index) => {
        return (
          <Popconfirm
            placement="top"
            title="确认删除？"
            onConfirm={this.handleRemove.bind(this, { goodsId: val, spaceIndex, index })}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        );
      },
    }]);
  }

  handleDefault({ spaceIndex, index }, checked) {
    const { goodsPackage, dispatch } = this.props;
    const { detail } = goodsPackage;
    detail.packageSpaceVoQs[spaceIndex].packageGoodsList[index].isDefault = checked;
    detail.totalPrice = this.props.getTotal(detail);
    dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
  }

  handleRemove = ({ spaceIndex, index }) => {
    const { goodsPackage, dispatch } = this.props;
    const { detail } = goodsPackage;
    detail.packageSpaceVoQs[spaceIndex].packageGoodsList.splice(index, 1);
    detail.totalPrice = this.props.getTotal(detail);
    dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
  }

  render() {
    const { goodsPackage, record: { spaceId } } = this.props;
    const { detail } = goodsPackage;
    const space = _.find(detail.packageSpaceVoQs, item => item.spaceId === spaceId);

    return (
      <Table
        columns={this.getColumns()}
        dataSource={space?.packageGoodsList || []}
        pagination={false}
        rowKey="skuId"
      />
    );
  }
}
