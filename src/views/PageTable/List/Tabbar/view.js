import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, message, Modal, Form, InputNumber } from 'antd';
import ImageUpload from 'components/Upload/Image/ImageUpload';
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
    fileList: [],
    adItem: null,
    picUrl: '',
  };

  componentDidMount() {
    this.refreshList();
  }

  setdefault = (adItem) => {
    const NavDefaultVO = { adItemId: adItem.adItemId, isDefault: 1 };
    Modal.confirm({
      title: '是否确认将该栏目设为默认？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: handleOperate.bind(this, { NavDefaultVO }, 'pagetable', 'tabdefault', '设为默认', this.refreshList),
    });
  }

  uploadChange = (value) => {
    this.state.picUrl = value;
  }

  refreshList = () => {
    const { dispatch } = this.props;
    this.setState({
      modalAddItemVisible: false,
    });
    dispatch({
      type: 'pagetable/tablist',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      this.setState({
        list: pagetable?.tablist,
      });
    });
  }

  modalAddItemShow = (adItem) => {
    this.setState({ modalAddItemVisible: true });
    this.setState({
      adItem,
    });
    this.setState({
      picUrl: adItem?.picUrl,
    });
    this.props.form.setFieldsValue({
      adName: adItem?.adName,
      linkUrl: adItem?.linkUrl,
      orderNum: adItem?.orderNum,
      picUrl: adItem?.picUrl,
    });
  }

  modalAddItemCancel = () => {
    this.setState({ modalAddItemVisible: false });
  }
  modalAddItemOk = () => {
    // 这里写接口
    const { form } = this.props;
    const { picUrl } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const BottomNavVo = { adName: values.adName,
          linkUrl: values.linkUrl,
          orderNum: values.orderNum,
          picUrl,
          isDefault: 2 };
        if (this.state.adItem) {
          BottomNavVo.adItemId = this.state.adItem.adItemId;
          handleOperate.call(this, { BottomNavVo }, 'pagetable', 'tabupdate', '更新', this.refreshList);
        } else {
          handleOperate.call(this, { BottomNavVo }, 'pagetable', 'tabsave', '添加', this.refreshList);
        }
      }
    });
  }

  addItem = () => {
    if (this.state.list && this.state.list.length >= 5) {
      message.error('当前栏目数已达上线，请删除后再添加！');
    } else {
      this.modalAddItemShow(null);
    }
  }

  edit = (adItem) => {
    this.modalAddItemShow(adItem);
  }

  delete = (adItem) => {
    Modal.confirm({
      title: '是否确认删除该导航入口？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: handleOperate.bind(this, { BottomNavVo: adItem }, 'pagetable', 'tabdelete', '删除', this.refreshList),
    });
  }

  render() {
    const { form, loading } = this.props;
    const { list, fileList, adItem } = this.state;
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
          <Form >
            <Form.Item label="名称：" {...formItemLayout}>
              {form.getFieldDecorator('adName', {
                initialValue: adItem?.adName,
                rules: rules([{
                  required: true, message: '请输入名称',
                }]),
              })(
                <MonitorInput maxLength={4} />
              )}
            </Form.Item>
            <Form.Item label="链接：" {...formItemLayout}>
              {form.getFieldDecorator('linkUrl', {
                initialValue: adItem?.linkUrl,
                rules: rules([{
                  required: true, message: '请输入链接',
                }]),
              })(
                <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="排序：" {...formItemLayout}>
              {form.getFieldDecorator('orderNum', {
                initialValue: adItem?.orderNum,
                rules: rules([{
                  required: true, message: '请输入排序',
                }]),
              })(
                <InputNumber style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item label="图片：" {...formItemLayout}>
              {form.getFieldDecorator('picUrl', {
                rules: rules([{
                  required: true,
                }]),
                initialValue: fileList,
              })(
                <ImageUpload
                  exclude={['gif']}
                  maxSize={5120}
                  maxLength={1}
                  action="/api/upload/img"
                  fileList={fileList}
                  listType="picture-card"
                  uploadChange={this.uploadChange}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
