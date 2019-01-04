import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, DatePicker, Input } from 'antd';
import { MonitorTextArea } from 'components/input';
import moment from 'moment';
import { repairTypeOptions, repairAreaTypeOptions } from 'utils/attr/repair';

const SelectOption = Select.Option;

@Form.create()
@connect(({ houseStatus }) => ({
  houseStatus,
}))
class RepairModal extends PureComponent {
  state = {
    // 日期组件样式 -- 用于解决showTime=true时，日期控件宽度不自动缩放的bug
    rangePickerStyle: {
      style: {
        width: '100%',
      },
    },
  }

  componentDidMount() {
    const { dispatch, repairDetail } = this.props;
    const postData = {
      currPage: 1,
      pageSize: 1000,
      orgId: localStorage.user ? JSON.parse(localStorage.user).orgIdSelected : 1,
      status: 1,
    };
    dispatch({
      type: 'houseStatus/getBuildingList',
      payload: postData,
    });
    if (repairDetail?.buildingId) {
      postData.buildingId = repairDetail?.buildingId;
      dispatch({
        type: 'houseStatus/getRoomList',
        payload: postData,
      });
    }
  }

  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (options = [], isMore = false, placeholder = '请选择', disabled = false) => {
    const params = isMore ? {
      mode: 'multiple',
      disabled,
    } : { disabled };

    return (
      <Select placeholder={placeholder} {...params}>
        {
          options.map((item) => {
            return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
          })
        }
      </Select>
    );
  }

  changeBuilding(val) {
    const { dispatch, form } = this.props;
    const postData = {
      currPage: 1,
      pageSize: 1000,
      buildingId: val,
      orgId: localStorage.user ? JSON.parse(localStorage.user).orgIdSelected : 1,
      status: 1,
    };
    form.resetFields(['roomId']);
    dispatch({
      type: 'houseStatus/getRoomList',
      payload: postData,
    });
  }

  renderBuildingOption(list) {
    if (list) {
      return list.map((item) => {
        return <SelectOption key={item.buildingId} value={item.buildingId}>{item.buildingName}</SelectOption>;
      });
    }
  }
  renderRoomOption(list) {
    if (list) {
      return list.map((item) => {
        return <SelectOption key={item.roomId} value={item.roomId}>{item.roomNo}</SelectOption>;
      });
    }
  }

  render() {
    const { visible, repairId, onCancel, onOk, form, houseStatus, confirmLoading } = this.props;
    const { repairDetail, getBuildingList, getRoomList } = houseStatus || {};
    const { rangePickerStyle } = this.state;

    const buildingList = getBuildingList?.dataList || [];
    const roomList = getRoomList?.dataList || [];
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    return (
      <Modal
        visible={visible}
        title={repairId === 0 ? '新增维修' : '编辑维修'}
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label="维修地点类型" {...formItemLayout}>
            {form.getFieldDecorator('addressType', {
              initialValue: repairId > 0 ? (repairDetail?.addressType) : '',
              rules: [
                { required: true, message: '请选择地点类型' },
              ],
            })(
              this.getSearchOptionsElm(repairAreaTypeOptions, false, '请选择地点类型', repairId !== 0)
            )}
          </Form.Item>
          {
            form.getFieldValue('addressType') === 1 ? (
              <div>
                <Form.Item label="楼栋" {...formItemLayout}>
                  {form.getFieldDecorator('buildingId', {
                    initialValue: repairId > 0 ? (repairDetail?.buildingId) : '',
                    rules: [
                      { required: true, message: '请选择楼栋' },
                    ],
                  })(
                    <Select disabled={repairId !== 0} onChange={this.changeBuilding.bind(this)}>
                      {this.renderBuildingOption(buildingList)}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="房间号" {...formItemLayout}>
                  {form.getFieldDecorator('roomId', {
                    initialValue: repairId > 0 ? (repairDetail?.roomId) : '',
                    rules: [
                      { required: true, message: '请选择房间号' },
                    ],
                  })(
                    <Select disabled={repairId !== 0}>
                      {this.renderRoomOption(roomList)}
                    </Select>
                  )}
                </Form.Item>
              </div>
              ) : ''
          }
          {
            form.getFieldValue('addressType') === 2 || form.getFieldValue('addressType') === 3 ? (
              <Form.Item label="维修地点" {...formItemLayout}>
                {form.getFieldDecorator('address', {
                  initialValue: repairId > 0 ? (repairDetail?.address) : '',
                  rules: [
                    { required: true, message: '请选择维修地点' },
                  ],
                })(
                  <Input disabled={repairId !== 0} />
                )}
              </Form.Item>
            ) : ''
          }
          <Form.Item label="维修类型" {...formItemLayout}>
            {form.getFieldDecorator('type', {
              initialValue: repairId > 0 ? (repairDetail?.type) : '',
              rules: [
                { required: true, message: '请选择维修类型' },
              ],
            })(
              this.getSearchOptionsElm(repairTypeOptions)
            )}
          </Form.Item>
          <Form.Item label="维修内容" {...formItemLayout}>
            {form.getFieldDecorator('content', {
              initialValue: repairId > 0 ? (repairDetail?.content) : '',
              rules: [
                { required: true, message: '请输入维修内容' },
              ],
            })(
              <MonitorTextArea placeholder="请输入维修内容" datakey="content" rows={4} maxLength={50} form={form} />
            )}
          </Form.Item>
          <Form.Item label="开始时间" {...formItemLayout}>
            {form.getFieldDecorator('startTime', {
              initialValue: repairId > 0 ? moment(repairDetail?.startTime) : null,
              rules: [
                { required: true, message: '请选择开始时间' },
                {
                  validator(rule, value, callback) {
                    const startTime = moment(value).valueOf();
                    const nowTime = new Date().getTime();
                    if (repairId > 0 || startTime > nowTime) {
                      callback();
                    } else {
                      callback('开始时间不能早于当前时间！');
                    }
                  },
                },
              ],
            })(
              <DatePicker
                {...rangePickerStyle}
                disabled={repairId !== 0 && repairDetail?.startTime < new Date().getTime()}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始时间"
              />
            )}
          </Form.Item>
          <Form.Item label="结束时间" {...formItemLayout}>
            {form.getFieldDecorator('endTime', {
              initialValue: repairId > 0 ? moment(repairDetail?.endTime) : null,
              rules: [
                { required: true, message: '请选择结束时间' },
                {
                  validator(rule, value, callback) {
                    let startTime = '';
                    const startTimeVal = form.getFieldValue('startTime');
                    if (startTimeVal) {
                      startTime = moment(startTimeVal).valueOf();
                    }
                    const endTime = moment(value).valueOf();
                    const nowTime = new Date().getTime();
                    if (endTime > nowTime) {
                      if (startTime) {
                        if (startTime < endTime) {
                          callback();
                        } else {
                          callback('结束时间不能早于开始时间！');
                        }
                      } else {
                        callback();
                      }
                    } else {
                      callback('结束时间不能早于当前时间！');
                    }
                  },
                },
              ],
            })(
              <DatePicker
                {...rangePickerStyle}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default RepairModal;
