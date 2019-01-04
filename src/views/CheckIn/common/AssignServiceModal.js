import React from 'react';
import _ from 'lodash';
import { Modal, Table, InputNumber, Form } from 'antd';
import moment from 'moment';
import { mul } from 'utils/number';
import FormItem from './FormItem';
import { getDateRange } from '../../../viewmodels/GresDetailResp';

const getKeyName = index => `assginServiceOrders[${index}]`;

const keyFn = (record) => {
  return `${record.serviceItemId}${moment(record.businessDay).valueOf()}`;
};

const getAssignQty = (serviceItemId, assginServiceOrders) => {
  return _.reduce(_.filter(assginServiceOrders, item =>
    item.serviceItemId === serviceItemId), (sum, curItem) => {
    return sum + (curItem.unitQty || 0);
  }, 0);
};

const checkFormAssignQty = (formAddServiceOrders, tableData, serviceItemId) => {
  let sum = 0;
  _.forEach(tableData, (item, index) => {
    if (item.serviceItemId === serviceItemId) {
      sum += formAddServiceOrders[index] || 0;
    }
  });

  return sum;
};

const getRemainQty = (remainQty, assignQty) => {
  return remainQty - assignQty;
};

/**
 * 同一个房间，但是预留时间段不同
 * 不同房间，预留时间段不一定相同
 * （非同一房间、同一时间段）
 * @param roomId
 * @param serviceItemId
 * @param assginServiceOrders
 * @param arrBusinessDay
 * @returns {number}
 */
const getOthersRoomAssignQty = (roomId, serviceItemId, assginServiceOrders, arrBusinessDay) => {
  return _.reduce(_.filter(assginServiceOrders, item =>
    (item.serviceItemId === serviceItemId &&
      (item.roomId !== roomId || arrBusinessDay.indexOf(item.businessDay) === -1))
  ), (sum, curItem) => {
    const unitQty = Number(curItem.unitQty || 0);
    sum += unitQty;
    return sum;
  }, 0);
};

@Form.create()
export default class AssignServiceModal extends React.Component {
  getDayDiff = () => {
    const { record } = this.props;
    return moment(record.departureDate).diff(record.arrivalDate, 'days') + 1;
  }

  getData = () => {
    const { record, checkIn: { gresDetails }, addServiceOrders } = this.props;
    const { assginServiceOrders = [] } = gresDetails || {};
    const dayDiff = this.getDayDiff();
    const arr = [];
    _.map(addServiceOrders, (item) => {
      if (item) {
        for (let i = 0; i < dayDiff; i++) {
          const businessDay = moment(record.arrivalDate).add(i, 'days').startOf('day').valueOf();
          const serviceItemId = Number(item.serviceItemId);
          const unitQty = _.find(assginServiceOrders, (service) => {
            return service.businessDay === businessDay
              && service.roomId === record.roomId
              && service.serviceItemId === serviceItemId;
          })?.unitQty || 0;

          const arrBusinessDay = getDateRange(record.arrivalDate, record.departureDate);
          const othersRoomAssignQty = getOthersRoomAssignQty(
            record.roomId, serviceItemId, assginServiceOrders, arrBusinessDay
          );
          arr.push({
            businessDay,
            serviceItemId,
            serviceName: item.serviceName,
            source: item.source || 0,
            unitQty,
            remainQty: item.unitQty || 0,
            // 某个服务项，除了当天当个房间，已分配的数量
            othersAssignQty: getAssignQty(serviceItemId, assginServiceOrders) - unitQty,
            othersRoomAssignQty: othersRoomAssignQty || 0,
            roomId: record.roomId,
            roomTypeId: record.roomTypeId,
            salePrice: mul(item.salePriceFormat, 100),
          });
        }
      }
    });
    return arr;
  }

  getAssignQty = (record, index) => {
    const { form } = this.props;

    const values = form.getFieldsValue();

    if (values.assginServiceOrders && (values.assginServiceOrders.length - 1 >= index)) {
      return getRemainQty(record.remainQty,
        checkFormAssignQty(values.assginServiceOrders,
          this.getData(), record.serviceItemId) + record.othersRoomAssignQty);
    }
    return record.remainQty - record.othersAssignQty - record.unitQty;
  }

  columns = () => {
    const { form } = this.props;
    const dayDiff = this.getDayDiff();

    return [{
      title: '服务项',
      dataIndex: 'serviceName',
      render: (val, record, index) => {
        return { children: (
          <div>
            <div>{val}</div>
            <div>(待分配
              <span style={{ color: 'red' }}>{
                this.getAssignQty(record, index)
          }
              </span>)
            </div>
          </div>
        ),
        props: {
          rowSpan: index % dayDiff === 0 ? dayDiff : 0,
        } };
      },
    }, {
      title: '日期',
      dataIndex: 'businessDay',
      render: (val) => {
        return moment(val).format('YYYY-MM-DD');
      },
    }, {
      title: '数量',
      dataIndex: 'unitQty',
      render: (val, record, index) => {
        return (
          <FormItem
            form={form}
            initialValue={val}
            keyName={getKeyName(index)}
            rules={[{
              validator: (rule, value, callback) => {
                if (this.getAssignQty(record, index) < 0) {
                  callback('分配数量不允许大于待分配数量');
                } else {
                  callback();
                }
              },
            }]}
          >
            <InputNumber
              min={0}
              step={1}
              precision={0}
            />
          </FormItem>
        );
      },
    }];
  }

  handleSubmit = () => {
    const { checkIn: { gresDetails }, dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const arr = values.assginServiceOrders;
        const assginServiceOrders = _.cloneDeep(gresDetails?.assginServiceOrders) || [];

        const list = this.getData();

        _.forEach(list, (item, index) => {
          const serviceIndex = _.findIndex(assginServiceOrders, (service) => {
            return service.serviceItemId === item.serviceItemId
              && service.businessDay === item.businessDay
              && service.roomId === item.roomId;
          });

          if (serviceIndex !== -1) {
            assginServiceOrders[serviceIndex].unitQty = arr[index] || 0;
          } else {
            assginServiceOrders.push({
              ..._.pick(item, ['businessDay', 'gresId', 'roomId', 'roomTypeId', 'salePrice', 'serviceItemId', 'source']),
              unitQty: arr[index] || 0,
            });
          }
        });

        gresDetails.setAssignServiceOrders(_.filter(assginServiceOrders, item => item.unitQty));
        dispatch({
          type: 'checkIn/save',
          payload: {
            gresDetails,
          },
        });
        this.props.handleOperateModal(null);
      }
    });
  }

  render() {
    const { record } = this.props;


    return (
      <Modal
        visible={Boolean(record)}
        title={`当前房间：${(record || {}).buildingRoomNo}`}
        onCancel={() => this.props.handleOperateModal(null)}
        onOk={() => this.handleSubmit()}
      >
        <Table
          columns={record ? this.columns() : []}
          dataSource={record ? this.getData() : []}
          bordered
          pagination={false}
          rowKey={keyFn}
        />
      </Modal>
    );
  }
}
