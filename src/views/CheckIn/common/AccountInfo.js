import _ from 'lodash';
import React from 'react';
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Cascader,
  Select,
  Spin,
  InputNumber,
  Modal,
  Row,
  Col,
  Radio,
  message,
} from 'antd';
import { recalAccountInfo, transformAccountVOToAccountInfo } from 'viewmodels/GresDetailVO';
import '../index.less';
import FormItem from './FormItem';

const RadioGroup = Radio.Group;

const ElRequired = () => <span style={{ color: 'red', lineHeight: '40px', marginRight: 5 }}>*</span>;
let num = 0;

export default class AccountInfo extends React.Component {
  state = {
    visible: false,
    value: '',
    record: {},
  }

  componentWillMount() {
    const { dispatch, accTypeMap } = this.props;
    num = 0;
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
          status: 0,
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
    return roomList;
  }

  getFeeType = () => {
    const roomList = this.getRoomList();
    const { checkIn: { paymentItemPage }, isCheckIn } = this.props;
    if (!roomList.length && !isCheckIn) return [];

    return _.map(paymentItemPage?.dataList, paymentItem =>
      ({
        value: paymentItem.paymentItemId,
        label: paymentItem.paymentItemName,
        children: isCheckIn ? null : _.map(roomList, item => ({
          value: item.roomId,
          label: item.buildingRoomNo,
        })),
      }));
  }

  getPayMethodName = (paymentMethodId) => {
    const { checkIn: { paymentMethodAll } } = this.props;
    return _.find(paymentMethodAll?.dataList, item =>
      item.paymentMethodId === paymentMethodId)?.paymentMethodName;
  }

  handleOk = (accId, { accType }) => {
    const { form } = this.props;
    form.validateFields([`accountInfo${accId}`], (errors, values) => {
      if (!errors) {
        const v = values[`accountInfo${accId}`];

        const {
          checkIn: { gresDetails = {}, paymentItemPage, paymentMethodPage },
          dispatch, receiptTypeMap, isCheckIn,
        } = this.props;

        let itemName = '';
        let formValues = {};
        if (accType === 1) {
          formValues = { ...v, itemId: v.itemId[0], roomId: v.itemId[1] };
          itemName = _.find(paymentItemPage?.dataList, item =>
            item.paymentItemId === formValues.itemId)?.paymentItemName;
        } else if (accType === 2) {
          formValues = { ...v, itemId: v.itemId[0] };
          itemName = receiptTypeMap.get(formValues.itemId);
        } else {
          formValues = { ...v, itemId: 0 };
        }

        gresDetails.setAccountInfo(transformAccountVOToAccountInfo(
          gresDetails?.accountInfo || [], {
            accType,
            ...formValues,
            buildingRoomNo: formValues.roomId ? _.find(this.getRoomList(), item => item.roomId === formValues.roomId)?.buildingRoomNo : '',
            itemName,
            roomId: isCheckIn ? gresDetails?.roomId : formValues.roomId,
            roomNo: isCheckIn ? gresDetails?.roomNo : formValues.roomNo,
            isDone: true,
            accId,
            paymentMethodName: _.find(paymentMethodPage?.dataList, item =>
              item.paymentMethodId === formValues.paymentMethodId)?.paymentMethodName,
          }
        ));

        dispatch({
          type: 'checkIn/save',
          payload: {
            gresDetails,
          },
        });
      }
    });
  }

  handleCancel = (record) => {
    const { checkIn: { gresDetails = {} }, dispatch } = this.props;
    const curAccIndex = _.findIndex(gresDetails?.accountInfo, (item) => {
      return item.accType === record.accType;
    });

    const accountIndex = _.findIndex(gresDetails?.accountInfo[curAccIndex].accountDetails, item =>
      item.accId === record.accId);

    gresDetails?.accountInfo[curAccIndex]?.accountDetails?.splice(accountIndex, 1);
    gresDetails.setAccountInfo(recalAccountInfo(gresDetails?.accountInfo));

    dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
  }

  handleTransferOut = (accId, record) => {
    const { dispatch, checkIn: { gresDetails } } = this.props;

    dispatch({
      type: 'checkIn/preTransfer',
      payload: {
        gresId: gresDetails.gresId,
      },
    });

    this.setState({ visible: true, record });
  }

