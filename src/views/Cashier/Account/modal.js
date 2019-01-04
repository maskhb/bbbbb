import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, Button, InputNumber } from 'antd';
import { MonitorInput } from 'components/input';
import { connect } from 'dva';
import { div, mul } from 'utils/number';
import BusinessSourseBtn from '../../Channel/components/BusinessSourceBtn';
import styles from './view.less';

@Form.create()
@connect(({ cashier, user, loading }) => ({
  cashier,
  user,
  loading: loading.models.channel,
}))
export default class EditModal extends Component {
  state = {
    editModalVisible: false,
  };
  componentDidMount() {

  }

  editModalShow = () => {
    const { sourseData, dispatch, type } = this.props;
    if (type === 'edit') {
      dispatch({
        type: 'cashier/queryCreditAccountDetails',
        payload: { accountId: sourseData?.accountId },
      }).then((res) => {
        if (res) {
          const { sourceList } = res;
          const sourceIdList = [];
          let checkNames = '';

          if (sourceList && Array.isArray(sourceList)) {
            sourceList?.forEach((item) => {
              sourceIdList.push(item.sourceId);
              checkNames += `${item.sourceName},`;
            });
          }
          checkNames = checkNames.substr(0, checkNames.length - 1);
          this.setState({ sourceIdList, checkNames, sourceList });
        } else {
          message.error('未知错误');
        }
      });
    } else {
      // 新增清除details
      dispatch({
        type: 'cashier/clearAccountDetails',
      });
    }

    this.setState({ editModalVisible: true });
  }
  editModalCancel = () => {
    this.setState({ editModalVisible: false, checkNames: '', sourceIdList: [] });
  }
  editModalOk = () => {
    this.handleSubmit();
  }

  handleSubmit = () => {
    const { form, dispatch, sourseData, type } = this.props;
    const { sourceList, sourceIdList, all, checkNames } = this.state;

    form.validateFields((errors, values) => {
      if (errors) {
        return console.log('Errors in form!!!');//eslint-disable-line
      } else {
        if (!(sourceIdList && sourceIdList.length)) return message.error('关联业务来源不可为空');


        if (type === 'edit') {
          // 编辑
          console.log({ state: this.state, props: this.props });

          const sourceListRes = [];
          sourceIdList.forEach((v, i) => {
            sourceListRes.push({ sourceId: v, sourceName: checkNames.split(',')[i] });
          });

          let { totalAmountCredit } = values;
          if (Number(totalAmountCredit) === 0) {
            totalAmountCredit = 0;
          } else {
            totalAmountCredit = Math.round(mul(totalAmountCredit, 100));
          }
          // 编辑
          const paramsEdit = { ...values, sourceList: sourceListRes, totalAmountCredit, accountId: sourseData?.accountId };
          delete paramsEdit.sourceId;

          return dispatch({
            type: 'cashier/updateAccountReceivable',
            payload: paramsEdit,
          }).then((res) => {
            if (res) {
              message.success(`${type === 'edit' ? '编辑' : '新增'}成功`);
              dispatch({
                type: 'cashier/queryAccountReceivable',
                payload: { accountReceivablePageVO: { currPage: 1, pageSize: 20, accountReceivableQueryVO: { accountName: '' } } },
              });
              this.editModalCancel();
            }
          });
        } else {
          // 新增
          const sourceListRes = [];
          sourceIdList.forEach((v, i) => {
            sourceListRes.push({ sourceId: v, sourceName: checkNames.split(',')[i] });
          });
          let { totalAmountCredit } = values;
          totalAmountCredit = Math.round(mul(totalAmountCredit, 100));
          const paramsAdd = { ...values, sourceList: sourceListRes, totalAmountCredit };
          delete paramsAdd.sourceId;

          return dispatch({
            type: 'cashier/addAccountReceivable',
            payload: paramsAdd,
          }).then((res) => {
            if (res) {
              message.success(`${type === 'edit' ? '编辑' : '新增'}成功`);
              dispatch({
                type: 'cashier/queryAccountReceivable',
                payload: { accountReceivablePageVO: { currPage: 1, pageSize: 20, accountReceivableQueryVO: { accountName: '' } } },
              });
              this.editModalCancel();
            }
          });
        }
      }
    });


    /* function formatter(values) {
      const sourceListRes = [];
      sourceList.forEach((v, i) => {
        sourceListRes.push({ sourceId: v, sourceName: checkNames.split(',')[i] });
      });
      let { totalAmountCredit } = values;
      totalAmountCredit = Math.round(mul(totalAmountCredit, 100));
      if (type === 'eidt') {
        // 编辑
        const paramsEdit = { ...values, totalAmountCredit };
        delete paramsEdit.sourceId;
        console.log({ paramsEdit });

        return paramsEdit;
      } else {
        // 新增
        const paramsAdd = { ...values, sourceList: sourceListRes, totalAmountCredit };
        delete paramsAdd.sourceId;
        return paramsAdd;
      }
    } */
  }


