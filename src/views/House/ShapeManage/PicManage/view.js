/*
 * @Author: wuhao
 * @Date: 2018-09-21 11:17:57
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 20:44:58
 *
 * 房源管理 - 房型管理 - 房型图片管理
 */
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import classNames from 'classnames';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import { Card, Button, Form, message, Spin } from 'antd';
import ImageUpload from 'components/Upload/Image/ImageUpload';

import { goTo } from 'utils/utils';

import styles from './index.less';

const { Item: FormItem } = Form;

@connect(({ roomType }) => ({
  roomType,
}))
@Form.create()
class PicManage extends PureComponent {
  static defaultProps = {};

  state = {
    roomTypeId: this.props?.match?.params?.id || 0,
    loading: false,
  }

  componentDidMount() {
    this.getDetails();
  }

  getDetails = async () => {
    this.setState({
      loading: true,
    });

    const { roomTypeId } = this.state;
    const { dispatch } = this.props;
    await dispatch({
      type: 'roomType/details',
      payload: {
        roomTypeId,
      },
    });
    await dispatch({
      type: 'roomType/getRoomTypeImages',
      payload: {
        roomTypeId,
      },
    });

    this.setState({
      loading: false,
    });
  }

  reqOk = async (values) => {
    this.setState({
      loading: true,
    });

    const { roomTypeId } = this.state;
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'roomType/upDateRoomTypeImage',
      payload: {
        roomTypeId,
        ...values,
      },
    });

    this.setState({
      loading: false,
    });

    if (res) {
      message.success('保存成功！');
      return true;
    }

    return false;
  }

  handleSave = () => {
    const { form } = this.props;
    const { validateFields } = form || {};
    validateFields?.((err, values) => {
      if (err) {
        return;
      }
      this.reqOk(values);
    });
  }

  handleBack = () => {
    goTo('/house/shapemanage');
  }

  render() {
    const { loading } = this.state;
    const { form, roomType } = this.props;
    const roomTypeImages = roomType?.getRoomTypeImages || [];
    const detail = roomType?.details || {};

    return (
      <PageHeaderLayout>
        <Card title={(
          <div className={classNames(styles.pic_manange_header)}>
            <span>房型图片管理</span>
            <span>当前房型：{detail?.roomTypeName}</span>
          </div>
        )}
        >
          <Spin spinning={loading}>
            <Form>
              <FormItem>
                {
                  form.getFieldDecorator('images', {
                    initialValue: roomTypeImages,
                  })(
                    <ImageUpload
                      exclude={['gif']}
                      maxSize={5120}
                      maxLength={900}
                      listType="picture-card"
                      fileList={roomTypeImages}
                      customSort
                    />
                  )
                }
              </FormItem>
            </Form>
          </Spin>
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={_.debounce(this.handleSave, 200)} loading={loading}>保存</Button>
          <Button onClick={this.handleBack}>取消</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default PicManage;
