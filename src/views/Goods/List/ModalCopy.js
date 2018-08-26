import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Checkbox } from 'antd';
import { listToOptions } from 'components/DataTransfer';

const CheckboxGroup = Checkbox.Group;

@Form.create()
@connect(({ business }) => ({
  business,
}))
class ModalCopy extends PureComponent {
  componentWillMount() {
    const { dispatch, unionMerchantId } = this.props;

    dispatch({
      type: 'business/queryList',
      payload: {
        unionMerchantId,
      },
    });
  }

  render() {
    const { business, visible, onCancel, onOk, form, loading, ...p } = this.props;
    const { getFieldDecorator } = form;

    business.queryList = [
      {
        merchantId: 1,
        merchantName: 'x1',
      },
      {
        merchantId: 2,
        merchantName: 'x2',
      },
    ];

    const options = listToOptions(
      business?.queryList || [],
      'merchantId',
      'merchantName',
    );

    return (
      <Modal
        visible={visible}
        title="复制给经销商"
        confirmLoading={loading}
        okText="确定"
        onCancel={onCancel}
        onOk={() => {
          onOk();
        }}
        {...p}
      >
        <Form layout="vertical" hideRequiredMark>
          <Form.Item label="请选择目标经销商">
            {getFieldDecorator('menchantIds', {
              rules: [{
                required: true, message: '请选择目标经销商',
              }],
            })(
              <CheckboxGroup options={options} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ModalCopy;
