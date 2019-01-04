import React from 'react';
import _ from 'lodash';
import { Select, Spin } from 'antd';
import qs from 'qs';

export default class SelectSource extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.linkValue !== this.props.linkValue) {
      this.initPriceTypeList(nextProps.linkValue);
    }
  }

  initPriceTypeList= (sourceId) => {
    if (!sourceId) return;

    this.props.dispatch({
      type: 'checkIn/rateCodePage',
      payload: {
        currPage: 1,
        pageSize: 9999,
        sourceId,
        status: 1,
      },
    });

    const { form } = this.props;

    form.resetFields('rateCodeId');
  }

  handleResetRoomTypeList= async (...args) => {
    const { onChange } = this.props;
    if (onChange instanceof Function) {
      onChange(...args);
    }
  }

  render() {
    const { rateCodePage, dispatch, linkValue, loading, checkIn, ...others } = this.props;
    let { dataList } = rateCodePage || {};
    const { rateCodeId, sourceId } = checkIn?.gresDetails || {};
    const rateCodeName = checkIn[`rateCodeId_${rateCodeId}`];

    const curItem = _.find(dataList, item => item.rateCodeId === others.value);

    if (others.value === rateCodeId && !loading &&
      !curItem && rateCodeName && linkValue === sourceId) {
      dataList = (dataList || []).concat([{
        rateCodeId,
        rateCodeName,
      }]);
    }

    const placeholder = linkValue ? '请选择价格类型' : '请先选择业务来源';

    return (
      <Select
        disabled={!linkValue}
        {...others}
        placeholder={placeholder}
        onChange={this.handleResetRoomTypeList}
        notFoundContent={loading ? <Spin spinning /> : '没有数据'}
        value={others.value ? others.value : ''}
        allowClear
      >
        {
          dataList?.map(item => (
            <Select.Option value={item.rateCodeId} key={item.rateCodeId}>
              {item.rateCodeName}
            </Select.Option>
          ))
        }
      </Select>
    );
  }
}
