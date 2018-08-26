import DetailFooterToolbar from 'components/DetailFooterToolbar';
import React, { Component } from 'react';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import { formatBirthDay, format } from 'components/Const';
import moment from 'moment';
import SelectRegion from 'components/SelectRegion/business';
import { connect } from 'dva';
import { parse } from 'qs';
import { fenToYuan } from 'utils/money';
import { handleOperate } from 'components/Handle';
import {
  Card,
  Table,
  Form,
  message,
  Radio,
  DatePicker,
  Col,
  Row,
  InputNumber,
  Select,
  Modal,
  // Spin,
} from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput, rules, MonitorTextArea } from 'components/input';
import { goTo } from 'utils/utils';
import getColumns from '../List/column';
import styles from './Detail.less';

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
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ member, wallet, predeposit, loading }) => ({
  member,
  wallet,
  predeposit,
  loading: loading.models.member || loading.models.wallet || loading.models.predeposit,
}))
@Form.create()

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.onUnload = this.onUnload.bind(this); //  bind callback to this
  }
  state = {
    pattern: 'add',
    fileList: [],
    confirmDirty: false,
    walletShow: false,
    modalPeriodVisible: false,
    modalChargeVisible: false,
    rangePickerStyle: {
      style: {
        width: 'auto',
      },
    },
  };

  componentWillMount() {
    const { match: { path, params: { id } } } = this.props;
    const type = path.split('/')[path.split('/').length - 2].toLowerCase();
    this.setState({ pattern: type, id });

    setTimeout(() => this.scrollToAnchor(), 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { pattern, id } = this.state;
    const accountId = Number(id);
    const pagination = {
      currPage: 1,
      pageSize: 10,
    };
    // if (pattern === 'edit' || pattern === 'detail') {
    //   dispatch({
    //     type: 'member/detail',
    //     payload: { accountId: Number(id) },
    //   });
    // }

    if (pattern !== 'edit' && pattern !== 'add') {
      dispatch({
        type: 'member/detail',
        payload: { accountId: Number(id) },
      });
      dispatch({
        type: 'wallet/dealwallet',
        payload: {
          dealParamVo: {
            accountId: Number(id),
            currPage: 1,
            pageSize: 10,
          },
        },
      });
      dispatch({
        type: 'predeposit/dealpredeposit',
        payload: {
          dealParamVo: {
            accountId: Number(id),
            currPage: 1,
            pageSize: 10,
          },
        },
      });
      dispatch({
        type: 'member/cart',
        payload: {
          accountId,
          cartType: 0,
          pagination,
        },
      });
      dispatch({
        type: 'member/address',
        payload: {
          accountId,
        },
      });
      dispatch({
        type: 'member/accountDetail',
        payload: {
          accountId,
        },
      });
    } else if (pattern === 'edit') {
      dispatch({
        type: 'member/detail',
        payload: {
          accountId,
        },
      });
    }

    if (pattern === 'edit' || pattern === 'add') {
      window.addEventListener('beforeunload', this.onUnload);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  onUnload = (e) => {
    // e.cancelable = false;
    // const n = window.event.screenX - window.screenLeft;
    // const b = n > document.documentElement.scrollWidth - 20;

    // console.log(e);
    // if (!(b && window.event.clientY < 0 || window.event.altKey)) {
    e.returnValue = '是否继续关闭';
    // Modal.warning({
    //   title: '关闭页面，数据不保留，注意！',
    //   content: '是否继续关闭',
    //   onOk() {
    //     window.close();
    //   },
    //   okText: '关闭',
    //   cancelText: '不关闭',
    // })
    // }
  }
  setPeriod = (record) => {
    this.modalPeriodShow(record);
  }

  walletTopUp = (record) => {
    this.modalChargeShow(record);
  }

  modalChargeCancel = () => {
    this.setState({ modalChargeVisible: false });
  }

  walletHandlePageChange = (pagination) => {
    const { dispatch } = this.props;
    const { id } = this.state;
    const accountId = Number(id);
    const currPage = pagination.current;
    const pageSize = pagination.pageSize; //eslint-disable-line
    // delete page.total;
    // delete page.current;
    dispatch({
      type: 'wallet/dealwallet',
      payload: {
        walletParamVo: {
          accountId,
          currPage,
          pageSize,
        },
      },
    });
  }

  preDepositHandlePageChange = (pagination) => {
    const { dispatch } = this.props;
    const { id } = this.state;
    const accountId = id;
    const currPage = pagination.current;
    const pageSize = pagination.pageSize; //eslint-disable-line
    // delete page.total;
    // delete page.current;
    dispatch({
      type: 'predeposit/dealpredeposit',
      payload: {
        dealParamVo: {
          accountId,
          currPage,
          pageSize,
        },
      },
    });
  }

  handlePatternChange = () => {
    const self = this;
    const { pattern } = self.state;
    self.setState({
      pattern: pattern === 'add' ? 'edit' : 'add',
    });
  }

  handleOnChange = (date, dateString) => {
    return { date, dateString };
  }

  handleConfirmBlur = (e) => {
    const { value } = e;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword = (val) => {
    const reg1 = /^[0-9A-Za-z]{6,12}$/; // 6-12位的数字、小写字符和大写字母组成
    const reg2 = /^[0-9]{6,12}$/; // 不包含数字（就是只包含大小写字母）
    const reg3 = /^[A-Z]{6,12}$/; // 不包含大写字母（就是只包含数字和小写）
    const reg4 = /^[a-z]{6,12}$/; // 不包含小写字母（就是只包含数字和大写）

    if (!reg1.test(val)) return false;
    if (reg2.test(val)) return false;
    if (reg3.test(val)) return false;
    if (reg4.test(val)) return false;
    return true;
  }

  checkName = (val) => {
    const reg1 = /^[0-9A-Za-z]{4,20}$/; // 4-20位的数字、小写字符和大写字母组成
    const reg2 = /^[0-9]{4,20}$/; // 不包含数字（就是只包含大小写字母）
    const reg3 = /^[A-Z]{4,20}$/; // 不包含大写字母（就是只包含数字和小写）
    const reg4 = /^[a-z]{4,20}$/; // 不包含小写字母（就是只包含数字和大写）

    if (reg1.test(val)) return false;
    if (!reg2.test(val)) return false;
    if (reg3.test(val)) return false;
    if (reg4.test(val)) return false;
    return true;
  }
  checkPhone = (rule, value, callback) => {
    const reg = /^((1[3-8][0-9])+\d{8}){11}$/;
    if (value && !reg.test(value)) {
      callback('手机格式不正确');
    }
    callback();
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    }
    callback();
  }
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { checkPassword } = this;
    if (value && !checkPassword(value)) {
      callback('密码格式错误');
    }
    if (value === form.getFieldValue('oldPassword')) {
      callback('新密码不能与旧密码相同');
    }
    if (checkPassword(value) && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  // checkLocation = (rule, value, callback) => {
  //   const address = value?.value?.[3];
  //   const { length } = value?.value;

  //   if (!address || length < 4) {
  //     callback('请选择完整省市区信息');
  //   }
  //   callback();
  // }
  scrollToAnchor = () => {
    const { cartAnchor } = parse(this.props?.location?.search, {
      ignoreQueryPrefix: true,
    }) || {};
    if (cartAnchor) {
      const anchorElement = document.getElementById('cartAnchor');
      if (anchorElement) anchorElement.scrollIntoView();
    }
  }

  validateAmount = (rule, value, callback) => {
    if (value && value > 10000) {
      callback('请注意充值金额已超过1万元！');
    }
    callback();
  }

  modalPeriodShow = () => {
    this.setState({ modalPeriodVisible: true });
  }

  modalPeriodCancel = () => {
    this.setState({ modalPeriodVisible: false });
  }

  modalChargeShow = (record) => {
    this.setState({ modalChargeVisible: true });
    if (record) {
      this.props.form.setFieldsValue({
        amount: '',
        remarks: '',
      });
    }
  }

  modalPeriodOk = () => {
    const { form } = this.props;
    const { id } = this.state;

    form.validateFields(['validatePeriod'], (err, values) => {
      if (!err) {
        const validateperiod = {
          accountId: Number(id),
          validityStart: new Date(values?.validatePeriod[0]).getTime(),
          validityEnd: new Date(values?.validatePeriod[1]).getTime(),
        };
        handleOperate.call(this, validateperiod, 'predeposit', 'validpredeposit', '设置有效期');
      }
    });
  }

  modalChargeOk = () => {
    const { form, member } = this.props;
    const { mobile } = member?.detail;


    form.validateFields(['amount', 'remarks'], (err, values) => {
      if (!err) {
        const chargeinfo = {
          accountMobile: mobile,
          amount: values?.amount * 100,
          remarks: values?.remarks,
        };
        handleOperate.call(this, chargeinfo, 'wallet', 'rechargewallet', '充值');
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const self = this;
    const { form, dispatch } = self.props;
    const { pattern } = self.state;
    const { id } = this.state;
    const { validateFieldsAndScroll } = form;

    if (pattern === 'edit') {
      validateFieldsAndScroll((error, values) => {
        const data = values;
        const birthday = moment(values.birthday).valueOf() || null;
        const regionId = data.location?.value[2];
        delete data.birthday;
        delete data.location;
        // 对参数进行处理
        if (!error) {
          dispatch({
            type: 'member/update',
            payload: {
              accountId: Number(id),
              birthday,
              regionId,
              ...values,
            },
          }).then(() => {
            const { update } = this.props?.member;
            if (update === null) {
              message.error('编辑失败');
            } else {
              message.success('编辑成功。');
              goTo('/member/list');
            }
          });
        }
      });
    } else {
      validateFieldsAndScroll((error, values) => {
        const data = values;
        const birthday = moment(values.birthday).valueOf() || null;
        const regionId = data.location?.value[2] || null;
        delete data.birthday;
        delete data.location;
        // 对参数进行处理
        if (!error) {
          dispatch({
            type: 'member/add',
            payload: {
              birthday,
              regionId,
              ...values,
            },
          }).then(() => {
            const { add } = this.props?.member;
            if (add === null) {
              message.error('新增失败');
            } else {
              message.success('新增成功。');
              goTo('/member/list');
            }
          });
        }
      });
    }
  }

  /* 账号信息 */
  renderContact = () => {
    const self = this;
    const { handleSubmit, checkName, compareToFirstPassword,
      validateToNextPassword, checkPhone, handleConfirmBlur } = self;
    const { pattern } = self.state;
    const { form, member, loading } = self.props;
    const detail = (pattern === 'detail');
    const data = member?.detail;

    return (
      <div>
        <Card title="账号" className={styles.card} bordered={false} loading={loading}>
          <Form onSubmit={handleSubmit} layout="horizontal">
            <Form.Item {...formItemLayout} label="登录名：">
              { form.getFieldDecorator('loginName', {
                rules: [{
                  required: true, message: '请输入登录名',
                }],
                validator: checkName,
                initialValue: data?.loginName,
              })(
                detail ? <span>{ data?.loginName }</span> : <MonitorInput simple="true" placeholder="4-20位数字或英文字符" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="手机号：">
              { form.getFieldDecorator('mobile', {
                rules: [{
                  required: true, message: '请输入手机号',
                }],
                validator: checkPhone,
                initialValue: data?.mobile,
              })(
                detail ? <span>{ data?.mobile }</span> : <MonitorInput maxLength={11} simple="true" placeholder="数字，11位" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="密码：">
              { form.getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }],
                validator: validateToNextPassword,
                initialValue: data?.password,
              })(
                detail ? <span>{ data?.password }</span> : <MonitorInput type="password" simple="true" placeholder="6-12位，英文或数字不限" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="确认密码：">
              { form.getFieldDecorator('confirmPassword', {
                rules: [{
                  required: true, message: '请再次输入密码',
                }],
                validator: compareToFirstPassword,
                initialValue: data?.repeat_password,
              })(
                detail ? <span>{ data?.repeat_password }</span> : <MonitorInput type="password" onBlur={handleConfirmBlur} placeholder="与密码保持一致" />
              )}
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }


  /* 基本信息 */
  renderInfo = () => {
    const { fileList, pattern } = this.state;
    const { handleOnChange } = this;
    const { form, member, loading } = this.props;
    const detail = pattern === 'detail';
    const data = member?.detail;

    return (
      <div>
        <Card title="基本信息" className={styles.card} loading={loading} bordered={false}>
          <Form layout="horizontal">
            <Form.Item {...formItemLayout} label="真实姓名：">
              { form.getFieldDecorator('realName', {
                initialValue: data?.realName,
              })(
                detail ? <span>{ data?.realName }</span> : <MonitorInput minLength={20} simple="true" placeholder="最多20个字" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="昵称：">
              { form.getFieldDecorator('nickName', {
                initialValue: data?.nickName,
              })(
                detail ? <span>{ data?.nickName }</span> : <MonitorInput minLength={6} simple="true" placeholder="最多20个字" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="性别：">
              {form.getFieldDecorator('gender', {
                initialValue: data?.gender,
                })(
                  detail ? (
                    <span> { data?.gender === '1' ? '男' : '女' }</span>
                ) : (
                  <RadioGroup>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                  </RadioGroup>
                  )
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="出生日期：">
              { form.getFieldDecorator('birthday', {
                initialValue: moment(data?.birthday),
              })(
                detail ? <span>{ <DatePicker showTime format="YYYY-MM-DD" onChange={handleOnChange} /> }</span> : <DatePicker showTime format="YYYY-MM-DD" onChange={handleOnChange} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="上传头像：">
              {form.getFieldDecorator('avatarUrl', {
                initialValue: data?.avatarUrl,
                })(
                  detail ? (
                    <img
                      src={data?.avatarUrl}
                      alt={data?.avatarUrl}
                      style={{ width: 130, height: 130 }}
                    />
                ) : (
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                )
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="邮箱：">
              { form.getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '请输入邮箱正确格式',
                }],
                initialValue: data?.email,
              })(
                detail ? <span>{ data?.email }</span> :
                <MonitorInput type="email" simple="true" placeholder="按邮箱@格式填写" />
              )}
            </Form.Item>
            <Row type="flex">
              <Col span="8" offset="2">
                {
                  detail ? (
                    <Form.Item label="联系地址：" {...formItemLayout} >
                      {form.getFieldDecorator('address', { initialValue: data?.regionInfo + data?.address })(<span> {data?.regionInfo + data?.address} </span>)}
                    </Form.Item>
                  ) : (
                    <Form.Item {...formItemLayout} label="地址：" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                      {
                        form.getFieldDecorator('location', {
                          initialValue: data?.regionId ?
                          [data?.provinceId, data?.cityId, data?.regionId] : null,
                         })(
                           <SelectRegion placeholder="请选择所在地区" depth={3} />
                      )}
                    </Form.Item>
                  )
                }
              </Col>
              <Col span="12">
                {
                  detail ? '' : (
                    <Form.Item
                      {...formItemLayout}
                      labelCol={{ span: 2 }}
                      wrapperCol={{ span: 10 }}
                    >
                      {form.getFieldDecorator('address', { initialValue: data?.address })(
                        <MonitorInput maxLength={30} simple="true" placeholder="最多30个字" />
                    )}
                    </Form.Item>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }

  renderDetailInfo = () => {
    const self = this;
    const { member, loading } = self.props;
    const data = member?.detail;
    let thirdBinds;
    (data?.thirdBinds || []).forEach((v, i) => { //eslint-disable-line
      if (v.bindType === 1) {
        thirdBinds = v;
      }
      return thirdBinds;
    });

    return (
    // <Spin loading={loading}>
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="基本信息" className={styles.card} loading={loading} bordered={false}>
              <Form layout="vertical">
                <Form.Item {...formItemLayout} label="userId：">
                  <span>{ data?.accountId }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="登录名：">
                  <span>{ data?.loginName }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="激活状态：">
                  <span>{ data?.memberStatusName}</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="手机号：">
                  <span>{ data?.mobile }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="账号来源：">
                  <span>{ data?.channelName }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="注册时间：">
                  <span>{ (data?.registerTime) ? moment(data.registerTime).format(formatBirthDay) : '' }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="头像：">
                  {
                    data?.avatarUrl ? <img src={data?.avatarUrl} alt={data?.avatarUrl} style={{ width: 130, height: 130 }} /> : ''
                  }
                </Form.Item>
                <Form.Item {...formItemLayout} label="真实姓名：">
                  { data?.realName ? <span>{ data?.realName }</span> : ''}
                </Form.Item>
                <Form.Item {...formItemLayout} label="昵称：">
                  { data?.nickName ? <span>{ data?.nickName }</span> : ''}
                </Form.Item>
                <Form.Item {...formItemLayout} label="性别：">
                  { data?.genderName ? <span>{ data?.genderName }</span> : ''}
                </Form.Item>
                <Form.Item {...formItemLayout} label="出生日期：">
                  { data?.birthday ? <span> {moment(data.birthday).format(formatBirthDay)}</span> : ''}
                </Form.Item>
                <Form.Item {...formItemLayout} label="邮件：">
                  { data?.email ? <span>{ data?.email }</span> : ''}
                </Form.Item>
                <Form.Item {...formItemLayout} label="联系地址：">
                  { (data?.regionInfo || data?.address) ? <span>{ data?.regionInfo + data?.address }</span> : '' }
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="微信账号信息" className={styles.card} loading={loading} bordered={false}>
              <Form layout="vertical">
                <Form.Item {...formItemLayout} label="微信昵称：">
                  <span>{ thirdBinds?.thirdName }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="微信OpenId：">
                  <span>{ thirdBinds?.openId }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="微信UnionId：">
                  <span>{ thirdBinds?.unionId }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="最后更新时间">
                  <span>{ moment(thirdBinds?.updateTime).format(format) }</span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="微信头像：">
                  {
                    thirdBinds?.thirdAvatar ?
                      <img src={thirdBinds?.thirdAvatar} alt={thirdBinds?.thirdAvatar} style={{ width: 130, height: 130 }} /> : ''
                  }
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    // </Spin>
    );
  }

  renderAccount = () => {
    const self = this;
    const { loading, wallet, predeposit, searchDefault, member, form } = self.props;
    const { accountDetail } = member;
    const { preDepositVo, walletVo } = accountDetail || {};
    const { walletShow, modalChargeVisible, modalPeriodVisible, rangePickerStyle } = this.state;
    const { walletTopUp, setPeriod, walletHandlePageChange, preDepositHandlePageChange } = this;
    const { dealwallet } = wallet;
    const { dealpredeposit } = predeposit;
    const walletBalance = fenToYuan(walletVo?.balance);
    const preDepositBalance = fenToYuan(preDepositVo?.balance);
    const validityStart = moment(preDepositVo?.validityStart).format(formatBirthDay);
    const validityEnd = moment(preDepositVo?.validityEnd).format(formatBirthDay);

    return (
      <Card title="会员账户" className={styles.card} bordered={false}>
        <div style={{ marginBottom: 20 }}>
          <Select
            defaultValue={0}
            onChange={(val) => {
               if (val === 1) {
                 this.setState({ walletShow: true });
                } else {
                  this.setState({ walletShow: false });
                }
            }}
          >
            <Option value={0}>预存款账户</Option>
            <Option value={1}>钱包账户</Option>
          </Select>
          {
            walletShow ? <span style={{ display: 'inline-block', marginLeft: '20px' }}>余额 { walletBalance } 元， <a onClick={() => walletTopUp(self)}>充值</a></span> :
            <span style={{ display: 'inline-block', marginLeft: '20px' }}>余额 { preDepositBalance } 元， 有效期 {validityStart} ~ {validityEnd} <a onClick={() => setPeriod(self)}>修改有效期</a></span>
          }
        </div>
        <Modal
          title="预存款有效期"
          visible={modalPeriodVisible}
          onOk={this.modalPeriodOk}
          onCancel={this.modalPeriodCancel}
          okText="确定"
          width="20%"
          confirmLoading={loading}
        >
          <p>说明: 预存款账户不分笔，只有一个有效期</p>
          <Form>
            <Form.Item label="有效期：">
              {form.getFieldDecorator('validatePeriod', {
                rules: rules([{
                  required: true, message: '请设置有效期',
                }]),
              })(
                <RangePicker
                  {...rangePickerStyle}
                  showTime
                  placeholder={['开始时间', '结束时间']}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="钱包充值"
          visible={modalChargeVisible}
          onOk={this.modalChargeOk}
          onCancel={this.modalChargeCancel}
          confirmLoading={loading}
          okText="确定"
          width="20%"
        >
          <p>说明: 确定后，钱包充值成功，请谨慎操作。每次充值最大数量为10万元。输入数字，最多2位小数</p>
          <Form>
            <Form.Item label="充值金额">
              { form.getFieldDecorator('amount', {
                rules: [{
                  required: true, message: '请输入充值金额',
                }],
              })(
                <InputNumber
                  min={0}
                  max={100000}
                  step={0.01}
                  precision={2}
                  onChange={(value) => {
                    if (value && value > 10000) {
                      message.warning('请注意充值金额已超过1万元');
                    }
                  }}
                />
              )}
              <span style={{ float: 'right' }}>当前余额: {walletBalance} 元</span>
            </Form.Item>
            <Form.Item label="备注">
              {
                form.getFieldDecorator('remarks', {
                  rules: rules([{
                    message: '请输入备注',
                  }, {
                    max: 30,
                  }]),
                })(
                  <MonitorTextArea rows={6} maxLength={30} form={form} datakey="remarks" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
        {
          walletShow ? (
            <Table
              rowKey="walletTable"
              loading={loading}
              bordered
              columns={getColumns(this, searchDefault).wallet}
              dataSource={dealwallet?.list}
              pagination={dealwallet?.pagination}
              onChange={walletHandlePageChange}
            />
          ) : (
            <Table
              rowKey="predepositTable"
              loading={loading}
              bordered
              columns={getColumns(this, searchDefault).predeposit}
              dataSource={dealpredeposit?.list}
              pagination={dealpredeposit?.pagination}
              onChange={preDepositHandlePageChange}
            />
          )
        }
      </Card>
    );
  }

  // renderAccountCoupon = () => {
  //   const self = this;
  //   const { loading, member, searchDefault } = self.props;

  //   return (
  //     <Card title="会员优惠券" className={styles.card} bordered={false}>
  //       <Table
  //         rowKey="couponTable"
  //         loading={loading}
  //         bordered
  //         columns={getColumns(this, searchDefault).coupon}
  //         dataSource={member?.log?.log}
  //         pagination={member?.log?.pagination}
  //       />
  //     </Card>
  //   );
  // }

  renderAccountCart = () => {
    const self = this;
    const { loading, member, searchDefault } = self.props;

    return (
      <div id="cartAnchor">
        <Card title="会员购物车" className={styles.card} bordered={false}>
          <Table
            rowKey="cartTable"
            loading={loading}
            bordered
            columns={getColumns(this, searchDefault).cart}
            dataSource={member?.cart?.list}
            pagination={member?.cart?.pagination}
          />
        </Card>
      </div>
    );
  }

  renderAccountAddress = () => {
    const self = this;
    const { loading, member, searchDefault } = self.props;

    return (
      <Card title="会员收货地址" className={styles.card} bordered={false}>
        <Table
          rowKey="addressTable"
          loading={loading}
          bordered
          columns={getColumns(this, searchDefault).address}
          dataSource={member?.address}
        />
      </Card>
    );
  }

  render() {
    const self = this;
    const { renderInfo, renderContact, renderDetailInfo, handleSubmit, handlePatternChange,
      renderAccount, renderAccountCart, renderAccountAddress } = self;
    const { pattern } = self.state;
    const { form } = self.props;

    switch (pattern) {
      case 'add':
        return (
          <PageHeaderLayout>
            {renderContact()}
            {renderInfo()}
            <DetailFooterToolbar
              form={form}
              handleSubmit={handleSubmit}
              pattern={pattern}
              handlePatternChange={handlePatternChange}
            />
          </PageHeaderLayout>
        );
      case 'edit':
        return (
          <PageHeaderLayout>
            {renderInfo()}
            <DetailFooterToolbar
              form={form}
              handleSubmit={handleSubmit}
              pattern={pattern}
              handlePatternChange={handlePatternChange}
            />
          </PageHeaderLayout>
        );

      case 'detail':
        return (
          <PageHeaderLayout>
            {renderDetailInfo()}
            {renderAccount()}
            {renderAccountCart()}
            {renderAccountAddress()}
          </PageHeaderLayout>
        );
      default:
        return <div>kkk</div>;
    }
  }
}
