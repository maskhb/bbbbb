import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, DatePicker } from 'antd';
import { MonitorTextArea } from 'components/input';
import { repairTypeOptions } from 'utils/attr/repair';
import moment from 'moment';

const SelectOption = Select.Option;

@Form.create()
@connect(({ houseStatus }) => ({
  houseStatus,
}))
class RepairModal extends PureComponent {
  state = {
    // 日期组件样式 -- 用于解决showTime=true时，日期控件宽度不自动缩放的bug
    rangePickerStyle: {
      style: {
        width: '100%',
      },
    },
  };

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
    const { visible, repairType, room, onCancel, onOk, form, houseStatus } = this.props;
    const { repairDetail } = houseStatus || {};
    const { rangePickerStyle } = this.state;
    // const { goOpenExchangeOrder } = aftersale;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    return (
      <Modal
        visible={visible}
        title="房间维修"
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form>
          <Form.Item label="维修类型" {...formItemLayout}>
            {form.getFieldDecorator('type', {
              initialValue: repairType !== 'add' ? (repairDetail?.type) : '',
              rules: [
                { required: true, message: '请选择维修类型' },
              ],
            })(
              this.getSearchOptionsElm(repairTypeOptions)
            )}
          </Form.Item>
          <Form.Item label="维修内容" {...formItemLayout}>
            {form.getFieldDecorator('content', {
              initialValue: repairType !== 'add' ? (repairDetail?.content) : '',
              rules: [
                { required: true, message: '请输入维修内容' },
              ],
            })(
              <MonitorTextArea placeholder="请输入维修内容" datakey="content" rows={4} maxLength={50} form={form} />
            )}
          </Form.Item>
          <Form.Item label="开始时间" {...formItemLayout}>
            {form.getFieldDecorator('startTime', {
              initialValue: moment(room?.startTime),
              rules: [
                { required: true, message: '请选择开始时间' },
                {
                  validator(rule, value, callback) {
                    const startTime = moment(value).valueOf();
                    const nowTime = new Date().getTime();
                    if (repairType !== 'add' || startTime > nowTime) {
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
                disabled={repairType !== 'add' && repairDetail?.startTime < new Date().getTime()}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始时间"
              />
            )}
          </Form.Item>
          <Form.Item label="结束时间" {...formItemLayout}>
            {form.getFieldDecorator('endTime', {
              initialValue: repairType !== 'add' ? moment(repairDetail?.endTime) : null,
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
        </Form>
      </Modal>
    );
  }
}

export default RepairModal;
