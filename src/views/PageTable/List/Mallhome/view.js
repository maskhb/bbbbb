/**
 * Created by rebecca on 2018/4/4.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, List, Upload, message, Icon } from 'antd';
import { MonitorInput, rules } from '../../../../components/input';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './mallhome.less';

@connect(({ mallhome, loading }) => ({
  mallhome,
  loading: loading.models.mallhome,
}))

@Form.create()

export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    navList: [
      { imgUrl: 'https://baidu.com', title: '恒腾自营' },
      { imgUrl: 'https://baidu.com', title: '家居百货' },
      { imgUrl: 'https://baidu.com', title: 'TCL彩电' },
      { imgUrl: 'https://baidu.com', title: '温馨家纺' },
      { imgUrl: 'https://baidu.com', title: '恒腾自营' },
      { imgUrl: 'https://baidu.com', title: '家居百货' },
      { imgUrl: 'https://baidu.com', title: 'TCL彩电' },
      { imgUrl: 'https://baidu.com', title: '温馨家纺' },
      { imgUrl: 'https://baidu.com', title: '恒腾自营' },
      { imgUrl: 'https://baidu.com', title: '家居百货' },
      { imgUrl: 'https://baidu.com', title: 'TCL彩电' },
      { imgUrl: 'https://baidu.com', title: '添加' }],
    modalTitleVisible: false,
    modalAddNavVisible: false,
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
    // previewVisible: false,
    // previewImage: '',
    editingItem: {},
    adding: false,
  };


  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  modalTitleShow = () => {
    this.setState({ modalTitleVisible: true });
  }
  modalTitleCancel = () => {
    this.setState({ modalTitleVisible: false });
  }
  modalTitleOk = () => {
    // 这里写接口
    this.props.form.getFieldValue('titleInput');
    this.modalTitleCancel();
  }

  modalAddNavShow = () => {
    this.setState({ modalAddNavVisible: true });
  }
  modalAddNavCancel = () => {
    this.setState({ modalAddNavVisible: false });
  }
  modalAddNavOk = () => {
    // 这里写接口
    // console.log(this.props.form.getFieldValue('IconUpload'));
    if (!this.state.adding) {
      console.log(this.state.editingItem);
    } else {
      console.log('增加', this.props.form);
    }
  }
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isPNG)) {
      message.error('图片格式不符合要求');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5M!');
    }
    return (isJPG || isPNG) && isLt5M;
  }

  handlePreview = (file) => {
    console.log(file);
    // this.setState({
    //   previewImage: file.url || file.thumbUrl,
    //   previewVisible: true,
    // });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  addItem = () => {
    this.modalAddNavShow();
    this.setState({ adding: true });
  }

  editItem = (item) => {
    this.modalAddNavShow();
    this.setState({ editingItem: item });
  }

  deleteItem = (item) => {
    Modal.confirm({
      title: '是否确认删除该导航入口？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        console.log('调用删除接口', item);
      },
    });
  }

  render() {
    const { form } = this.props;
    const { fileList } = this.state;

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

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderLayout>
        <div className={styles.homecontainer} >
          <div className={styles.title} onClick={() => { this.modalTitleShow(); }}>恒腾密蜜家居商城</div>
          <div className={styles.position}>banner</div>
          <div className={styles.navArea}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={this.state.navList}
              renderItem={item => (
                <List.Item>
                  { item.title !== '添加' ?
                  (<div className={styles.itemDiv}><Icon className={styles.closeIcon} onClick={() => { this.deleteItem(item); }} type="close-circle" /><div className={styles.icon} onClick={() => { this.editItem(item); }}>图标</div></div>) :
                  (<div className={styles.icon} onClick={() => { this.addItem(); }}>添加</div>)}
                  <div>{ item.title !== '添加' ? item.title : '' }</div>
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
          onCancel={this.modalTitleCancel}
          okText="保存"
          width="30%"
        >
          <Form layout="inline">
            <Form.Item label="标题：">
              {form.getFieldDecorator('titleInput', {
                rules: rules([{
                  required: true, message: '请输入标题',
                }]),
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
          onCancel={this.modalAddNavCancel}
          okText="保存"
          width="30%"
        >
          <Form>
            <Form.Item label="名称：" {...formItemLayout}>
              {form.getFieldDecorator('nameInput', {
                rules: rules([{
                  required: true, message: '请输入名称',
                }]),
              })(
                <MonitorInput maxLength={4} />
              )}
            </Form.Item>
            <Form.Item label="链接：" {...formItemLayout}>
              {form.getFieldDecorator('LinkInput', {
                rules: rules([{
                  required: true, message: '请输入链接',
                }]),
              })(
                <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="图片：" {...formItemLayout}>
              {form.getFieldDecorator('IconUpload', {
                rules: rules([{
                  required: true,
                }]),
              })(
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={this.beforeUpload}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              )}

            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
