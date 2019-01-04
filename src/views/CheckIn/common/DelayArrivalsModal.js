import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, message, Modal } from 'antd';
import ModalCover from './ModalCover';
import moment from 'moment';

@Form.create()
export default class DelayArrivalsModal extends React.Component {
  static propTypes = {
    departureDate: PropTypes.number, // 延期日期
    arrivalDate: PropTypes.number, // 延期日期
    gresId: PropTypes.number, // 单号
    dispatch: PropTypes.func.isRequired, // dispatch
  };

  static defaultProps = {
  };

  state = {
    newArrivalDate: 0,
    newDepartureDate: 0,
  };

  // 验证表单
  validDelayArrivalsForm = async () => {
    const { form } = this.props;
    return new Promise((resolve) => {
      form?.validateFields((err, values) => {
        if (!err) {
          resolve(values);
        }
      });
    });
  }

  // 发送请求
  handleDelayArrivals = async () => {
    const { dispatch, gresId } = this.props;

    return new Promise((resolve) => {
      this.validDelayArrivalsForm()
        .then((res) => {
          const [arrivalDate, departureDate] = res.rangePicker;
          const mc = Modal.confirm({
            title:'所有已预留房间将被清空',
            iconType:'warning',
            okText:"确定",
            cancelText:"取消",
            onOk:(e)=>{
              dispatch({
                type: 'checkIn/gresDelayArrivals',
                payload: {
                  gresId,
                  arrivalDate: arrivalDate.startOf('day').valueOf(),
                  departureDate: departureDate.endOf('day').valueOf(),
                },
              }).then((res) => {
                if (res) {
                  message.success('延到成功');
                  resolve();
                }
                mc.destroy();
              });
            }
          })
        })
    });
  }

  renderForm() {
    const { form, arrivalDate, departureDate } = this.props;
    let disabledDate = null;
    return (
      <Form layout="inline">
        <Form.Item label="入离店日期">
          {form.getFieldDecorator('rangePicker', {
                initialValue: [moment(arrivalDate), moment(departureDate)],
                rules: [{ type: 'array', required: true, message: '需要选择入离店日期' },
                { validator: (rule, value, callback)=>{
                  if(value[0].format('YYYYMMDD') == value[1].format('YYYYMMDD')){
                    callback("入店日期不允许等于离店日期")
                  }
                  callback()
                }}],
              })(
                <DatePicker.RangePicker
                  allowClear={false}
                  disabledDate={current => { 
                    return current < moment().startOf('day')
                  }}
                />
            )}
        </Form.Item>
      </Form>);
  }

  render() {
    return (
      <ModalCover
        title="延到"
        content={this.renderForm()}
        onOk={this.handleDelayArrivals.bind(this)}
      >
        {modalShow => <a href="#" onClick={(e) => { e.preventDefault(); modalShow(); }} > 延到 </a> }
      </ModalCover>
    );
  }
}
