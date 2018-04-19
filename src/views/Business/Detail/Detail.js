import DetailFooterToolbar from 'components/DetailFooterToolbar';
import React, { Component } from 'react';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import AddressSelector from 'components/AddressSelector/index';
import { connect } from 'dva';
import { Card, Form, Col, Row, Input, message } from 'antd';
import draftToHtml from 'draftjs-to-html';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
// import { MonitorInput, MonitorTextArea, rules } from 'components/input';
import CommunitySelectBtn from 'components/CommunitySelectBtn';
import styles from './Detail.less';


@connect(({ goods, goodsCategory, goodsBrand, marketingCategory, business, loading }) => ({
  goods,
  goodsCategory,
  goodsBrand,
  marketingCategory,
  business,
  submitting: loading.effects['goods/add'],
  fetchingBusinessList: loading.effects['business/list'],
}))
@Form.create()
export default class Detail extends Component {
  state = {
    pattern: 'detail',
    fileList: [],
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
        type: 'goods/detail',
        payload: { id },
      });
    }

    dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });

    dispatch({
      type: 'marketingCategory/list',
      payload: {},
    });

    dispatch({
      type: 'goods/unit',
      payload: {},
    });
  }

  onChange=() => {
    return '';
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  handleSubmit = () => {
  }

  handleCategoryChange = (value) => {
    const { dispatch } = this.props;

    if (value.length) {
      dispatch({
        type: 'goodsBrand/list',
        payload: {},
      });
    }
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;

    import('draft-js').then((raw) => {
      const { convertToRaw } = raw;

      const description = draftToHtml(
        convertToRaw(this.editor.state.editorState.getCurrentContent())
      );

      validateFieldsAndScroll((error, values) => {
        // 对参数进行处理
        if (!error) {
          dispatch({
            type: 'goods/add',
            payload: {
              description,
              ...values,
            },
          }).then(() => {
            const { result, msg } = this.props.goods;
            if (result === 1) {
              message.error(`提交失败！${msg}`);
            } else if (result === 0) {
              message.success('提交成功。', 1, () => {
                history.back();
              });
            }
          });
        }
      });
    });
  }

  handleSel=(arr) => {
    console.log(arr.join(''));// eslint-disable-line
  }

  /* 渲染基本信息 */
  renderBasic=() => {
    const { fileList } = this.state;


    return (
      <div>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form onSubmit={this.handleSubmit} layout="horizontal" >
            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="商家名称：">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="商家英文名：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="商家类型：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>


            <Row >
              <Col md={8}>
                <Form.Item label="关联厂商：">
                  <Input placeholder="请输入ID" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="商家分类：">
                  <Input placeholder="请选择" />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="经营范围：">
                  <Input placeholder="请选择" />
                </Form.Item>
              </Col>
            </Row>


            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="关联项目：">

                  <CommunitySelectBtn handleSel={this.handleSel} />

                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={4}>
                <Form.Item label="地址">
                  <AddressSelector />

                </Form.Item>
              </Col>
              <Col md={7}>
                <Form.Item label="&nbsp;">
                  <Input placeholder="请输入具体地址" />
                </Form.Item>
              </Col>
            </Row>


            <Row >
              <Col md={8}>
                <Form.Item label="电话">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="订单接收手机号">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="交通信息">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="简介">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="LOGO">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="商家头图">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="是否允许使用预存款和家居券">

                  {/*
                    FIXME:radio有bug 暂没发现原因
                    <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </RadioGroup> */}

                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col md={8}>
                <Form.Item label="家居券平台帐号">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }

  /* 渲染资质信息 */
  renderQualification=() => {
    const { fileList } = this.state;
    return (
      <div >
        <Card title="资质信息" className={styles.card} bordered={false}>
          <Form layout="horizontal">
            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="营业执照注册号">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="名称">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Item label="营业执照照片">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="法人代表">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="法人身份证号">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="法人身份证照片(正面)">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="法人身份证照片(反面)">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Item label="组织机构代码照片">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Item label="授权证明">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
  /* 收款信息 */
  renderReceipt=() => {
    const { fileList } = this.state;
    return (
      <div>
        <Card title="收款信息" className={styles.card} bordered={false}>
          <Form layout="horizontal">

            <Row>
              <Col md={8}>
                <Form.Item label="税务登记证编号：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Item label="税务登记证照片：">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="收款人：">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="收款人身份证号：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="收款人身份证照片(正面)">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="收款人身份证照片(反面)">
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={5120}
                    maxLength={1}
                    listType="picture-card"
                    fileList={fileList}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Item label="收款帐号：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>


            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="收款银行：">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="开户行：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Card>
      </div>
    );
  }


  /* 联系人信息 */
  renderContact=() => {
    return (
      <div>
        <Card title="联系人信息" className={styles.card} bordered={false}>
          <Form layout="horizontal">

            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="联系人姓名：">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="联系人电话：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={8}>
                <Form.Item label="联系人手机：">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="联系邮箱：">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

      </div>
    );
  }

  render() {
    const { form, submitting, pattern } = this.props;

    return (
      <PageHeaderLayout>
        {this.renderBasic()}
        {this.renderQualification()}
        {this.renderReceipt()}
        {this.renderContact()}

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