  columns = () => {
    const {
      receiptTypeMap,
      checkIn: { paymentMethodPage }, loading,
      form,
      gresType,
      resType,
    } = this.props;

    return [{
      title: '账务类型',
      dataIndex: 'accTypeFormat',
      width: 250,
      render: (val, record) => {
        const options = record.accType === 1 ? this.getFeeType()
          : _.map(Array.from(receiptTypeMap, (item) => {
            return {
              value: item[0],
              label: item[1],
            };
          }));

        const placeholder = record.accType === 1 ? '请选择费用类型' : '请选择收款项目';
        return (record.children || record.accType === 3 || record.isDone) ? val : (
          <div
            style={{ width: '70%', display: 'inline-block' }}
          >
            <ElRequired />
            <FormItem
              form={form}
              keyName={`accountInfo${record.accId}.itemId`}
              rules={[{ required: true, message: placeholder }]}
              style={{ width: '90%', display: 'inline-block' }}
            >
              <Cascader
                options={options}
                placeholder={placeholder}
                allowClear={false}
                style={{ width: '100%' }}
              />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '金额',
      dataIndex: 'rateFormat',
      render: (val, record) => {
        return (record.children || record.isDone) ? val : (
          <div
            style={{ width: '80%', display: 'inline-block' }}
          >
            <ElRequired />
            <FormItem
              form={form}
              keyName={`accountInfo${record.accId}.rateFormat`}
              rules={[{ required: true, message: '请输入金额' }]}
              style={{ width: '80%', display: 'inline-block' }}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
              />
            </FormItem>
          </div>

        );
      },
    }, {
      title: '营业日',
      dataIndex: 'businessDayFormat',
    }, {
      title: '发生日期',
      dataIndex: 'accountDateFormat',
    }, {
      title: '付款方式',
      dataIndex: 'paymentMethodName',
      render: (val, record) => {
        return (record.children || record.isDone || record.accType === 1) ? (
          val || this.getPayMethodName(record.paymentMethodId)
        ) : (
          <div
            style={{ width: '80%', display: 'inline-block' }}
          >
            <ElRequired />
            <FormItem
              form={form}
              keyName={`accountInfo${record.accId}.paymentMethodId`}
              rules={[{ required: true, message: '请选择付款方式' }]}
              style={{ width: '80%', display: 'inline-block' }}
            >
              <Select
                style={{ minWidth: 100 }}
                notFoundContent={loading.effects['checkIn/paymentMethodPage'] ? <Spin size="small" /> : null}
                placeholder="付款方式"
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
          </div>
        );
      },
    }, {
      title: '单据号',
      dataIndex: 'accountNo',
      render: (val, record) => {
        if (record.children || record.isDone) {
          return val;
        }

        const payType = form.getFieldValue(`accountInfo${record.accId}.paymentMethodId`);
        const curPayment = _.find(paymentMethodPage?.dataList, item =>
          item.paymentMethodId === Number(payType));

        const isNotRequired = (curPayment?.paymentMethodName === '现金' || record.accType === 1);

        return (
          <div
            style={{ width: '80%', display: 'inline-block' }}
          >
            {isNotRequired || <ElRequired />}
            <FormItem
              form={form}
              keyName={`accountInfo${record.accId}.accountNo`}
              rules={isNotRequired ? [] : [{ required: true, message: '请输入单据号' }]}
              style={{ width: '80%', display: 'inline-block' }}
            >
              <Input placeholder="单据号" />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '收银员',
      dataIndex: 'userName',
    }, {
      title: '备注',
      dataIndex: 'memo',
      render: (val, record) => {
        return (record.children || record.isDone) ? val : (
          <FormItem
            form={form}
            keyName={`accountInfo${record.accId}.memo`}
          >
            <Input />
          </FormItem>
        );
      },
    }, {
      title: '操作',
      dataIndex: '',
      render: (val, record, index) => {
        const showTransferOutBtn = (record.isDone === 'detail' && resType === 1 && gresType === 1);
        return record.children ? (
          <div>
            <Button className="link-button" onClick={this.handleAdd.bind(this, index, record)}>添加</Button>
          </div>
        ) : (
          <div>
            {record.isDone ? null : (
              <Button
                className="link-button"
                style={{ marginRight: 20 }}
                onClick={this.handleOk.bind(this, record.accId, record, index)}
              >保存
              </Button>
            )}
            {showTransferOutBtn ? (
              <Button
                className="link-button"
                style={{ marginRight: 20 }}
                onClick={this.handleTransferOut.bind(this, record.accId, record, index)}
              >转出
              </Button>
            ) : null}
            <Popconfirm
              placement="top"
              title="是否确定删除？"
              onConfirm={this.handleCancel.bind(this, record)}
              okText="确认"
              cancelText="取消"
            >
              <Button className="link-button">删除</Button>
            </Popconfirm>
          </div>
        );
      },
    }];
  }

  handleAdd = (index, record) => {
    const { dispatch, checkIn: { gresDetails }, isCheckIn } = this.props;

    const roomList = this.getRoomList();
    if (roomList.length === 0 && record.accType === 1 && !isCheckIn) {
      return message.warn('相关费用请在入住后登记');
    }

    num += 1;
    gresDetails.setAccountInfo(transformAccountVOToAccountInfo(
      gresDetails.accountInfo,
      {
        ..._.pick(record, ['accType']),
        accId: num,
      })
    );
    dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
  }

  handleTranferOk = async () => {
    const { dispatch, checkIn: { gresDetails } } = this.props;
    const { value, record } = this.state;

    if (!value) {
      return message.error('请选择一个房间');
    }

    const resp = await dispatch({
      type: 'checkIn/transferAccount',
      payload: {
        sourceGresId: gresDetails.gresId,
        targetGresId: value,
        gresAccountId: record?.gresAccountId,
      },
    });

    if (resp) {
      this.handleTranferCancel();
      message.success('转出成功');
      this.setState({ value: '' });
      this.handleCancel(record);
    }
  }

  handleTranferCancel = () => {
    this.setState({ visible: false, value: '' });
  }

  handleChangeGres = (e) => {
    this.setState({ value: e.target.value });
  }

  render() {
    const { checkIn: { gresDetails = {}, preTransfer = [] }, style, loading } = this.props;
    return (
      <div
        style={{ ...style, marginTop: 10 }}
      >
        {gresDetails?.accountInfo?.length && (
          <Table
            className="tanant-info"
            columns={this.columns()}
            dataSource={gresDetails?.accountInfo}
            rowKey="accId"
            pagination={false}
            defaultExpandAllRows
          />
        )}
        <Modal
          title="转出账务"
          visible={this.state.visible}
          onOk={this.handleTranferOk}
          onCancel={this.handleTranferCancel}
        >
          <Row>
            <Col span={6}>房间：</Col>
            <Col span={18}>
              <Spin spinning={loading.effects['checkIn/preTransfer']}>
                <RadioGroup onChange={this.handleChangeGres} value={this.state.value}>
                  {_.map(preTransfer, item => <Radio value={item.gresId} key={item.gresId}>{item.roomName}</Radio>)}
                </RadioGroup>
              </Spin>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
