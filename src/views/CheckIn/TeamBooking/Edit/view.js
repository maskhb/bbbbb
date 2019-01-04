import React from 'react';
import { Radio, Form, Card, Button, Row, Col, Spin } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import { accTypeMap, roomEditReceiptTypeMap } from 'viewmodels/GresDetailVO';
import { prePayAccountFormat, calTanantInfoLen, preConsumFormat, shouldReceiptFormat, returnAccountFormat } from 'viewmodels/GresDetailResp';
import qs from 'qs';

import BasicInfo from '../Add/BasicInfo';
import RoomTypeAndRate from '../../common/RoomTypeAndRate';
import TanantInfo from '../../common/TanantInfo';
import BookRoomList from '../../common/BookRoomList';
import AccountInfo from '../../common/AccountInfo';
import LogList from '../../common/LogList';

import AddComponent from '../../common/AddComponent';

@connect(({ checkIn, loading }) => ({
  checkIn,
  loading,
  detailLoading: loading.effects['checkIn/gresDetails'],
  submitting: loading.effects['checkIn/gresAdd'],
}))
@Form.create()
class view extends AddComponent {
  static defaultProps={
    gresType: 1,
    resType: 2,
    isEdit: true,
    accTypeMap,
    receiptTypeMap: roomEditReceiptTypeMap,
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

    await this.props.dispatch({
      type: 'checkIn/gresDetails',
      payload: {
        gresId,
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
    const { submitting, checkIn: { gresDetails, selectedRoomTypeId },
      form, detailLoading } = this.props;

    return (
      <PageHeaderLayout>

        <Spin spinning={detailLoading}>
          <BasicInfo {...this.props} />
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
          <RoomTypeAndRate
            {...this.props}
            isEdit
            isTeam
            style={{ display: type === 'RoomTypeAndRate' ? '' : 'none' }}
            rateCodeId={form.getFieldValue('rateCodeId')}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
          />
          <TanantInfo {...this.props} style={{ display: type === 'TanantInfo' ? '' : 'none' }} />
          <BookRoomList
            {...this.props}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
            rateCodeId={form.getFieldValue('rateCodeId')}
            style={{ display: type === 'BookRoomList' ? '' : 'none' }}
          />
          <div style={{ display: type === 'AccountInfo' ? '' : 'none' }}>
            <Row style={{ lineHeight: '32px' }}>
              <Col span={5}>总消费：{preConsumFormat(gresDetails?.accountInfo)}</Col>
              <Col span={5}>总收款：{prePayAccountFormat(gresDetails?.accountInfo)}</Col>
              <Col span={5}>总退款：{returnAccountFormat(gresDetails?.accountInfo)}</Col>
              <Col span={5}>应收尾款：{shouldReceiptFormat(gresDetails?.accountInfo)}</Col>
            </Row>
            <AccountInfo
              {...this.props}
            />
          </div>
          {type === 'LogList' && <LogList {...this.props} />}
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
