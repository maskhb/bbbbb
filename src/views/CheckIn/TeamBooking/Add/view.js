import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Button, Card } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import BasicInfo from './BasicInfo';
import RoomTypeAndRate from '../../common/RoomTypeAndRate';
import TanantInfo from '../../common/TanantInfo';
import BookRoomList from '../../common/BookRoomList';
import '../../index.less';

import AddComponent from '../../common/AddComponent';

@connect(({ checkIn, loading }) => ({
  checkIn,
  submitting: loading.effects['checkIn/gresAdd'],
  loading,
}))
@Form.create()
export default class View extends AddComponent {
  static defaultProps = {
    gresType: 1,
    resType: 2,
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/resetDetails',
      payload: {},
    });
  }

  render() {
    const { form, submitting } = this.props;

    return (
      <PageHeaderLayout>
        <BasicInfo {...this.props} />
        <Card title="预订房型及房价" bordered={false}>
          <RoomTypeAndRate
            {...this.props}
            isTeam
            rateCodeId={form.getFieldValue('rateCodeId')}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
          />
        </Card>
        <Card title="房客信息" bordered={false}>
          <TanantInfo {...this.props} />
        </Card>
        <Card title="预留房间" bordered={false}>
          <BookRoomList
            {...this.props}
            rateCodeId={form.getFieldValue('rateCodeId')}
            arrivalDepartureDate={_.cloneDeep(form.getFieldValue('arrivalDepartureDate'))}
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
