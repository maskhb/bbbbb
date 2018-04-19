import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Select } from 'antd';
import styles from '../../index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { MonitorTextArea } from '../../../../components/input';
// import ImageUpload from '../../../../components/Upload/Image/ImageUpload';
import DetailFooterToolbar from '../../../../components/DetailFooterToolbar';
import CheckboxCascade from '../../../../components/CheckBoxCascade';
import messagePushOptions from '../../attr';

const FormItem = Form.Item;

@connect(({ goodsBrand, loading }) => ({
  goodsBrand,
  submitting: loading.effects['goodsBrand/add'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    pattern: 'detail',
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.setState({
      pattern: Number(id) === 0 ? 'add' : 'detail',
    });
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (Number(id) !== 0) {
      dispatch({
        type: 'goodsBrand/detail',
        payload: { id, brandId: id },
      });
    }
  }
  handleSubmit = () => {
    // const { form, dispatch, goodsBrand, match: { params: { id } } } = this.props;
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;
    // const data = goodsBrand?.[`detail${id}`];

    // validateFieldsAndScroll((error, values) => {
    validateFieldsAndScroll((error) => {
      // 对参数进行处理
      if (!error) {
        // dispatch({
        //   type: 'goodsBrand/add',
        //   payload: {
        //     brand: {
        //       brandId: data?.brandId,
        //       ...values,
        //       supplierList: data?.supplierList,
        //       brandDocList: [],
        //       logo: values.logo?.[0],
        //     },
        //   },
        // }).then(() => {
        //   const { add } = this.props.goodsBrand;
        //   if (add.msgCode === 200 && add.data) {
        //     message.success('提交成功。', 1, () => {
        //       history.back();
        //     });
        //   } else {
        //     message.error(`提交失败！${add.message}`);
        //   }
        // });
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
    const { form, submitting, goodsBrand, match: { params: { id } } } = that.props;
    const { pattern } = that.state;
    const disabled = pattern === 'detail';
    const data = goodsBrand?.[`detail${id}`];
    const selectOptions = { // CheckboxCascade组件的入参集合
      url: [
        { value: 1, label: '单个用户', key: 1, childrenType: 1, childrenName: 'cname1', childrenProps: { placeholder: '第一个' } },
        { value: 2, label: '指定手机列表', key: 2, childrenType: 3, childrenName: 'cname2', childrenProps: { min: 2, max: 10, defaultValue: 5 } },
        { value: 3, label: '日期时间选择框', key: 3, childrenType: 4, childrenName: 'cname3' },
        { value: 4, label: '日期范围选择框', key: 4, childrenType: 5, childrenName: 'cname4', childrenProps: { placeholder: ['开始时间', '结束时间'], showTime: true, format: 'YYYY-MM-DD HH:mm:ss' } },
      ],
      sendType: [
        { value: 1, label: '立即推送', key: 1, childrenType: 0, childrenName: 'fakeName' },
        { value: 2, label: '定时推送', key: 2, childrenType: 4, childrenName: 'cname4', childrenProps: { min: 2, max: 10, defaultValue: 5 } },
      ],
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
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
            <FormItem {...formItemLayout} label="业务类型">
              {form.getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请选择业务类型',
                }],
                initialValue: data?.name,
              })(
                <Select>
                  {messagePushOptions.YWLX.map(v =>
                    <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                  )}
                </Select>
              )}
            </FormItem>
            <div className={styles.formTips}>根据业务类型，会自动在短信内容前面添加标签：家居对应【密蜜家居】，密蜜对应【恒腾密蜜】</div>
            <FormItem {...formItemLayout} label="推送内容">
              {form.getFieldDecorator('category', {
                rules: [{
                  required: true, message: '必填，最多70个字',
                }, {
                  max: 70,
                }],
                initialValue: data?.category,
              })(
                <MonitorTextArea datakey="category" rows={3} maxLength={70} form={form} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="目标用户">
              {form.getFieldDecorator('url', {
                rules: [{
                  required: true, message: '请选择目标用户',
                }],
              })(
                <CheckboxCascade
                  name="url"
                  selectOptions={selectOptions.url}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="用户说明">
              {form.getFieldDecorator('orderNum', {
                rules: [{
                  max: 70,
                }],
                initialValue: data?.orderNum,
              })(
                <MonitorTextArea
                  datakey="orderNum"
                  rows={3}
                  maxLength={200}
                  form={form}
                  disabled={disabled}
                  placeholder="备注说明是哪些用户，什么类别的，方便后续追溯理解"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="推送时间">
              {form.getFieldDecorator('sendType', {
                rules: [{
                  required: true, message: '请选择推送时间',
                }],
                initialValue: data?.url,
              })(
                <CheckboxCascade
                  name="sendType"
                  selectOptions={selectOptions.sendType}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="优先级">
              {form.getFieldDecorator('first', {
                rules: [],
                initialValue: data?.first,
              })(
                <Select>
                  {messagePushOptions.YXJ.map(v =>
                    <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                  )}
                </Select>
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
