import React, { Component } from 'react';
import {
  Modal,
  Form,
  message,
  Button,
  DatePicker,
  InputNumber,
  Icon,
  Popover,
  Table,
} from 'antd';
import { connect } from 'dva';
import Selector from './Selector';
import moment from 'moment';
import { MonitorTextArea } from 'components/input';
// import { fenToYuan } from 'utils/money';
import { div, mul } from 'utils/number';
import Authorized from 'utils/Authorized';
import getColumns from './addModalColumns';
import styles from './styles.less';
@Form.create()
@connect(({ checkIn, loading }) => ({
  checkIn,
  loading: loading.models.checkIn,
}))
export default class EditModal extends Component {
  state = {
    editModalVisible: false,
    selectedRoomId: null,
    dtRes: null,
    selectedRoomInfo: {},
    dataOrigin: {},
    endTime: null,
    beginTime: null,
    dataSource: [],
    mutliInfo: [],
  };
  /*
    显示逻辑
    选择服务项名称=>选择房间号=>客户关联信息=>服务营业日
    箭头前面改变 后面的都要清空
   */

  editModalShow = () => {
    this.setState({ editModalVisible: true });
  };

  editModalCancel = async () => {
    const { dataSource } = this.state;
    const serviceOrderIdList = [];
    if (dataSource.length) {
      dataSource.forEach((v) => {
        serviceOrderIdList.push(v.serviceOrderId);
      });
      const res = await this.props.dispatch({
        type: 'checkIn/batchDelete',
        payload: { serviceOrderIdList },
      });
      if (res) {
        console.log(res);
        this.setState({ editModalVisible: false, dataSource: [] });
      }
    } else {
      this.setState({ editModalVisible: false });
    }
  };

  editModalOk = () => {
    this.handleSubmit();
  };

  handleSubmit = (submitType = 'default') => {
    const { form, dispatch, callBack } = this.props;
    const { dataOrigin, dataSource } = this.state;
    form.validateFields(async (errors, values) => {
      if (errors) {
        return console.log("Errors in form!!!"); //eslint-disable-line
      } else {
        let { businessDay, salePrice, gresInfo, totalPrice, ...others } = values;
        businessDay = moment(businessDay).valueOf();
        salePrice = mul(salePrice, 100);
        const serviceOrderVO = {
          ...others,
          businessDay,
          salePrice,
          paymentItemId: dataOrigin.paymentItemId,
          serviceItemId: dataOrigin.serviceItemId,
        };

        if (submitType === 'default') {
          // 点击modal的确定
          return dispatch({
            type: 'checkIn/addServiceOrder',
            payload: { serviceOrderVO },
          }).then((res) => {
            if (res) {
              this.setState({ editModalVisible: false, dataSource: [] });
              message.success('新增成功');
              callBack();
            }
          });
        } else if (submitType === 'multiple') {
          // return console.log({ totalPrice });
          // 点击 + 号
          dispatch({
            type: 'checkIn/addServiceOrder',
            payload: { serviceOrderVO },
          }).then((res) => {
            if (res) {
              const { serviceName, roomName } = this.state;
              const currentDataSaved = { ...serviceOrderVO, gresInfo, serviceName, roomName, serviceOrderId: res, totalPrice };
              dataSource.push(currentDataSaved);
              // 清空

              this.props.form.setFieldsValue({
                serviceItemId: null,
                roomId: null,
                gresInfo: null,
                salePrice: null,
                totalQty: null,
                totalPrice: null,
                businessDay: null,
                remark: null,
              });
              this.setState({
                selectedRoomId: null,
                dtRes: null,
                dataOrigin: {},
                selectedRoomInfo: {},
                endTime: null,
                beginTime: null,
                dataSource,
              });
            }
          });
        }
      }
    });
  };

