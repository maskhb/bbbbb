import React, { Component } from 'react';
import { Modal, Form, Input, Select, TreeSelect, message, Button, InputNumber } from 'antd';
import { MonitorInput } from 'components/input';
import { orgId } from 'utils/getParams';
import { connect } from 'dva';
import { div, mul } from 'utils/number';
import AsyncSelect from 'components/AsyncSelect';
import DepartmentSelector from '../components/DepartmentSelector';
import styles from './view.less';
import DepartmentModal from '../../BaseSetting/Department/module';
import { orgType } from 'utils/getParams';
@Form.create()
@connect(({ user, channel, loading }) => ({ user, channel, loading: loading.models.channel }))
export default class EditModal extends Component {
  state = {
    editModalVisible: false,
  };

  editModalShow = () => { this.setState({ editModalVisible: true }); }
  editModalCancel = () => { this.setState({ editModalVisible: false }); }
  editModalOk = () => { this.handleSubmit(); }
  handleSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return console.log('Errors in form!!!');//eslint-disable-line
      } else {
        const { dispatch, sourseData, type = 'edit' } = this.props;
        const { depId, depName, channelId = sourseData.channelId, channelName = sourseData.channelName } = this.state;

        let SourceVO;
        if (type === 'edit') {
          SourceVO = { ...sourseData, ...values, depId, depName, channelId, channelName, orgId: orgId() };
        } else {
          SourceVO = { ...values, channelName };
        }

        return dispatch({
          type: `channel/${type === 'edit' ? 'update' : 'add'}Source`,
          payload: { SourceVO },
        }).then((res) => {
          if (res) {
            message.success(`${type === 'edit' ? '编辑' : '新增'}成功`);
            dispatch({
              type: 'channel/querySourceListByPage',
              payload: { accountReceivableQueryVO: { currPage: 1, pageSize: 20, orgId: orgId() } },
            });
            this.editModalCancel();
          }
        });
      }
    });
  }


  render() {
    const { sourseData: data = {}, form, type = 'edit' } = this.props;
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
    const disableFlag = !!(type === 'edit' && orgType() === 1);
    return (
      <div style={{ display: 'inline' }}>

        {this.state.editModalVisible ? (
          <Modal
            title={`${type === 'edit' ? '编辑' : '新增'}业务来源`}
            visible={this.state.editModalVisible}
            onOk={this.editModalOk}
            onCancel={this.editModalCancel}
            width="35%"
          >
            <Form
              onSubmit={this.handleSubmit}
            >

              <Form.Item
                label="业务来源："
                {...formItemLayout}
              >
                {form.getFieldDecorator('sourceName', {
                rules: [{
                  required: true, message: '请输入业务来源',
                }],
                initialValue: data.sourceName,
              })(
                <MonitorInput
                  maxLength={20}
                  simple="true"
                  disabled={disableFlag}
                />
              )}
              </Form.Item>

              <Form.Item
                label="关联上级渠道："
                {...formItemLayout}
              >
                {form.getFieldDecorator('channelId', {
                rules: [{
                  required: true, message: '请选择关联上级渠道',
                }],
                  initialValue: data.channelName,
              })(
                <AsyncSelect
                  type="channel"
                  disabled={disableFlag}
                  onSel={(channelId, channelNameInfo) => {
                    const { props: { children: channelName } } = channelNameInfo;
                    console.log({ channelId, channelNameInfo, channelName });
                    this.setState({ channelId, channelName });
                  }}
                />
              )}
              </Form.Item>
              {type === 'edit' ? (
                <Form.Item label="业绩归属部门" {...formItemLayout}>
                  {form.getFieldDecorator('depId', {
                    initialValue: [data.depId, data.depName],
                  })(
                    <DepartmentModal
                      onSel={(depId, depNameArray) => {
                        const [depName] = depNameArray;
                        this.setState({ depId, depName });
                      }}
                    />
                  )}
                </Form.Item>
              ) : ''}

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
                + 新增业务来源
              </Button>
            )}
      </div>

    );
  }
}
