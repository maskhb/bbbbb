import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, message, Modal, Form, InputNumber } from 'antd';
import { handleOperate } from 'components/Handle';
import { MonitorInput, rules } from 'components/input';
import getColumns from './columns';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';

@connect(({ pagetable, loading }) => ({
  pagetable,
  loading: loading.models.pagetable,
}))

@Form.create()

export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    list: [],
    modalAddItemVisible: false,
    navItem: null,
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    const { dispatch } = this.props;
    this.setState({
      modalAddItemVisible: false,
    });
    dispatch({
      type: 'pagetable/commonlist',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      this.setState({
        list: pagetable?.commonlist,
      });
    });
  }

  modalAddItemShow = (navItem) => {
    this.setState({ modalAddItemVisible: true });
    this.setState({
      navItem,
    });
    this.props.form.setFieldsValue({
      adName: navItem?.adName,
      linkUrl: navItem?.linkUrl,
      orderNum: navItem?.orderNum,
    });
  }

  modalAddItemCancel = () => {
    this.setState({ modalAddItemVisible: false });
  }
  modalAddItemOk = () => {
    // 这里写接口
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const CommonPcNavVo = { adName: values.adName,
          linkUrl: values.linkUrl,
          orderNum: values.orderNum };
        if (this.state.navItem) {
          CommonPcNavVo.adItemId = this.state.navItem.adItemId;
          handleOperate.call(this, { CommonPcNavVo }, 'pagetable', 'commonupdate', '更新', this.refreshList);
        } else {
          handleOperate.call(this, { CommonPcNavVo }, 'pagetable', 'commonsave', '添加', this.refreshList);
        }
      }
    });
  }

  addItem = () => {
    if (this.state.list && this.state.list.length >= 10) {
      message.error('当前栏目数已达上线，请删除后再添加！');
    } else {
      this.modalAddItemShow(null);
    }
  }

  edit = (navItem) => {
    this.modalAddItemShow(navItem);
  }

  delete = (navItem) => {
    Modal.confirm({
      title: '是否确认删除该栏目？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: handleOperate.bind(this, { CommonPcNavVo: navItem }, 'pagetable', 'commondelete', '删除', this.refreshList),
    });
  }

  render() {
    const { form, loading } = this.props;
    const { list, navItem } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 28 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 20 },
      },
    };
    return (
      <PageHeaderLayout>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Button type="primary" onClick={() => { this.addItem(); }}>添加栏目</Button>
          </div>
          <Table
            loading={loading}
            columns={getColumns(this)}
            dataSource={list}
            pagination={false}
          />
        </Card>
        <Modal
          title={this.state.modalType === 1 ? '添加栏目' : '编辑栏目'}
          visible={this.state.modalAddItemVisible}
          onOk={this.modalAddItemOk}
          confirmLoading={loading}
          onCancel={this.modalAddItemCancel}
          okText="保存"
          width="30%"
        >
          <Form>
            <Form.Item label="名称：" {...formItemLayout}>
              {form.getFieldDecorator('adName', {
                initialValue: navItem?.adName,
                rules: rules([{
                  required: true, message: '请输入名称',
                }]),
              })(
                <MonitorInput maxLength={4} />
              )}
            </Form.Item>
            <Form.Item label="链接：" {...formItemLayout}>
              {form.getFieldDecorator('linkUrl', {
                initialValue: navItem?.linkUrl,
                rules: rules([{
                  required: true, message: '请输入链接',
                }]),
              })(
                <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="排序：" {...formItemLayout}>
              {form.getFieldDecorator('orderNum', {
                initialValue: navItem?.orderNum,
                rules: rules([{
                  required: true, message: '请输入排序',
                }]),
              })(
                <InputNumber style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
