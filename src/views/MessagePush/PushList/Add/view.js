import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Form, Card, Select, Message, Modal } from 'antd';
import { goTo } from 'utils/utils';
import styles from '../../index.less';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { MonitorTextArea } from '../../../../components/input';
// import ImageUpload from '../../../../components/Upload/Image/ImageUpload';
import DetailFooterToolbar from '../../../../components/DetailFooterToolbar';
import CheckboxCascade from '../../../../components/CheckBoxCascade';
import messagePushOptions from '../../attr';

const FormItem = Form.Item;

@connect(({ messagePush, loading }) => ({
  messagePush,
  submitting: loading.effects['messagePush/add'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    pattern: 'add',
    havePhone: false,
    phone: '',
    haveInitPlatformType: false,
    platformType: '',
  };

  componentWillMount() {
    const { location: { search } } = this.props;
    const { phone, platformType } = parse(search?.substring(1));
    if (platformType && phone) {
      this.setState({
        phone,
        havePhone: true,
        haveInitPlatformType: true,
        platformType,
      });
    }
  }
  componentDidMount() {}
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;
    const that = this;
    validateFieldsAndScroll((error, values) => {
      // 对参数进行处理
      if (!error) {
        Modal.confirm({
          title: '短信内容备案提醒',
          content: '请确认短信内容已经跟运营商备案，否则可能发不出去。',
          onOk() {
            const params = {
              task: Object.assign({}, values),
              sendType: values.sendType.sendType,
            };
            params.task.targetCondition = {};
            delete params.task.sendType;
            params.task.targetType = values.targetType.targetType;
            if (Number(values.targetType.targetType) === 6) {
              params.task.targetCondition.phone = values.targetType.phone;
            } else if (Number(values.targetType.targetType) === 5) {
              params.task.targetCondition.phoneFileUrl = values.targetType.phoneFileUrl;
            }
            dispatch({
              type: 'messagePush/add',
              payload: params,
            }).then(() => {
              const { add } = that.props.messagePush;
              if (add) {
                Message.success('提交成功。', 1, () => {
                  goTo('/messagepush/pushlist');
                });
              } else {
                Message.error(`提交失败！${add?.message}`);
              }
            });
          },
        });
      }
    });
  };
  handlePlatformChange = (value) => {
    const { form, location: { search } } = this.props;
    const { phone, platformType } = parse(search?.substring(1));
    if (phone && platformType && Number(platformType) === Number(value)) {
      form.setFieldsValue({
        targetType: 6,
      });
    } else {
      form.setFieldsValue({
        targetType: 0,
      });
    }
  };
  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  };
  render() {
    const { form, submitting } = this.props;
    console.log(this.props);
    const { pattern, havePhone, phone, haveInitPlatformType, platformType } = this.state;
    const disabled = pattern === 'detail';
    const pType = Number(form.getFieldValue('platformType'));
    const tType = form.getFieldValue('targetType');
    const showTips = (Number(tType) === 5 || tType?.targetType === 5);
    const selectOptions = { // CheckboxCascade组件的入参集合
      targetType: [
        { value: 6, label: '单个用户', key: 1, childrenType: 1, childrenName: 'phone', childrenProps: { placeholder: '用户手机号' }, initValue: havePhone ? phone : '' },
        { value: 5, label: '指定手机列表', key: 2, childrenType: 2, childrenName: 'phoneFileUrl', childrenProps: { uploadType: ['txt', 'excel'], maxLength: 1 } },
        { value: 7, label: '全部家居用户', key: 3, childrenType: 0, childrenName: 'fakeName' },
      ],
      sendType: [
        { value: 1, label: '立即推送', key: 1, childrenType: 0, childrenName: 'fakeName' },
        { value: 2, label: '定时推送', key: 2, childrenType: 4, childrenName: 'executeTime', childrenProps: { showTime: true, format: 'YYYY-MM-DD HH:mm:ss' } },
      ],
    };
    const targetType = [
      { value: 6, label: '单个用户', key: 1, childrenType: 1, childrenName: 'phone', childrenProps: { placeholder: '用户手机号' }, initValue: havePhone ? phone : '' },
      { value: 5, label: '指定手机列表', key: 2, childrenType: 2, childrenName: 'phoneFileUrl', childrenProps: { uploadType: ['txt', 'excel'], maxLength: 1 } },
      { value: 1, label: '全部密蜜注册用户', key: 3, childrenType: 0, childrenName: 'fakeName' },
      { value: 2, label: '全部密蜜认证用户', key: 4, childrenType: 0, childrenName: 'fakeName' },
    ];

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
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="业务类型">
              {form.getFieldDecorator('platformType', {
                rules: [{
                  required: true, message: '请选择业务类型',
                }],
                initialValue: haveInitPlatformType ? platformType : null,
              })(
                <Select
                  onChange={this.handlePlatformChange}
                >
                  {messagePushOptions.YWLX.map(v =>
                    <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                  )}
                </Select>
              )}
            </FormItem>
            <div className={styles.formTips}>根据业务类型，会自动在短信内容前面添加标签：家居对应【密蜜家居】，密蜜对应【恒腾密蜜】</div>
            <FormItem {...formItemLayout} label="推送内容">
              {form.getFieldDecorator('content', {
                rules: [{
                  required: true, message: '必填，最多70个字',
                }, {
                  max: 70,
                }],
              })(
                <MonitorTextArea datakey="content" rows={3} maxLength={70} form={form} disabled={disabled} />
              )}
            </FormItem>
            {
              (pType === 2) ? (
                <FormItem {...formItemLayout} label="目标用户">
                  {form.getFieldDecorator('targetType', {
                    rules: [{
                      required: true, message: '请选择目标用户',
                    }],
                    initialValue: havePhone ? 6 : null,
                  })(
                    <CheckboxCascade
                      name="targetType"
                      selectOptions={selectOptions.targetType}
                    />
                  )}
                </FormItem>
              ) : ''
            }
            {
              (pType === 1) ? (
                <FormItem {...formItemLayout} label="目标用户">
                  {form.getFieldDecorator('targetType', {
                    rules: [{
                      required: true, message: '请选择目标用户',
                    }],
                    initialValue: havePhone ? 6 : null,
                  })(
                    <CheckboxCascade
                      name="targetType"
                      selectOptions={targetType}
                    />
                  )}
                </FormItem>
              ) : ''
            }
            {
              showTips ? (
                <div className={styles.formTips}>文件格式要求：支持一行一个手机号，xls、xlsx、txt格式文件</div>
              ) : ''
            }
            <FormItem {...formItemLayout} label="用户说明">
              {form.getFieldDecorator('userDesc', {
                rules: [{
                  max: 70,
                }],
              })(
                <MonitorTextArea
                  datakey="userDesc"
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
              })(
                <CheckboxCascade
                  name="sendType"
                  selectOptions={selectOptions.sendType}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="优先级">
              {form.getFieldDecorator('priority', {
                rules: [],
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
