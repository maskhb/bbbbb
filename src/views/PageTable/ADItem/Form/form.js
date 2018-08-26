import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getMillisecondForSecondArr } from 'utils/datetime';
import { Form, Card, InputNumber, message, Radio, Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput } from 'components/input';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import CommunitySelectBtn from 'components/CommunitySelectBtn';
import { listToOptions, optionsToHtml } from '../../../../components/DataTransfer';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ ad, adPos, loading }) => ({
  ad,
  adPos,
  submitting: loading.effects['ad/add'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    pattern: 'detail',
    fileList: [],
    communityList: [],
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.setState({
      pattern: !Number(id) ? 'add' : 'edit',
    });
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'adPos/list',
      payload: {
        pageInfo: {
          currPage: -1,
          pageSize: -1,
        },
      },
    });

    if (Number(id) > 0) {
      dispatch({
        type: 'ad/detail',
        payload: { adItemId: id },
      }).then(() => {
        const communityList = this.props.ad?.[`detail${id}`]?.communityList || [];
        const communityListNames = [];
        communityList.map((item) => {
          return communityListNames.push(item.communityName);
        });
        this.setState({
          communityList: communityListNames,
        });
      });
    }
  }

  handleSubmit = () => {
    const { form, dispatch, ad, match: { params: { id } } } = this.props;
    const { validateFieldsAndScroll } = form;
    const data = ad?.[`detail${id}`];

    validateFieldsAndScroll((error, values) => {
      const { pulishTime } = values;
      const params = {
        ...values,
        ...getMillisecondForSecondArr(pulishTime, 'pulish'),
      };
      delete params.pulishTime;

      const type = id ? 'edit' : 'add';
      if (!error) {
        dispatch({
          type: `ad/${type}`,
          payload: {
            adItemId: data?.adItemId,
            ...params,
          },
        }).then(() => {
          const result = this.props.ad[type];
          if (result && !result.error) {
            message.success('保存成功!');
            history.back();
          }
        });
      }
    });
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }
  handleCommunitySel = (list, allCommunities) => {
    // console.log('list', list);
    // console.log('allCommunities', allCommunities);
    const communityList = [];
    allCommunities.map((item) => {
      if (_.indexOf(list, item.communityId) >= 0) {
        communityList.push({
          communityId: item.communityId,
          communityName: item.communityName,
        });
      }
      return null;
    });

    const communityListNames = [];
    communityList.map((item) => {
      return communityListNames.push(item.communityName);
    });

    this.setState({
      communityList: communityListNames,
    });
    this.props.form.setFieldsValue({
      communityList,
    });
  }
  // getCommunityNames = (list = []) => {
  //   console.log(list);
  //   const communityListNames = [];
  //   if (list && isArray(list)) {
  //     list.map((item) => {
  //       return communityListNames.push(item.communityName);
  //     });
  //   }
  //   return communityListNames.join('，');
  // }

  render() {
    const { form, submitting, ad, match: { params: { id } } } = this.props;
    const { adPos: { list = [] } = {} } = this.props;
    const { pattern, fileList } = this.state;
    const disabled = pattern === 'detail';
    const data = ad?.[`detail${id}`];

    const adPosOptions = listToOptions(list?.list || [], 'posId', 'posName');
    const communityList = this.props.ad?.[`detail${id}`]?.communityList || [];
    const checkedCommunityIds = communityList.map(item => item.communityId);

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

    const options = [
      { label: '是', value: 1 },
      { label: '否', value: 2 },
    ];
    const openStatusOptions = [
      { label: '开启', value: 1 },
      { label: '禁用', value: 2 },
    ];
    const communityTypeOptions = [
      { label: '全部小区', value: 1 },
      { label: '指定小区', value: 2 },
    ];
    return (
      <PageHeaderLayout>
        <Card title="" bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="广告项名称">
              {form.getFieldDecorator('adName', {
                rules: [{
                  required: true, message: '广告项名称不能为空',
                }],
                initialValue: data?.adName,
              })(
                <MonitorInput maxLength={50} disabled={disabled} simple="true" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="广告位置">
              {form.getFieldDecorator('posId', {
                rules: [{
                  required: true, message: '广告位置不能为空',
                }],
                initialValue: data?.posId || '',
              })(
                <Select placeholder="请选择">
                  {optionsToHtml(adPosOptions)}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="排序">
              {form.getFieldDecorator('orderNum', {
                rules: [{
                  required: true, message: '排序不能为空',
                }],
                initialValue: id ? data?.orderNum : 100,
              })(
                <InputNumber min={1} precision={0} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="开启状态">
              {form.getFieldDecorator('openStatus', {
                rules: [{
                  required: true, message: '开启状态不能为空',
                }],
                initialValue: id ? data?.openStatus : 2,
              })(
                <Radio.Group options={openStatusOptions} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="展示小区">
              <Row gutter={8}>
                <Col span={10}>
                  {form.getFieldDecorator('communityType', {
                    rules: [{
                      required: true, message: '展示小区不能为空',
                    }],
                    initialValue: id ? data?.communityType : 2,
                  })(
                    <Radio.Group
                      options={communityTypeOptions}
                    />
                  )}
                </Col>
                {form.getFieldValue('communityType') === 2
                  ? (
                    <Col span={4}>
                      <CommunitySelectBtn checkedCommunityIds={checkedCommunityIds} okCallBack={this.handleCommunitySel} text="请选择" buttonType="a" />
                    </Col>)
                  : null}
              </Row>
              {form.getFieldValue('communityType') === 2
                ? (
                  <Row gutter={8}>
                    <FormItem label="" colon={false}>
                      {form.getFieldDecorator('communityList', {
                        rules: [{
                          required: true, message: '小区列表不能为空',
                        }],
                        initialValue: id ? data?.communityList : [],
                      })(
                        <div style={{ lineHeight: '1.5em' }}>{this.state.communityList.join('，')}</div>
                      )}
                    </FormItem>
                  </Row>)
                : null}
            </FormItem>
            <FormItem {...formItemLayout} label="定期上线">
              {form.getFieldDecorator('isOnlinePulish', {
                rules: [{
                  required: true, message: '定期上线不能为空',
                }],
                initialValue: id ? data?.isOnlinePulish : 1,
              })(
                <Radio.Group
                  options={options}
                  disabled={disabled}
                  onChange={this.handleOnlineChange}
                />
              )}
            </FormItem>
            {form.getFieldValue('isOnlinePulish') === 1
            ? (
              <FormItem {...formItemLayout} label="上线时间">
                {form.getFieldDecorator('pulishTime', {
                  rules: [{
                    required: true, message: '上线时间不能为空',
                  }],
                initialValue: id ? [moment(data?.pulishStartTime), moment(data?.pulishEndTime)] : '',
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                />
              )}
              </FormItem>
) : ''}
            <FormItem {...formItemLayout} label="图片">
              {form.getFieldDecorator('picUrl', {
                rules: [{
                  required: true, message: '图片不能为空',
                }],
                initialValue: data?.picUrl || '',
              })(
                <ImageUpload
                  exclude={['gif']}
                  maxSize={5120}
                  maxLength={1}
                  fileList={fileList}
                  listType="picture-card"
                  description="支持扩展名：.jpg, .png，大小不超过5M"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="链接">
              {form.getFieldDecorator('linkUrl', {
                rules: [{
                  type: 'url', message: '请输入url链接,以"http://"或"https://"开头',
                }],
              })(
                <MonitorInput datakey="linkUrl" maxLength={200} form={form} />
              )}
            </FormItem>

          </Form>
        </Card>
        <DetailFooterToolbar
          form={form}
          // fieldLabels={{}}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}