  render() {
    const { cashier, form, type } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <div style={{ display: 'inline' }}>

        {this.state.editModalVisible ? (
          <Modal
            title={`${type === 'edit' ? '编辑' : '新增'}应收账号`}
            visible={this.state.editModalVisible}
            onOk={this.editModalOk}
            onCancel={this.editModalCancel}
            width="45%"
          >
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                label="账号名称："
                {...formItemLayout}
              >
                {form.getFieldDecorator('accountName', {
                  rules: [{
                    required: true, message: '请输入账号名',
                  }],
                  initialValue: cashier?.currentDetail?.accountName,
                })(
                  <MonitorInput maxLength={20} simple="true" />
                )}
              </Form.Item>

              <Form.Item
                label="关联业务来源："
                {...formItemLayout}
              >
                {form.getFieldDecorator('sourceId', {
                  rules: [{
                    required: true, message: '关联业务来源不可空',
                  }],
                  initialValue: String(cashier?.currentDetail?.sourceIdList).split(','),
                })(
                  <div style={{ position: 'releative' }}>
                    <Input value={this.state.checkNames || ''} />
                    <div className={styles.sourseBtnBox}>
                      <BusinessSourseBtn
                        okCallBack={(sourceIdList, all, checkNames) => {
                          this.setState({ sourceIdList, all, checkNames });
                        }}
                        initData={
                          this.state.sourceIdList ? this.state.sourceIdList :
                          cashier?.currentDetail?.sourceIdList && cashier?.currentDetail?.sourceIdList.indexOf(',') ? cashier?.currentDetail?.sourceIdList.split(',').map(v => Number(v)) : []
                        }
                      />
                    </div>
                  </div>
                )}
              </Form.Item>
              <Form.Item
                label="总挂账额度："
                {...formItemLayout}
              >
                {form.getFieldDecorator('totalAmountCredit', {
                  rules: [{
                    required: true, message: '请输入总挂账额度',
                  }],
                  initialValue: cashier?.currentDetail?.totalAmountCredit ? div(cashier?.currentDetail?.totalAmountCredit, 100).toFixed(2) : 0,
                })(
                  <InputNumber
                    min={0}
                    max={99999999.99}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="状态："
                {...formItemLayout}
              >
                {form.getFieldDecorator('status', {
                  rules: [{
                    required: true, message: '请选择状态',
                  }],
                  initialValue: cashier?.currentDetail?.status || 1,
                     })(
                       <Select >
                         <Select.Option value={1}>启用</Select.Option>
                         <Select.Option value={2}>禁用</Select.Option>
                       </Select>
                )}
              </Form.Item>
            </Form>
          </Modal>
      ) : ''}
        {
          type === 'edit' ?
            <a onClick={this.editModalShow}>编辑</a>
          : (
            <Button
              onClick={this.editModalShow}
            >
            + 新增账号
            </Button>
            )}
      </div>

    );
  }
}
