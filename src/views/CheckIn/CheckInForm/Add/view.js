import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Button, Card } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import qs from 'qs';
import { orderEditReceiptTypeMap, orderAddAccTypeMap } from 'viewmodels/GresDetailVO';
import { transformArrivalDate, transformDepartureDate } from 'viewmodels/GresDetailResp';
import BasicInfo from './BasicInfo';
import RoomPrice from './RoomPrice';
import TanantInfo from '../../common/TanantInfo';
import AccountInfo from '../../common/AccountInfo';
import AddComponent from '../../common/AddComponent';
import '../../index.less';

@connect(({ checkIn, loading }) => ({
  checkIn,
  submitting: loading.effects['checkIn/gresAdd'],
  loading,
  detailLoading: loading.effects['checkIn/gresDetails'],
}))
@Form.create()
export default class View extends AddComponent {
  static defaultProps = {
    gresType: 2,
    resType: 1,
    isCheckIn: true,
    accTypeMap: orderAddAccTypeMap,
    receiptTypeMap: orderEditReceiptTypeMap,
  }

  async componentDidMount() {
    const { gresId, roomId, roomNo, arrivalDate, departureDate } = qs.parse(this.props.location.search?.replace('?', '')) || {};

    const { dispatch } = this.props;

    if (gresId) {
      await dispatch({
        type: 'checkIn/gresDetails',
        payload: {
          gresId,
          roomId: roomId || '',
          isPreCheckIn: true,
          isCheckIn: true,
          arrivalDate,
          departureDate,
        },
      });
    } else if (roomId && roomNo) {
      const response = await this.props.dispatch({
        type: 'checkIn/roomPage',
        payload: {
          currPage: 1,
          pageSize: 1,
          roomId,
        },
      });
      const roomTypeId = response?.dataList ? Number(response?.dataList[0]?.roomTypeId) : '';

      if (roomTypeId) {
        dispatch({
          type: 'checkIn/gresSelectRoom',
          payload: {
            roomTypeId,
            arrivalDate: transformArrivalDate(new Date()).valueOf(),
            departureDate: transformDepartureDate(moment().add(1, 'day')).valueOf(),
          },
        });
      }

      await dispatch({
        type: 'checkIn/resetDetails',
        payload: {
          roomId: Number(roomId),
          roomNo,
          roomTypeId,
          gresGuestVOs: [{}],
        },
      });
    }

    this.init();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/resetDetails',
      payload: {},
    });
  }

  render() {
    const { submitting, form, detailLoading, checkIn: { gresDetails } } = this.props;
    const { rateCodeId, arrivalDepartureDate, roomId } = form.getFieldsValue();

    const { gresId, arrivalDate } = qs.parse(this.props.location.search?.replace('?', '')) || {};

    return (
      <PageHeaderLayout>
        <BasicInfo {...this.props} isPreCheckIn={Boolean(gresId)} />
        <Card title="房价" bordered={false}>
          {!detailLoading && (
          <RoomPrice
            {...this.props}
            rateCodeId={rateCodeId}
            arrivalDepartureDate={
              (gresId && arrivalDate) ? gresDetails?.arrivalDepartureDate : _.cloneDeep(arrivalDepartureDate)
            }
            roomId={(gresId && arrivalDate) ? gresDetails?.roomId : roomId}
          />
)}
        </Card>
        {((gresId && !detailLoading) || !gresId) ? (
          <Card title="房客信息" bordered={false}>
            <TanantInfo {...this.props} />
          </Card>
        ) : null}
        <Card title="账务信息" bordered={false}>
          <AccountInfo
            {...this.props}
          />
        </Card>
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
