import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, message } from 'antd';
import ModalCover from './ModalCover';
import moment from 'moment';

@Form.create()
export default class DelayModal extends React.Component {
  static propTypes = {
    departureDate: PropTypes.number, // 延期日期
    gresId: PropTypes.number, // 单号
    dispatch: PropTypes.func.isRequired, // dispatch
  };

  static defaultProps = {
  };

  state = {
    newDepartureDate: 0,
  };

  changeDepartureDatePicker(mom) {
    const { departureDate } = this.props;
    const newDepartureDate = mom.valueOf();
    if (newDepartureDate == departureDate) { return; }
    this.setState({
      newDepartureDate,
    });
  }

  disabledStartDate(endTime) {
    return function (current) {
      return current.valueOf() < endTime.valueOf();
    };
  }

  handleDelay = () => {
    const { dispatch, gresId, departureDate } = this.props;
    const { newDepartureDate } = this.state;

    if (!newDepartureDate) { return; }
    if (newDepartureDate === departureDate) { return; }

    dispatch({
      type: 'checkIn/gresDelay',
      payload: {
        gresId,
        departureDate: newDepartureDate,
      },
    }).then((res) => {
      if (res) {
        message.success('房间延住成功');
        this.props.reload();
      }
    });
  }

  getModalHandler() {
    const { modalHandler } = this.props;
    const defaultModalHandler = modalShow => (
      <a href="#" onClick={(e) => { e.preventDefault(); modalShow(); }}>
        延住
      </a>
    );
    return modalHandler || defaultModalHandler;
  }

  render() {
    const { departureDate } = this.props;

    return (
      <ModalCover
        title="延住"
        content={
          <div>
            离店日期：
            <DatePicker
              allowClear={false}
              defaultValue={moment(departureDate)}
              disabledDate={this.disabledStartDate(moment(departureDate).add(1, 'day'))}
              onChange={this.changeDepartureDatePicker.bind(this)}
            />
          </div>
        }
        onOk={this.handleDelay.bind(this)}
      >
        {this.getModalHandler()}
      </ModalCover>
    );
  }
}
