import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';
import qs from 'qs';
import _ from 'lodash';
import moment from 'moment/moment';
import {
  transformArrivalDate,
  transformDepartureDate,
} from 'viewmodels/GresDetailResp';

export default class SelectSource extends React.PureComponent {
  static propTypes = {
    page: PropTypes.number,
    pageSize: PropTypes.number,
    checkIn: PropTypes.object,
  };

  static defaultProps = {
    page: 1,
    pageSize: 999,
  };

  componentDidMount() {
    this.getSourceList();
  }

  getSourceList = async () => {
    const { startTime, roomId, gresId } =
      qs.parse(this.props?.location?.search?.replace('?', '')) || {};
    const { gresDetails } = this.props.checkIn || {};
    const { user } = localStorage;

    if (startTime) {
      gresDetails.setArrivalDate(
        transformArrivalDate(Number(startTime)).valueOf()
      );
      gresDetails.setDepartureDate(
        transformDepartureDate(
          moment(Number(startTime)).add(1, 'days')
        ).valueOf()
      );
    }

    try {
      const objUser = JSON.parse(user);
      const response = await this.props.dispatch({
        type: 'checkIn/sourceList',
        payload: {
          orgId: objUser?.orgIdSelected,
        },
      });

      if (!gresId && roomId && response?.dataList?.length) {
        this.props.form.setFieldsValue({
          sourceId: response.dataList[0].sourceId,
        });
      }
    } catch (e) {
      console.info(e);
    }
  };

  render() {
    const { sourceList, dispatch, loading, checkIn = {}, ...others } = this.props;

    const { sourceId } = checkIn?.gresDetails || {};
    const sourceName = checkIn[`sourceId_${sourceId}`];
    let { dataList } = sourceList || {};
    const curItem = _.find(dataList, item => item.sourceId === others.value);

    if (others.value === sourceId && !loading && !curItem && sourceName) {
      dataList = (dataList || []).concat([{
        sourceId,
        sourceName,
      }]);
    }
    return (
      <Select
        showSearch
        optionFilterProp="children"
        {...others}
        allowClear
        notFoundContent={loading ? <Spin spinning /> : '没有数据'}
        placeholder="请选择"
      >
        {dataList?.map(item => (
          <Select.Option value={item.sourceId} key={item.sourceId} title={item.sourceName}>
            {item.sourceName}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
