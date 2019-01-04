import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Form, Button, Card, Row, Col } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import { orderAddAccTypeMap, orderAddReceiptTypeMap } from 'viewmodels/GresDetailVO';
import { prePayAccountFormat } from 'viewmodels/GresDetailResp';
import BasicInfo from './BasicInfo';
import RoomTypeAndRate from '../../common/RoomTypeAndRate';
import TanantInfo from '../../common/TanantInfo';
import AccountInfo from '../../common/AccountInfo';
import AddComponent from '../../common/AddComponent';
import BookRoomList from '../../common/BookRoomList';
import '../../index.less';

@connect(({ checkIn, loading }) => ({
  checkIn,
  submitting: loading.effects['checkIn/gresAdd'],
  gresSelectRoomTypeLoading: loading.effects['checkIn/gresSelectRoomType'],
  loading,
}))
@Form.create()
export default class View extends AddComponent {
  static defaultProps = {
    gresType: 1,
    resType: 1,
    accTypeMap: orderAddAccTypeMap,
    receiptTypeMap: orderAddReceiptTypeMap,
  }

  componentDidMount() {
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
    const { form, submitting, checkIn: { gresDetails } } = this.props;

    return (
      <PageHeaderLayout>
        <BasicInfo {...this.props} />
        <Card title="预订房型及房价" bordered={false}>
          <RoomTypeAndRate
            {...this.props}
            rateCodeId={form.getFieldValue('rateCodeId')}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
          />
        </Card>
        <Card title="房客信息" bordered={false}>
          <TanantInfo {...this.props} />
        </Card>
        <Card title="账务信息" bordered={false}>
          <Row>
            <Col span={12}>预付总额：{prePayAccountFormat(gresDetails?.accountInfo)}</Col>
          </Row>
          <AccountInfo
            {...this.props}
          />
        </Card>
        <Card title="预留房间" bordered={false}>
          <BookRoomList
            {...this.props}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
            rateCodeId={form.getFieldValue('rateCodeId')}
            gresSelectRoomType={this.props.checkIn.gresSelectRoomType}
          />
        </Card>
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
