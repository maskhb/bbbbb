import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Select, DatePicker, Spin } from 'antd';
import moment from 'moment/moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { handleTime, goTo } from 'utils/utils';
import WeekdayCheck from './WeekdayCheck';
import PriceTable from './PriceTable';

const FormItem = Form.Item;
@Form.create()

@connect(({ housing }) => ({
  housing,
}))
export default class List extends PureComponent {
  static calTwoMonth(time) { // 计算两个月后的时间戳
    const arr = [0, 2, 4, 6, 7, 9, 11];
    const date = new Date(time);
    const month = date.getMonth();
    const dayCount = (arr.indexOf(month) >= 0 ? 31 : 30) + (arr.indexOf(month + 1) >= 0 ? 31 : 30);
    return (handleTime(1, date) + (dayCount * 24 * 3600 * 1000)) - 1;
  }
  static defaultProps = {};
  state = {
    rateCodeList: [],
    roomTypeList: [],
    currentRateCodeId: 0,
    currentRoomTypeId: 0,
    currentRateCodeName: '',
    currentRoomTypeName: '',
    loading: false,
  };

  componentDidMount() {
    const that = this;
    const { match: { params: { viewType, id, name, beginDate } }, form } = this.props;
    const priceParam = {
      beginDate: new Date(Number(beginDate)).getTime(),
      endDate: List.calTwoMonth(Number(beginDate)),
      viewType,
    };
    form.setFieldsValue({
      beginDate: moment(Number(beginDate)),
      endDate: moment(List.calTwoMonth(Number(beginDate))),
    });
    if (Number(viewType) === 1) {
      const rateCodeList = JSON.parse(localStorage.rateCodeList);
      priceParam.rateCodeId = id ? Number(id) : rateCodeList?.[0]?.rateCodeId;
      that.setState({
        currentRateCodeId: id ? Number(id) : rateCodeList?.[0]?.rateCodeId,
        currentRateCodeName: name || rateCodeList?.[0]?.rateCodeName,
        rateCodeList: rateCodeList || [],
      });
      if (id) {
        form.setFieldsValue({
          rateCodeId: Number(id),
        });
      } else {
        form.setFieldsValue({
          rateCodeId: rateCodeList?.[0]?.rateCodeId,
        });
      }
    } else {
      const roomTypeList = JSON.parse(localStorage.roomTypeList);
      priceParam.roomTypeId = id ? Number(id) : roomTypeList?.[0]?.roomTypeId;
      that.setState({
        currentRoomTypeId: id ? Number(id) : roomTypeList?.[0]?.roomTypeId,
        currentRoomTypeName: name || roomTypeList?.[0]?.roomTypeName,
        roomTypeList: roomTypeList || [],
      });
      if (id) {
        form.setFieldsValue({
          roomTypeId: Number(id),
        });
      } else {
        form.setFieldsValue({
          roomTypeId: roomTypeList?.[0]?.roomTypeId,
        });
      }
    }
  }
  handleSelectChange(label, value, e) {
    this.setState({
      [`${label}Id`]: value,
      [`${label}Name`]: e.props.children,
    });
  }
  saveForm() {
    const that = this;
    const { dispatch, form, match: { params: { viewType } } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const beginDate = handleTime(1, values.beginDate);
        const endDate = handleTime(2, values.endDate);
        if (beginDate < handleTime(1, new Date())) {
          Modal.error({
            title: '提示',
            content: '开始日期不能早于当前日期',
          });
          return false;
        }
        if (beginDate < endDate) {
          const params = Object.assign({}, values);
          params.beginDate = beginDate;
          params.endDate = endDate;
          if (Number(viewType) === 1) {
            if (!params.priceSetting) {
              params.priceSetting = {
                roomTypeAndPriceList: JSON.parse(localStorage.roomTypeList)?.map((v) => {
                  return {
                    oldPrice: 0,
                    price: 0,
                    roomTypeId: v.roomTypeId,
                    roomTypeName: v.roomTypeName,
                    submitPrice: -1,
                  };
                }) };
            }
            params.roomTypeAndPriceList = params.priceSetting?.roomTypeAndPriceList?.map((v) => {
              return {
                price: v.submitPrice,
                roomTypeId: v.roomTypeId,
              };
            });
          } else if (Number(viewType) === 2) {
            if (!params.priceSetting) {
              params.priceSetting = {
                rateCodeAndPriceList: JSON.parse(localStorage.rateCodeList)?.map((v) => {
                  return {
                    oldPrice: 0,
                    price: 0,
                    rateCodeId: v.rateCodeId,
                    rateCodeName: v.rateCodeName,
                    submitPrice: -1,
                  };
                }) };
            }
            params.rateCodeAndPriceList = params.priceSetting?.rateCodeAndPriceList?.map((v) => {
              return {
                price: v.submitPrice,
                rateCodeId: v.rateCodeId,
              };
            });
          }
          delete params.priceSetting;
          this.setState({
            loading: true,
          });
          dispatch({
            type: 'housing/add',
            payload: {
              roomRateSaveOrUpdateVO: params,
            },
          }).then(() => {
            const result = that.props.housing.add;
            if (result && typeof result === 'boolean') {
              that.setState({
                loading: true,
              });
              Modal.success({
                title: '提示',
                content: '设置房价成功！',
                onOk() {
                  goTo('/channel/housing');
                },
              });
            }
          });
        } else {
          Modal.error({
            title: '提示',
            content: '结束日期必须大于开始日期',
          });
        }
      }
    });
  }
  render() {
    const { match: { params: { viewType } }, form } = this.props;
    const { loading } = this.state;
    const { rateCodeList, roomTypeList, currentRateCodeId, currentRoomTypeId,
      currentRateCodeName, currentRoomTypeName } = this.state;
    const { getFieldDecorator } = form;
    const formData = form.getFieldsValue();
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <PageHeaderLayout>
        <Spin spinning={loading}>
          <Form>
            <Card title="基本信息">
              {
                Number(viewType) === 1 ? (
                  <FormItem
                    {...formItemLayout}
                    label="价格代码"
                  >
                    {getFieldDecorator('rateCodeId', {
                      rules: [
                        { required: true, message: '请选择价格代码' },
                      ],
                    })(
                      <Select
                        onChange={this.handleSelectChange.bind(this, 'currentRateCode')}
                      >
                        {rateCodeList.map(v => (
                          <Select.Option
                            key={v.rateCodeId}
                            value={v.rateCodeId}
                          >{v.rateCodeName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label="房型"
                  >
                    {getFieldDecorator('roomTypeId', {
                      rules: [
                        { required: true, message: '请选择房型' },
                      ],
                    })(
                      <Select
                        onChange={this.handleSelectChange.bind(this, 'currentRoomType')}
                      >
                        {roomTypeList.map(v => (
                          <Select.Option
                            key={v.roomTypeId}
                            value={v.roomTypeId}
                          >{v.roomTypeName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                )
              }
              <FormItem
                {...formItemLayout}
                label="开始日期"
              >
                {getFieldDecorator('beginDate', {
                  rules: [
                    { required: true, message: '请选择开始时间' },
                  ],
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="结束日期"
              >
                {getFieldDecorator('endDate', {
                  rules: [
                    { required: true, message: '请选择结束时间' },
                  ],
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="包含星期"
              >
                {getFieldDecorator('weekMask', {
                  rules: [
                    { required: true, message: '请选择包含星期' },
                  ],
                })(
                  <WeekdayCheck />
                )}
              </FormItem>
            </Card>
            <Card title="房价设置" style={{ marginTop: 30 }}>
              <FormItem
                {...formItemLayout}
                label="房价设置"
              >
                {getFieldDecorator('priceSetting', {
                  rules: [],
                })(
                  <PriceTable
                    viewType={Number(viewType)}
                    rateCodeName={currentRateCodeName}
                    roomTypeName={currentRoomTypeName}
                    rateCodeId={currentRateCodeId}
                    roomTypeId={currentRoomTypeId}
                    startTime={new Date(formData.beginDate).getTime()}
                  />
                )}
              </FormItem>
            </Card>
          </Form>
          <Button type="primary" style={{ marginTop: 20 }} onClick={this.saveForm.bind(this)}>保存</Button>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
