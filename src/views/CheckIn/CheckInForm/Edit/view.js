import React from 'react';
import _ from 'lodash';
import { Radio, Form, Card, Button, Spin } from 'antd';
import { connect } from 'dva';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import { accTypeMap, receiptTypeMap } from 'viewmodels/GresDetailVO';
import qs from 'qs';
import BasicInfo from './BasicInfo';
import TanantInfo from '../../common/TanantInfo';
import AccountInfo from '../../common/AccountInfo';
import LogList from '../../common/LogList';
import AddComponent from '../../common/AddComponent';
import RoomPrice from '../Add/RoomPrice';

@connect(({ checkIn, loading }) => ({
  checkIn,
  loading,
  detailLoading: loading.effects['checkIn/gresDetails'],
  submitting: loading.effects['checkIn/gresAdd'],
}))
@Form.create()
class view extends AddComponent {
  static defaultProps = {
    gresType: 2,
    resType: 1,
    isCheckIn: true,
    isEdit: true,
    accTypeMap,
    receiptTypeMap,
  };

  constructor(props) {
    super(props);
    const { type } = qs.parse(props.location.search?.replace('?', '')) || {};
    this.state = {
      type: type || 'RoomTypeAndRate',
    };
  }

  async componentDidMount() {
    const { gresId } = this.props.match.params || {};

     await this.props.dispatch({
      type: 'checkIn/gresDetails',
      payload: {
        gresId,
        isCheckIn: true,
      },
    });

    this.init();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/resetDetails',
      payload: {},
    });
  }

  handleChangeRadio=(e) => {
    const { type } = this.state;

    const { value } = e.target;

    if (value !== type) {
      this.setState({
        type: value,
      });
    }
  }

  render() {
    const { type } = this.state;
    const { submitting, form, detailLoading, checkIn: { gresDetails } } = this.props;
    const { rateCodeId, arrivalDepartureDate } = form.getFieldsValue();

    return (
      <PageHeaderLayout>
        <Spin spinning={detailLoading}>
          <BasicInfo {...this.props} />
        </Spin>
        {detailLoading || (
        <Card bordered={false} style={{ minHeight: 500 }}>
          <Radio.Group onChange={this.handleChangeRadio} defaultValue={type}>
            <Radio.Button value="RoomTypeAndRate">房价</Radio.Button>
            <Radio.Button value="TanantInfo">房客信息</Radio.Button>
            <Radio.Button value="AccountInfo">账务信息</Radio.Button>
            <Radio.Button value="LogList">操作日志</Radio.Button>
          </Radio.Group>
          <br />
          <br />
          <RoomPrice
            {...this.props}
            style={{ display: type === 'RoomTypeAndRate' ? '' : 'none' }}
            rateCodeId={rateCodeId}
            arrivalDepartureDate={_.cloneDeep(arrivalDepartureDate)}
            roomId={gresDetails?.roomId}
            isEdit
          />
          <TanantInfo {...this.props} style={{ display: type === 'TanantInfo' ? '' : 'none' }} />

          <div style={{ display: type === 'AccountInfo' ? '' : 'none' }}>
            <AccountInfo
              {...this.props}
            />
          </div>
          <LogList {...this.props} style={{ display: type === 'LogList' ? '' : 'none' }} />
        </Card>
)}
        <FooterToolbar>
          {/* {getErrorInfo()} */}
          <Button type="primary" onClick={_.debounce(this.handleSubmit, 200)} loading={submitting}>
            保存
          </Button>
          <Button onClick={this.goBackList}>取消</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default view;
