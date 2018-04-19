/**
 * Created by rebecca on 2018/4/4.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'antd';
import { MonitorInput, rules } from '../../../../components/input';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './homepage.less';

@connect(({ homepage, loading }) => ({
  homepage,
  loading: loading.models.homepage,
}))

@Form.create()

export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    modalTitleVisible: false,
  };

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

  render() {
    const { form } = this.props;
    return (
      <PageHeaderLayout>
        <div className={styles.homecontainer} >
          <div className={styles.title} onClick={() => { this.modalTitleShow(); }}>恒腾密蜜家居</div>
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
      </PageHeaderLayout>
    );
  }
}
