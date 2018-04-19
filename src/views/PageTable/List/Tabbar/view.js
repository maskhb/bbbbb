import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, message, Modal, Form } from 'antd';
import ImageUpload from 'components/Upload/Image/ImageUpload';
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
    adItem: {},
  };

  componentDidMount() {
    this.refreshList();
  }

  setdefault = (adItem) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '是否确认删除该导航入口？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'pagetable/tabdelete',
          payload: adItem.adItemId,
        }).then(() => {
          const { pagetable } = this.props;
          console.log(pagetable);
        });
      },
    });
  }

  refreshList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pagetable/tablist',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      this.setState({
        list: pagetable?.list,
      });
    });
  }

  modalAddItemShow = (adItem) => {
    this.setState({ modalAddItemVisible: true });
    if (adItem) {
      this.state.adItem = adItem;
      console.log(adItem.picUrl);
      // this.state.fileList = [adItem.picUrl];
    }
  }

  modalAddItemCancel = () => {
    this.setState({ modalAddItemVisible: false });
  }
  modalAddItemOk = () => {
    // 这里写接口
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'pagetable/tabsave',
          payload: { bottomNav: { adName: values.adName, linkUrl: values.linkUrl, orderNum: values.orderNum, picUrl: 'https://123.img', isDefault: 0 } },
        }).then(() => {
          const { pagetable } = this.props;
          console.log(pagetable);
          this.setState({
            list: pagetable?.list,
          });
        });
      }
    });
  }

  addItem = () => {
    if (this.state.list && this.state.list.length >= 5) {
      message('当前栏目数已达上线，请删除后再添加！');
    } else {
      this.modalAddItemShow();
    }
  }

  edit = (adItem) => {
    this.modalAddItemShow(adItem);
  }

  delete = (adItem) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '是否确认删除该导航入口？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'pagetable/tabdelete',
          payload: adItem.adItemId,
        }).then(() => {
          const { pagetable } = this.props;
          console.log(pagetable);
        });
      },
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
          onCancel={this.modalAddItemCancel}
          okText="保存"
          width="30%"
        >
          <Form>
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
                <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="图片：" {...formItemLayout}>
              {form.getFieldDecorator('picUrl', {
                rules: rules([{
                  required: false,
                }]),
              })(
                <ImageUpload
                  exclude={['gif']}
                  maxSize={5120}
                  maxLength={1}
                  fileList={fileList}
                  listType="picture-card"
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
