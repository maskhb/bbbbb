import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Checkbox, DatePicker } from 'antd';

const CheckboxGroup = Checkbox.Group;

@Form.create()
@connect(({ houseStatus }) => ({
  houseStatus,
}))
class WakeUpModal extends PureComponent {
  state = {
    // 日期组件样式 -- 用于解决showTime=true时，日期控件宽度不自动缩放的bug
    rangePickerStyle: {
      style: {
        width: '100%',
      },
    },
  }

  componentDidMount() {
    const { dispatch, roomId } = this.props;
    if (roomId > 0) {
      dispatch({
        type: 'houseStatus/getWakeDetail',
        payload: roomId,
      });
    }
  }

  getRoomOptions(list) {
    const roomList = [];
    if (list) {
      list.map((v) => {
        roomList.push({ label: v?.roomNo, value: v?.roomId });
        return '';
      });
    }
    return roomList;
  }

  render() {
    const { visible, onCancel, onOk, wakeType, form, houseStatus } = this.props;
    const { getWakeDetail } = houseStatus || {};
    const { rangePickerStyle } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    const roomOptions = this.getRoomOptions(getWakeDetail);
    return (
      <Modal
        visible={visible}
        title={wakeType === 'add' ? '新增叫醒' : '取消叫醒'}
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form>
          <Form.Item label={wakeType === 'add' ? '叫醒房间' : '取消房间'} {...formItemLayout}>
            {form.getFieldDecorator('roomIdList', {
              rules: [
                { required: true, message: '请选择叫醒房间' },
              ],
            })(
              <CheckboxGroup options={roomOptions} />
            )}
          </Form.Item>
          {
            wakeType === 'add' ? (
              <Form.Item label="叫醒时间" {...formItemLayout}>
                {form.getFieldDecorator('wakeTime', {
                  rules: [
                    { required: true, message: '请选择叫醒时间' },
                  ],
                })(
                  <DatePicker
                    {...rangePickerStyle}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择叫醒时间"
                  />
                )}
              </Form.Item>
            ) : ''
          }

        </Form>
      </Modal>
    );
  }
}

export default WakeUpModal;
