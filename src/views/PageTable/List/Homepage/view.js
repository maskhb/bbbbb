/**
 * Created by rebecca on 2018/4/4.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'antd';
import { handleOperate } from 'components/Handle';
import { MonitorInput, rules } from '../../../../components/input';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './homepage.less';

@connect(({ pagetable, loading }) => ({
  pagetable,
  loading: loading.models.pagetable,
}))

@Form.create()

export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    modalTitleVisible: false,
    item: {},
  };

  componentDidMount() {
    this.gettitle();
  }

  gettitle = () => {
    this.modalTitleCancel();
    const { dispatch } = this.props;
    dispatch({
      type: 'pagetable/homegettitle',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      this.setState({
        item: pagetable?.homegettitle,
      });
    });
  }

  modalTitleShow = () => {
    this.setState({ modalTitleVisible: true });
  }

  modalTitleCancel = () => {
    this.setState({ modalTitleVisible: false });
  }

  modalTitleOk = () => {
    // 这里写接口
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const bottomNavVo = { adName: values.adName, adItemId: this.state.item.adItemId };
        handleOperate.call(this, { bottomNavVo }, 'pagetable', 'homeupdatetitle', '修改', this.gettitle);
      }
    });
  }

  render() {
    const { form, loading } = this.props;
    const { item } = this.state;
    return (
      <PageHeaderLayout>
        <div className={styles.homecontainer} >
          <div className={styles.title} onClick={() => { this.modalTitleShow(); }}>
            {item?.adName}
          </div>
          <div className={styles.position}>banner</div>
          <div className={styles.position}>套餐展示区</div>
          <div className={styles.position}>资讯展示区</div>
          <div className={styles.position}>晒家展示区</div>
          <div className={styles.comment}>评论展示区</div>
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
              {form.getFieldDecorator('adName', {
                rules: rules([{
                  required: true, message: '请输入标题',
                }]),
              })(
                <MonitorInput maxLength={10} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
