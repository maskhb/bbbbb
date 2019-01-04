import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, DatePicker, Input, Checkbox } from 'antd';
import { IDTypeOptions } from 'utils/attr/repair';
import moment from 'moment';

const SelectOption = Select.Option;

@Form.create()
@connect(({ houseStatus }) => ({
  houseStatus,
}))
class RetentionModal extends PureComponent {
  state = {
    // 日期组件样式 -- 用于解决showTime=true时，日期控件宽度不自动缩放的bug
    rangePickerStyle: {
      style: {
        width: '100%',
      },
    },
  }

  componentDidMount() {
    // const { dispatch, unionMerchantId } = this.props;
    //
    // dispatch({
    //   type: 'business/queryList',
    //   payload: {
    //     unionMerchantId,
    //   },
    // });
  }

  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (options = [], isMore = false, placeholder = '请选择', disabled = false) => {
    const params = isMore ? {
      mode: 'multiple',
      disabled,
    } : { disabled };

    return (
      <Select allowClear placeholder={placeholder} {...params}>
        {
          options.map((item) => {
            return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
          })
        }
      </Select>
    );
  }

  render() {
    const { visible, retentionType, room, onCancel, onOk, form, houseStatus } = this.props;
    const { retentionDetail } = houseStatus || {};
    const { rangePickerStyle } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
      },
    };
    return (
      <Modal
        visible={visible}
        title="房间自留"
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form>
          <Form.Item label="开始时间" {...formItemLayout}>
            {form.getFieldDecorator('startTime', {
              initialValue: moment(room?.startTime),
              rules: [
                { required: true, message: '请选择开始时间' },
                {
                  validator(rule, value, callback) {
                    const startTime = moment(value).valueOf();
                    const nowTime = new Date().getTime();
                    if (retentionType !== 'add' || startTime > nowTime) {
                      callback();
                    } else {
                      callback('开始时间不能早于当前时间！');
                    }
                  },
                },
              ],
            })(
              <DatePicker
                {...rangePickerStyle}
                disabled={retentionType !== 'add' && retentionDetail?.startTime < new Date().getTime()}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始时间"
              />
            )}
          </Form.Item>
          <Form.Item label="结束时间" {...formItemLayout}>
            {form.getFieldDecorator('endTime', {
              initialValue: retentionType !== 'add' ? moment(retentionDetail?.endTime) : null,
              rules: [
                { required: true, message: '请选择结束时间' },
                {
                  validator(rule, value, callback) {
                    let startTime = '';
                    const startTimeVal = form.getFieldValue('startTime');
                    if (startTimeVal) {
                      startTime = moment(startTimeVal).valueOf();
                    }
                    const endTime = moment(value).valueOf();
                    const nowTime = new Date().getTime();
                    if (endTime > nowTime) {
                      if (startTime) {
                        if (startTime < endTime) {
                          callback();
                        } else {
                          callback('结束时间不能早于开始时间！');
                        }
                      } else {
                        callback();
                      }
                    } else {
                      callback('结束时间不能早于当前时间！');
                    }
                  },
                },
              ],
            })(
              <DatePicker
                {...rangePickerStyle}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
              />
            )}
          </Form.Item>
          <Form.Item label="自留用途" {...formItemLayout}>
            {form.getFieldDecorator('remark', {
              initialValue: retentionType !== 'add' ? retentionDetail?.remark : '',
              rules: [
                { required: true, message: '请输入自留用途' },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="设置脏房" {...formItemLayout}>
            {form.getFieldDecorator('isSetDirtyRoom', {
              valuePropName: 'checked',
              initialValue: retentionType !== 'add' ? (!!retentionDetail?.isSetDirtyRoom) : true,
            })(
              <Checkbox>自留结束后设置为脏房</Checkbox>,
            )}
          </Form.Item>
          <Form.Item label="客户姓名" {...formItemLayout}>
            {form.getFieldDecorator('guestName', {
              initialValue: retentionType !== 'add' ? retentionDetail?.guestName : '',
              rules: [
                { message: '请输入姓名' },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="证件类型" {...formItemLayout}>
            {form.getFieldDecorator('docType', {
              initialValue: retentionType !== 'add' ? retentionDetail?.docType : '',
            })(
              this.getSearchOptionsElm(IDTypeOptions)
            )}
          </Form.Item>
          <Form.Item label="证件号码" {...formItemLayout}>
            {form.getFieldDecorator('docNo', {
              initialValue: retentionType !== 'add' ? retentionDetail?.docNo : '',
              rules: [
                { message: '请输入证件号码' },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="联系电话" {...formItemLayout}>
            {form.getFieldDecorator('phone', {
              initialValue: retentionType !== 'add' ? retentionDetail?.phone : '',
              rules: [
                { message: '请输入客户电话' },
                // {
                //   pattern: /^1\d{10}$/,
                //   message: '请输入11位数字',
                // },
              ],
            })(
              <Input />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default RetentionModal;
