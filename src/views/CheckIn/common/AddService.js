import React from 'react';
import _ from 'lodash';
import { Icon, Button, Select, Row, Col, InputNumber, Popconfirm, Input } from 'antd';
import { div } from 'utils/number';
import FormItem from './FormItem';

let num = 0;

const getKeyName = (id, key, prefix) => `${prefix}[${id}].${key}`;
// operate  [add,edit,delete] true false
export default class AddService extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      randomKey: `addServiceKey__${props.randomKey || (Math.random() * 10000).toFixed(0)}`,
    };
  }

  getRemainQty = (id) => {
    const { checkIn: { gresDetails }, form, isCheckIn } = this.props;

    const values = form.getFieldsValue();
    const curItem = values?.addServiceOrders?.[id];

    if (curItem?.serviceItemId) {
      return (curItem?.[isCheckIn ? 'useQty' : 'unitQty'] || 0) - _.reduce(
        _.filter(gresDetails?.assginServiceOrders, item =>
          item.serviceItemId === Number(curItem?.serviceItemId)
        ), (sum, item) => sum + (item[isCheckIn ? 'useQty' : 'unitQty'] || 0), 0);
    }

    return 0;
  }

  getServiceItemNameById(id) {
    const { checkIn: { serviceItemList } } = this.props;
    return _.find(serviceItemList, item =>
      Number(item.serviceItemId) === Number(id))?.serviceName;
  }

  handleAddItem = () => {
    const { form, arrDefaultKey } = this.props;
    const { randomKey } = this.state;
    const packageServiceOrders = form.getFieldValue(randomKey);
    if (num === 0 && arrDefaultKey.length) {
      num = arrDefaultKey.length;
    }
    packageServiceOrders?.push({
      id: num,
    });
    num += 1;

    form.setFieldsValue({
      [randomKey]: packageServiceOrders,
    });
  }

  handleDeleteItem = (index) => {
    const { form } = this.props;
    const { randomKey } = this.state;
    const packageServiceOrders = form.getFieldValue(randomKey);
    packageServiceOrders.splice(index, 1);

    form.setFieldsValue({
      [randomKey]: packageServiceOrders,
    });
  }

  reset = (id, value) => {
    const { form, keyName, checkIn: { serviceItemList, gresDetails }, isCheckIn } = this.props;
    const { salePrice } = _.find(serviceItemList, item =>
      item.serviceItemId === Number(value)) || {};

    const serviceOrderIdKey = getKeyName(id, 'serviceOrderId', keyName);
    const serviceItemIdKey = getKeyName(id, 'serviceItemId', keyName);

    form.setFieldsValue({
      [getKeyName(id, isCheckIn ? 'useQty' : 'unitQty', keyName)]: 1,
      [getKeyName(id, 'salePriceFormat', keyName)]: div(salePrice, 100),
      [serviceOrderIdKey]: Number(_.get(gresDetails, serviceItemIdKey)) === Number(value) ?
        _.get(gresDetails, serviceOrderIdKey) || 0 : 0,
      [getKeyName(id, 'serviceName', keyName)]: this.getServiceItemNameById(value) || _.get(gresDetails, getKeyName(id, 'serviceName', keyName)),
    });
  }

  filterHasSelectedOptions = (list, id) => {
    const { keyName, form, checkIn: { gresDetails } } = this.props;
    const { randomKey } = this.state;
    const values = form.getFieldsValue();

    const curServiceItemId = Number(_.get(values, getKeyName(id, 'serviceItemId', keyName)));

    const arr = _.map(values[randomKey], (item) => {
      return Number(_.get(values, getKeyName(item.id, 'serviceItemId', keyName)));
    });

    const newArr = _.filter(list, item => (
      arr.indexOf(item.serviceItemId) === -1 || item.serviceItemId === curServiceItemId));

    if (!_.find(newArr, item => item.serviceItemId === curServiceItemId)) {
      newArr.push({
        serviceItemId: curServiceItemId,
        serviceName: _.get(gresDetails, getKeyName(id, 'serviceName', keyName)),
      });
    }

    return newArr;
  }

  render() {
    const {
      form, checkIn: { serviceItemList, gresDetails },
      keyName, disabled, arrDefaultKey, operate = [true, true, true], isCheckIn,
    } = this.props;
    const { randomKey } = this.state;
    form.getFieldDecorator(randomKey, { initialValue: arrDefaultKey || [] });
    const packageServiceOrders = form.getFieldValue(randomKey);

    const rules = [{
      required: true, message: '不能为空',
    }];

    return (
      <div>
        {
          packageServiceOrders?.map((item, index) => {
            if (keyName === 'addServiceOrders') {
              rules.push({
                validator: (rule, value, callback) => {
                  if (this.getRemainQty(item.id) < 0) {
                    callback('预订数量不允许小于当前已分配数量');
                  } else {
                    callback();
                  }
                },
              });
            }
            return (
              <Row key={item.id} gutter={2}>
                <Col style={{ display: 'none' }}>
                  <FormItem
                    form={form}
                    keyName={getKeyName(item.id, 'serviceOrderId', keyName)}
                    detailDefault={gresDetails}
                  >
                    <Input disabled />
                  </FormItem>
                </Col>
                <Col style={{ display: 'none' }}>
                  <FormItem
                    form={form}
                    keyName={getKeyName(item.id, 'source', keyName)}
                    detailDefault={gresDetails}
                  >
                    <Input disabled />
                  </FormItem>
                </Col>
                <Col style={{ display: 'none' }}>
                  <FormItem
                    form={form}
                    keyName={getKeyName(item.id, 'serviceName', keyName)}
                    detailDefault={gresDetails}
                  >
                    <Input disabled />
                  </FormItem>
                </Col>
                <Col span={9}>
                  <FormItem
                    form={form}
                    keyName={getKeyName(item.id, 'serviceItemId', keyName)}
                    rules={[{ required: true, message: '不能为空' }]}
                    detailDefault={gresDetails}
                  >
                    <Select
                      style={{ width: '100%', fontSize: 12 }}
                      disabled={item.disabled || !operate[1]}
                      onChange={(value) => {
                      this.reset(item.id, value);
                    }}
                    >
                      {
                      this.filterHasSelectedOptions(serviceItemList, item.id)?.map(
                        itemService => (
                          <Select.Option
                            value={itemService.serviceItemId}
                            key={itemService.serviceItemId}
                          >
                            {itemService.serviceName}
                          </Select.Option>))
                    }
                    </Select>
                  </FormItem>
                  {(keyName === 'addServiceOrders') ?
                    <div>待分配<span style={{ color: 'red' }}>{this.getRemainQty(item.id)}</span></div> : null}
                </Col>
                <Col span={5}>
                  <FormItem
                    form={form}
                    keyName={getKeyName(item.id, isCheckIn ? 'useQty' : 'unitQty', keyName)}
                    rules={rules}
                    detailDefault={gresDetails}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      step={1}
                      precision={0}
                      disabled={item.disabled || !operate[1]}
                    />
                  </FormItem>
                </Col>
                {isCheckIn ? (
                  <Col style={{ display: 'none' }}>
                    <FormItem
                      form={form}
                      keyName={getKeyName(item.id, 'unitQty', keyName)}
                      initialValue={_.get(gresDetails, getKeyName(item.id, 'unitQty', keyName)) || 0}
                    >
                      <Input disabled />
                    </FormItem>
                  </Col>
) : null}
                <Col span={2}>
                  <Icon style={{ marginTop: 13 }} type="close" />
                </Col>
                <Col span={6}>
                  <FormItem
                    form={form}
                    keyName={getKeyName(item.id, 'salePriceFormat', keyName)}
                    rules={[{ required: true, message: '不能为空' }]}
                    detailDefault={gresDetails}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={0.01}
                      precision={2}
                      formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      disabled={item.disabled || !operate[1]}
                    />
                  </FormItem>
                </Col>
                {(item.disabled || !operate[2]) ? null : (
                  <Col span={2}>
                    <Popconfirm
                      placement="top"
                      title="是否删除当前套餐服务？"
                      onConfirm={() => this.handleDeleteItem(index)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button style={{ marginTop: 9 }} size="small" shape="circle" icon="close" />
                    </Popconfirm>
                  </Col>
              )}
              </Row>
          );
})
        }
        {(disabled || !operate[0]) ? null : (
          <Button onClick={() => this.handleAddItem()} size="small">
            <Icon type="plus-circle" />
            添加服务
          </Button>
        )}
      </div>
    );
  }
}
