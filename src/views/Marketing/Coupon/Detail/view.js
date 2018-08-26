import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import TabsInfo from '../components/detail/TabsInfo';
import BaseInfo from '../components/detail/BaseInfo';

@connect(({ marketing, loading }) => ({
  marketing,
  loading: loading.models.marketing,
  submitting: (loading.effects['marketing/couponSave'] ||
  loading.effects['marketing/couponUpdate']
  ),
}))

@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {};

  componentDidMount() {
    if (!this.isAdd()) {
      this.initDetail();
    }
  }

  getCrumbTitle() {
    const title = '优惠券';

    if (this.isAdd()) {
      return `新增${title}`;
    } else if (this.isEdit()) {
      return `编辑${title}`;
    }
    return `查看${title}`;
  }

  getPattern() {
    return this.props.pattern || 'detail';
  }

  isAdd() {
    return this.getPattern() === 'add';
  }

  isEdit() {
    return this.getPattern() === 'edit';
  }

  isEditable() {
    return this.isEdit() || this.isAdd();
  }
  initDetail() {
    const { id: couponId } = this.props?.match?.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'marketing/couponDetail',
      payload: {
        couponId,
      },
    });
  }

  render() {
    const { marketing } = this.props;
    const data = marketing?.couponDetail;
    const detail = this.props.pattern === 'detail';

    return (
      <PageHeaderLayout crumbTitle={this.getCrumbTitle()}>
        {
          detail ? (
            <TabsInfo
              {...this.props}
              detailVO={data}
            />
          ) : (
            <BaseInfo
              {...this.props}
              detailVO={data}
            />
          )
        }
      </PageHeaderLayout>
    );
  }
}