  calcTotal=() => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    setTimeout(() => {
      const { totalQty = 0, salePrice = 0 } = getFieldsValue(['totalQty', 'salePrice']);
      setFieldsValue({ totalPrice: mul(totalQty || 0, salePrice) });
    }, 0);
  }

  successDelete = (data) => {
    const { serviceOrderId } = data;
    const { dataSource } = this.state;
    dataSource.splice(dataSource.findIndex(v => v.serviceOrderId === serviceOrderId), 1);
  }


  render() {
    const { data = {}, form, loading } = this.props;

    return (
      <div style={{ display: 'inline' }}>
        {this.state.editModalVisible ? (
          <Modal
            title="创建新服务"
            visible={this.state.editModalVisible}
            onOk={this.editModalOk}
            onCancel={this.editModalCancel}
            width="1300px"
            loading={loading}
          >
            <Table
              columns={getColumns(this.props.mainClass, this)}
              dataSource={this.state.dataSource}
              // dataSource={[{ serviceItemId: 75, roomId: '34', totalQty: 1, remark: '2', businessDay: 1545701176159, salePrice: 23300, paymentItemId: 1, gresInfo: '业务来源7程瑶09-15477778888', serviceName: 'PMS加商品', roomName: '二期洋房B21栋 2205 极目广角海景套房', serviceOrderId: 1860, totalPrice: 233 }]}
              pagination={false}
              loading={loading}
            />
            <div className={styles.tableCol}>
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item >
                  {form.getFieldDecorator('serviceItemId', {
                  initialValue: data?.serviceItemId,
                  rules: [{ required: true, message: '请选择服务项名称' }],
              })(<Selector
                style={{ width: '110px' }}
                type="serviceItem"
                onSel={(id, dt) => {
                  console.log(id, dt);
                const { props: { dataOrigin, title } } = dt;
                form.setFieldsValue({
                  salePrice: div(dataOrigin.salePrice, 100),
                  roomId: null,
                  gresInfo: null,
                  businessDay: null,
                });
                this.calcTotal();
                this.setState({
                  dataOrigin,
                  serviceName: title,
                  endTime: null,
                  beginTime: null,
                  });
                }}
                placeholder="服务项名称"
              />)}
                </Form.Item>

                <Form.Item >
                  {form.getFieldDecorator('roomId', {
                  initialValue: data?.roomId,
                  rules: [{ required: true, message: '请选择房间号' }],
                })(
                  <Selector
                    style={{ width: '150px' }}
                    type="RoomStayInAndReserve"
                    showSearch
                    filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                    onSel={(selectedRoomId, reactNode, dtRes) => {
                  form.setFieldsValue({
                    gresInfo: null,
                    businessDay: null,
                  });
                  const { props: { title } } = reactNode;
                  const { mutliInfo } = dtRes.find(v => Number(v.roomId) === Number(selectedRoomId)) || { mutliInfo: [] };
                  console.log(selectedRoomId, reactNode, 'dtRes', dtRes, mutliInfo);
                      this.setState({
                        roomName: title,
                        selectedRoomId,
                        dtRes,
                        mutliInfo,
                      });

                      this.props.form.setFieldsValue({
                        businessDay: null,
                      });
                    }}
                    placeholder="房间号"
                  />
                )}
                </Form.Item>

                <Form.Item >
                  {form.getFieldDecorator('gresInfo', {
                  initialValue: data?.gresInfo,
                  rules: [{ required: true, message: '请选择客户关联信息' }],
                })(
                  <Selector
                    style={{ width: '150px' }}
                    // key={`mutliInfo=${this.state.mutliInfo}`}
                    type="gresInfoList"
                    showSearch
                    filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                    mutliInfo={this.state.mutliInfo}

                    onSel={(selectedRoomId, reactNode, dtRes) => {
                      const { props: { dataOrigin: { beginTime, endTime } } } = reactNode;
                      console.log(moment(beginTime).format('YYYY-MM-DD'), moment(endTime).format('YYYY-MM-DD'));
                      this.setState({ beginTime, endTime });
                      this.props.form.setFieldsValue({
                        businessDay: null,
                      });
                    }}
                    placeholder="请先选择房间号"
                  />
                )}
                </Form.Item>


                <Form.Item >
                  {form.getFieldDecorator('salePrice', {
                  initialValue: data?.salePrice,
                  rules: [{ required: true, message: '请输入对客单价' }],
                })(<InputNumber
                  style={{ width: '70px', marginLeft: '10px' }}
                  onChange={this.calcTotal}
                  min={0.01}
                />)}
                </Form.Item>

                <Form.Item >
                  {form.getFieldDecorator('totalQty', {
                  initialValue: data?.totalQty,
                  rules: [{ required: true, message: '请输入数量' }],
                })(<InputNumber
                  style={{ width: '70px', marginLeft: '10px' }}
                  onChange={this.calcTotal}
                  min={1}
                />)}
                </Form.Item>


                <Form.Item >
                  {form.getFieldDecorator('totalPrice', {
                  initialValue: data?.totalPrice || 0,
                })(<InputNumber disabled style={{ width: '80px', marginLeft: '35px' }} />)}
                </Form.Item>


                <Form.Item >
                  {form.getFieldDecorator('businessDay', {
                    initialValue: data?.businessDay,
                    rules: [{ required: true, message: '请选择服务营业日' }],
                  })(
                    <DatePicker
                      style={{ width: '130px', marginLeft: '20px' }}
                      disabled={!this.state.endTime || !this.state.beginTime}
                      showTime
                      disabledDate={(current) => {
                        return this.state.endTime && current && (current > moment(this.state.endTime).endOf('day') || current < moment(this.state.beginTime).startOf('day'));
                      }}
                      placeholder={!this.state.endTime || !this.state.beginTime ? '请先选择客户关联信息' : '请选择服务营业日'}
                    />
                  )}
                </Form.Item>


                <Form.Item >
                  {form.getFieldDecorator('remark', {
                  initialValue: data?.remark,
                })(
                  <MonitorTextArea
                    rows={2}
                    form={this.props.form}
                    datakey="remark"
                    maxLength={50}
                    placeholder="备注"
                    style={{ width: '130px', marginLeft: '20px' }}
                  />
                )}
                </Form.Item>
              </Form>
              <div className={styles.add} >
                <Popover
                  title=""
                  placement="top"
                  content={(<h5>点击保存此项,并继续添加</h5>)}
                >
                  <Icon
                    type="plus"
                    onClick={() => this.handleSubmit('multiple')}
                  />
                </Popover>
              </div>
            </div>
          </Modal>
        ) : (
          ''
        )}
        <Authorized authority={['PMS_CHECKIN_SERVICETICKET_ADD']} >
          <Button type="primary" onClick={this.editModalShow}>
            创建新服务
          </Button>
        </Authorized >
      </div>
    );
  }
}
