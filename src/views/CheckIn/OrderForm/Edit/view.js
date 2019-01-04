import React from 'react';
import { Radio, Form, Card, Button, Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import qs from 'qs';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import { orderEditAccTypeMap, orderEditReceiptTypeMap } from 'viewmodels/GresDetailVO';
import { prePayAccountFormat, returnAccountFormat, calTanantInfoLen } from 'viewmodels/GresDetailResp';
import BasicInfo from '../Add/BasicInfo';
import RoomTypeAndRate from '../../common/RoomTypeAndRate';
import TanantInfo from '../../common/TanantInfo';
import BookRoomList from '../../common/BookRoomList';
import AccountInfo from '../../common/AccountInfo';
import LogList from '../../common/LogList';
import AddComponent from '../../common/AddComponent';

import '../../index.less';

@connect(({ checkIn, loading }) => ({
  checkIn,
  detailLoading: loading.effects['checkIn/gresDetails'],
  submitting: loading.effects['checkIn/gresAdd'],
  loading,
}))
@Form.create()
class view extends AddComponent {
  static defaultProps={
    gresType: 1,
    resType: 1,
    isEdit: true,
    accTypeMap: orderEditAccTypeMap,
    receiptTypeMap: orderEditReceiptTypeMap,
  }

  constructor(props) {
    super(props);
    const { type } = qs.parse(props.location.search?.replace('?', '')) || {};
    this.state = {
      type: type || 'RoomTypeAndRate',
    };
  }

  async componentDidMount() {
    const { gresId } = this.props.match.params || {};
    const response = await this.props.dispatch({
      type: 'checkIn/gresDetails',
      payload: { gresId },
    });


    if (response?.resType === 2) {
      const path = location.href;
      location.replace(path.replace('/orderform/', '/teambooking/'));
    } else {
      this.init();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/resetDetails',
      payload: {},
    });
  }

  handleChangeRadio = (e) => {
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
    const { submitting, form, checkIn: { gresDetails, selectedRoomTypeId },
      detailLoading } = this.props;

    return (
      <PageHeaderLayout>
        <Spin spinning={detailLoading}>
          <BasicInfo {...this.props} disabled={gresDetails?.sourceType === 2} />
        </Spin>

        {detailLoading || (
        <Card bordered={false} style={{ minHeight: 500 }}>
          <Radio.Group onChange={this.handleChangeRadio} defaultValue={type}>
            <Radio.Button value="RoomTypeAndRate">预订房型及房价（{selectedRoomTypeId?.length}）</Radio.Button>
            <Radio.Button value="TanantInfo">房客信息（{calTanantInfoLen(gresDetails?.tanantInfo)}）</Radio.Button>
            <Radio.Button value="BookRoomList">预留房间</Radio.Button>
            <Radio.Button value="AccountInfo">账务信息</Radio.Button>
            <Radio.Button value="LogList">操作日志</Radio.Button>
          </Radio.Group>
          <br />
          <br />
          <div
            style={{ display: type === 'RoomTypeAndRate' ? '' : 'none' }}
          >
            <RoomTypeAndRate
              {...this.props}
              rateCodeId={form.getFieldValue('rateCodeId')}
              arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
              isEdit
            />
          </div>

          <TanantInfo {...this.props} style={{ display: type === 'TanantInfo' ? '' : 'none' }} />
          <BookRoomList
            {...this.props}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
            rateCodeId={form.getFieldValue('rateCodeId')}
            style={{ display: type === 'BookRoomList' ? '' : 'none' }}
          />

          <div style={{ display: type === 'AccountInfo' ? '' : 'none' }}>
            <Row>
              <Col span={6}>预付总额：{prePayAccountFormat(gresDetails?.accountInfo)}</Col>
              <Col span={6}>退款总额：{returnAccountFormat(gresDetails?.accountInfo)}</Col>
            </Row>
            <AccountInfo
              {...this.props}
            />
          </div>
          <LogList {...this.props} style={{ display: type === 'LogList' ? '' : 'none' }} />
        </Card>
)}
        <FooterToolbar>
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
