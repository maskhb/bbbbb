import React from 'react';
import _ from 'lodash';
import { Modal, Button, Radio, Form, InputNumber, Input, Select, Spin } from 'antd';
import { MonitorTextArea } from 'components/input';
import { payTypeMap, transformAccountVOToAccountInfo } from 'viewmodels/GresDetailVO';
import FormItem from './FormItem';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
export default class AddAccountModal extends React.Component {
  static defaultProps = {
    defaultAccType: 0, // 默认进来是预付款，但其实有可能是退款啥的
  }

  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, accTypeMap } = this.props;

    if (accTypeMap.get(1)) {
      dispatch({
        type: 'checkIn/paymentItemPage',
        payload: {
          paymentItemQueryVO: {
            status: 1,
            currPage: 1,
            pageSize: 9999,
          },
        },
      });
    }

    dispatch({
      type: 'checkIn/paymentMethodPage',
      payload: {
        paymentMethodQueryVO: {
          currPage: 1,
          pageSize: 9999,
          status: 1,
        },
      },
    });
  }

  getRoomList = () => {
    const { checkIn: { gresDetails } } = this.props;

    let roomList = [];
    _.forEach(gresDetails?.roomBookingTotalVOs, (item) => {
      roomList = roomList.concat(_.filter(item?.list, (roomItem) => {
        return roomItem.gresStatus === 'I';
      }));
    });

    // 如果有关联房间，那么也可以为关联房间增加费用
    return roomList;
  }

  modalShow = () => {
    this.setState({ modalVisible: true });
  }

  modalCancel = () => {
    this.setState({ modalVisible: false });
  }

  modalOk = async () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { checkIn: { gresDetails = {}, paymentItemPage },
          dispatch, receiptTypeMap, form, curItem, isCheckIn } = this.props;
        let itemName = '';
        const accType = form.getFieldValue('accType') === undefined ? curItem?.accType : form.getFieldValue('accType');
        if (accType === 1) {
          itemName = _.find(paymentItemPage?.dataList, item =>
            item.paymentItemId === values.itemId)?.paymentItemName;
        } else if (accType === 2) {
          itemName = receiptTypeMap.get(values.itemId);
        }

        gresDetails.setAccountInfo(transformAccountVOToAccountInfo(
          gresDetails?.accountInfo || [], {
            ...values,
            buildingRoomNo: values.roomId ? _.find(this.getRoomList(), item => item.roomId === values.roomId)?.buildingRoomNo : '',
            itemName,
            roomId: isCheckIn ? gresDetails?.roomId : values.roomId,
            roomNo: isCheckIn ? gresDetails?.roomNo : values.roomNo,
            // roomDescription
          }
        ));

        dispatch({
          type: 'checkIn/save',
          payload: {
            gresDetails,
          },
        });

        this.modalCancel();
      }
    });
  }

  render() {
    const {
      children, accTypeMap, form, curItem = {}, receiptTypeMap,
      checkIn: { paymentItemPage, paymentMethodPage },
      isCheckIn, loading,
    } = this.props;
    const { modalVisible } = this.state;

    const accType = form.getFieldValue('accType') === undefined ? curItem.accType : form.getFieldValue('accType');
    const payType = form.getFieldValue('paymentMethodId') === undefined ? curItem.paymentMethodId : form.getFieldValue('paymentMethodId');

    const curPayment = _.find(paymentMethodPage?.dataList, item =>
      item.paymentMethodId === Number(payType));

    return (
      <span>
        <Button className="link-button" onClick={this.modalShow}>{children}</Button>
        <Modal
          visible={modalVisible}
          onCancel={this.modalCancel}
          onOk={this.modalOk}
          title="增加账务"
          destroyOnClose
        >
          <Form>
            <FormItem
              {...formItemLayout}
              form={form}
              detailDefault={curItem}
              label="账务类型："
              keyName="accType"
            >
              <Radio.Group>
                {
                  _.map(Array.from(accTypeMap), item =>
                    <Radio value={item[0]} key={item[0]}>{item[1]}</Radio>)
                }
              </Radio.Group>
            </FormItem>

            {(!isCheckIn && accType === 1) && (
              <FormItem
                {...formItemLayout}
                form={form}
                detailDefault={curItem}
                label="所属房间："
                keyName="roomId"
                rules={[{ required: true, message: '请选择所属房间' }]}
              >
                <Select>
                  {
                    this.getRoomList(isCheckIn)?.map(item => (
                      <Select.Option value={item.roomId} key={item.roomId}>
                        {item.buildingRoomNo}
                      </Select.Option>))
                  }
                </Select>
              </FormItem>
            )}
            {accType === 1 && (
              <FormItem
                {...formItemLayout}
                form={form}
                detailDefault={curItem}
                label="费用类型："
                keyName="itemId"
                rules={[{ required: true, message: '请选择费用类型' }]}
              >
                <Radio.Group>
                  {
                    _.map(paymentItemPage?.dataList, item => (
                      <Radio value={item.paymentItemId} key={item.paymentItemId}>
                        {item.paymentItemName}
                      </Radio>))
                  }
                </Radio.Group>
              </FormItem>
            )}
            {accType === 2 && (
              <FormItem
                {...formItemLayout}
                form={form}
                detailDefault={curItem}
                label="收款项目："
                keyName="itemId"
                rules={[{ required: true, message: '请选择收款项目' }]}
              >
                <Radio.Group>
                  {
                    _.map(Array.from(receiptTypeMap), item =>
                      <Radio value={item[0]} key={item[0]}>{item[1]}</Radio>
                    )
                  }
                </Radio.Group>
              </FormItem>
            )}
            <FormItem
              {...formItemLayout}
              form={form}
              detailDefault={curItem}
              label="金额："
              keyName="rateFormat"
              rules={[{ required: true, message: '请输入金额' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
              />
            </FormItem>
            {accType === 1 || (
            <FormItem
              {...formItemLayout}
              form={form}
              detailDefault={curItem}
              label="付款方式："
              keyName="paymentMethodId"
              rules={[{ required: true, message: '请选择付款方式' }]}
            >
              <Select
                notFoundContent={loading.effects['checkIn/paymentMethodPage'] ? <Spin size="small" /> : null}
              >
                {
                  _.map(paymentMethodPage?.dataList, item => (
                    <Select.Option value={item.paymentMethodId} key={item.paymentMethodId}>
                      {item.paymentMethodName}
                    </Select.Option>
))
                }
              </Select>
            </FormItem>
)}
            <FormItem
              {...formItemLayout}
              form={form}
              detailDefault={curItem}
              label="单据号："
              keyName="accountNo"
              // 当付款方式为现金时无需填写；其余付款方式必填
              rules={(curPayment?.paymentMethodName === '现金' || accType === 1) ? [] : [{ required: true, message: '请选择付款方式' }]}
            >
              <Input />
            </FormItem>
            <Form.Item
              label="备注："
              {...formItemLayout}
            >
              {
                form.getFieldDecorator('memo', {
                  initialValue: curItem.memo || '',
                })(
                  <MonitorTextArea
                    placeholder="请输入备注"
                    datakey="memo"
                    rows={5}
                    maxLength={200}
                    form={form}
                  />
                )}
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}
