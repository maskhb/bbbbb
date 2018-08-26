/**
 * Created by rebecca on 2018/4/4.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, List, Icon } from 'antd';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import { handleOperate } from 'components/Handle';
import { MonitorInput, rules } from '../../../../components/input';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './mallhome.less';

@connect(({ pagetable, loading }) => ({
  pagetable,
  loading: loading.models.pagetable,
}))

@Form.create()

export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    navList: [],
    modalTitleVisible: false,
    modalAddNavVisible: false,
    fileList: [],
    adItem: {},
    currentItem: {},
    picUrl: '',
  };

  componentDidMount() {
    this.gettitle();
    this.getNavList();
  }

  getNavList = () => {
    this.modalAddNavCancel();
    const { dispatch } = this.props;
    dispatch({
      type: 'pagetable/mallNavList',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      const navList = pagetable?.mallNavList || [];
      if (navList.length < 12) {
        navList.push({ title: '添加' });
      }
      this.setState({
        navList,
      });
    });
  }

  gettitle = () => {
    this.modalTitleCancel();
    const { dispatch } = this.props;
    dispatch({
      type: 'pagetable/mallpagetitle',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      this.setState({
        adItem: pagetable?.mallpagetitle,
      });
    });
  }

  uploadChange = (value) => {
    this.state.picUrl = value;
  }

  modalTitleShow = () => {
    this.setState({ modalTitleVisible: true });
    const { adItem } = this.state;
    this.props.form.setFieldsValue({
      adName: adItem?.adName,
    });
  }
  modalTitleCancel = () => {
    this.setState({ modalTitleVisible: false });
  }
  modalTitleOk = () => {
    // 这里写接口
    const { form } = this.props;
    form.validateFields(['adtitle'], (err, values) => {
      if (!err) {
        const MallPageTitleVo = { adName: values.adtitle, adItemId: this.state.adItem.adItemId };
        handleOperate.call(this, { MallPageTitleVo }, 'pagetable', 'mallupdatetitle', '修改', this.gettitle);
      }
    });
  }

  modalAddNavShow = (item) => {
    this.setState({ modalAddNavVisible: true });
    this.setState({
      currentItem: item,
    });
    this.setState({
      picUrl: item?.picUrl,
    });
    this.props.form.setFieldsValue({
      adName: item?.adName,
      linkUrl: item?.linkUrl,
      orderNum: item?.orderNum,
      picUrl: item?.picUrl,
    });
  }
  modalAddNavCancel = () => {
    this.setState({ modalAddNavVisible: false });
  }
  modalAddNavOk = () => {
    // 这里写接口
    const { form } = this.props;
    const { picUrl } = this.state;
    if (!this.state.currentItem) { // 增加
      form.validateFields(['adName', 'linkUrl', 'orderNum'], (err, values) => {
        if (!err) {
          const MallPageTitleVo = { adName: values.adName,
            orderNum: values.orderNum,
            linkUrl: values.linkUrl,
            picUrl };
          handleOperate.call(this, { MallPageTitleVo }, 'pagetable', 'mallsaveNav', '添加', this.getNavList);
        }
      });
    } else { // 编辑
      form.validateFields(['adName', 'linkUrl', 'orderNum'], (err, values) => {
        if (!err) {
          const MallPageTitleVo = { adName: values.adName,
            linkUrl: values.linkUrl,
            picUrl,
            orderNum: values.orderNum,
            adItemId: this.state.currentItem.adItemId };
          handleOperate.call(this, { MallPageTitleVo }, 'pagetable', 'mallupdateNav', '编辑', this.getNavList);
        }
      });
    }
  }

  addItem = () => {
    this.modalAddNavShow(null);
  }

  editItem = (item) => {
    this.modalAddNavShow(item);
  }

  deleteItem = (item) => {
    Modal.confirm({
      title: '是否确认删除该导航入口？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: handleOperate.bind(this, { MallPageNavVo: item }, 'pagetable', 'malldeleteNav', '删除', this.getNavList),
    });
  }

  render() {
    const { form, loading } = this.props;
    const { fileList, adItem, currentItem } = this.state;

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
        <div className={styles.homecontainer} >
          <div className={styles.title} onClick={() => { this.modalTitleShow(); }}>
            {adItem?.adName}
          </div>
          <div className={styles.position}>banner</div>
          <div className={styles.navArea}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={this.state.navList}
              renderItem={item => (
                <List.Item>
                  { item.title !== '添加' ?
                  (<div className={styles.itemDiv}><Icon className={styles.closeIcon} onClick={() => { this.deleteItem(item); }} type="close-circle" /><img className={styles.icon} src={item.picUrl} alt="" onClick={() => { this.editItem(item); }} /></div>) :
                  (<div className={styles.icon} onClick={() => { this.addItem(); }}>+</div>)}
                  <div>{ item.title !== '添加' ? item.adName : '' }</div>
                </List.Item>
              )}
            />
          </div>
          <div className={styles.position}>店铺展示区域</div>
          <div className={styles.comment}>商品列表</div>
          <div className={styles.bottom}>底部导航</div>
        </div>

        <Modal
          title="编辑标题"
          visible={this.state.modalTitleVisible}
          onOk={this.modalTitleOk}
          confirmLoading={loading}
          onCancel={this.modalTitleCancel}
          okText="保存"
          width="30%"
        >
          <Form layout="inline">
            <Form.Item label="标题：">
              {form.getFieldDecorator('adtitle', {
                rules: rules([{
                  required: true, message: '请输入标题',
                }]),
                initialValue: adItem?.adName,
              })(
                <MonitorInput maxLength={10} />
              )}
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="添加导航入口"
          visible={this.state.modalAddNavVisible}
          onOk={this.modalAddNavOk}
          confirmLoading={loading}
          onCancel={this.modalAddNavCancel}
          okText="保存"
          width="30%"
        >
          <Form>
            <Form.Item label="名称：" {...formItemLayout}>
              {form.getFieldDecorator('adName', {
                initialValue: currentItem?.adName,
                rules: rules([{
                  required: true, message: '请输入名称',
                }]),
              })(
                <MonitorInput maxLength={4} />
              )}
            </Form.Item>
            <Form.Item label="链接：" {...formItemLayout}>
              {form.getFieldDecorator('linkUrl', {
                initialValue: currentItem?.linkUrl,
                rules: rules([{
                  required: true, message: '请输入链接',
                }]),
              })(
                <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="排序：" {...formItemLayout}>
              {form.getFieldDecorator('orderNum', {
                initialValue: currentItem?.orderNum,
                rules: rules([{
                  required: true, message: '请输入排序',
                }]),
              })(
                <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="图片：" {...formItemLayout}>
              {form.getFieldDecorator('picUrl', {
                initialValue: fileList,
                rules: rules([{
                  required: true,
                }]),
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
