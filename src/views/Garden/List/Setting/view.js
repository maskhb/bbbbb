import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
// import ImageUpload from '../../../../components/Upload/Image/ImageUpload';
import DetailFooterToolbar from '../../../../components/DetailFooterToolbar';
import CommunitySelect from '../../../../components/CommunitySelect';

const FormItem = Form.Item;

@connect(({ garden, loading }) => ({
  garden,
  submitting: loading.effects['garden/add'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };
  static handleCommunityList(allList, checkedList) {
    const result = {};
    allList.forEach((v) => {
      result[v.communityId] = checkedList.indexOf(v.communityId) >= 0 ? 1 : 2;
    });
    return result;
  }

  state = {
    pattern: 'detail',
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.setState({
      pattern: Number(id) === 0 ? 'add' : 'detail',
    });
  }
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => {
      const obj = values.name;
      const params = {
        communityMap: View.handleCommunityList(obj.allCommunityIds, obj.checkedCommunityIds),
        platformType: 3,
      };
      // console.log(params.communityMap);
      // validateFieldsAndScroll((error) => {
      // 对参数进行处理
      if (!error) {
        dispatch({
          type: 'garden/add',
          payload: params,
        }).then(() => {
          // console.log(res);
          // if (add.msgCode === 200 && add.data) {
          //   message.success('提交成功。', 1, () => {
          //     history.back();
          //   });
          // } else {
          //   message.error(`提交失败！${add.message}`);
          // }
        });
      }
    });
  };
  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  };
  render() {
    const that = this;
    const { form, submitting } = that.props;
    const { pattern } = that.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="">
              {form.getFieldDecorator('name', {})(
                <CommunitySelect
                  needInitCheck
                  expandAll
                />
              )}
            </FormItem>
            <DetailFooterToolbar
              form={form}
              // fieldLabels={{}}
              submitting={submitting}
              handleSubmit={this.handleSubmit}
              pattern={pattern}
              handlePatternChange={this.handlePatternChange}
            />
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}