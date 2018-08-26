import AsyncCascaderNew from 'components/AsyncCascaderNew';
import { format } from 'components/Const';
// import AsyncCascader from 'components/AsyncCascader';
import SelectRegion from 'components/SelectRegion/business';
import AsyncSelect from 'components/AsyncSelect';
import moment from 'moment';
// import Authorized from 'utils/Authorized';
import React from 'react';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import { Card, Form, Table, Button, Radio, Row, Col, message } from 'antd';
import { MonitorInput, MonitorTextArea } from 'components/input';
import CommunitySelectBtn from 'components/CommunitySelectBtn';
import styles from './Detail.less';
import { renderButton, renderEditBtn } from './renderBtn';

const RadioGroup = Radio.Group;
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
const halfLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 6 },
    md: { span: 15 },
  },
};


function handleMerchantTypeChange(e) {
  this.setState({
    merchantType: e.target.value,
    can: false,
  });
}

function handleUseTicketChange(e) {
  this.setState({ useTicket: e.target.value });
}


/* 校验厂商 */

function hanldeCheckUnionMerchant() {
  const { dispatch, match: { params: { merchantId = '0' } } } = this.props;
  const { unionMerchantId } = this.props.form.getFieldsValue(['unionMerchantId']);
  /* 请求接口校验 */
  if (unionMerchantId) {
    dispatch({
      type: 'business/validateUnion',
      payload: { merchantUnionVo: { unionMerchantId, merchantId } },
    }).then(() => {
      if (this.props.business.validateUnionRes === 1) {
        dispatch({
          type: 'business/queryDetail',
          payload: { merchantId: unionMerchantId },
        }).then(() => {
          message.success('校验成功');
          this.setState({ can: true });
          console.log(this.props.business.currentDetailRes.merchantName) //eslint-disable-line
        });
        this.setState({ canSubmitWithValidateUnion: true });
      }
    });
  } else {
    message.error('请输入关联厂商id');
  }
}


/* 渲染基本信息 */
function renderBasic(me) {
  const { fileList, pattern } = me.state;
  let data;
  if (pattern === 'currdetail' || pattern === 'edit') {
    data = me.state?.fmtData?.merchantBaseVo;
  } else { data = {}; }
  const { form, match: { params: { merchantId = '0' } } } = me.props;
  const onlyView = (pattern === 'currdetail');
  const projectNames = me.state.fmtData?.merchantCommunityRefVoList?.map(l => l.communityName).join(', ');
  return (

    <div id="Basic">
      <Card title="基本信息" className={styles.card} bordered={false}>
        {
        onlyView ? (
          <Form.Item {...formItemLayout} label="商家ID：">
            <span>{merchantId}</span>
          </Form.Item>
        ) : ''
        }
        <Form.Item {...formItemLayout} label="商家名称：">
          {form.getFieldDecorator('merchantName', {
                rules: [{
                  required: true,
whitespace: true,
                  message: '请输入名称',
                }],
                initialValue: data?.merchantName,
              })(
 onlyView ? <span>{data?.merchantName}</span> : <MonitorInput maxLength={30} simple />
              )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="商家英文名：">
          {form.getFieldDecorator('englishName', {
              rules: [{
                 whitespace: true, message: '请输入商家英文名',
              }],
              initialValue: data?.englishName,
            })(
              onlyView ? <span>{data?.englishName}</span> : <MonitorInput maxLength={30} simple />
            )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="商家类型：">
          {form.getFieldDecorator('merchantType', {
              rules: [{
                required: true, message: '请选择商家类型',
              }],
              initialValue: data?.merchantType,
              })(
                onlyView ? (
                  <span>
                    {
                      data?.merchantType === 0 ? '未知' : (data?.merchantType === 1 ? '厂商' : (data?.merchantType === 2 ? '经销商' : '小商家'))
                  }
                  </span>
              ) : (
                <RadioGroup onChange={handleMerchantTypeChange.bind(me)} disabled={pattern === 'edit'}>
                  <Radio value={1}>厂商</Radio>
                  <Radio value={2}>经销商</Radio>
                  <Radio value={3}>小商家</Radio>
                </RadioGroup>
                )
              )}
        </Form.Item>


        {me.state.merchantType === 2 ? (
          <div>

            <Row gutter={20} >
              <Col span={5} offset={7} >
                <Form.Item label="关联厂商：" {...halfLayout}>
                  {form.getFieldDecorator('unionMerchantId', {
                  rules: [{
                    required: true, message: '请输入ID',
                  }],
                  initialValue: data?.unionMerchantId,
                  })(
                    onlyView ? (
                      <span>
                        {data?.unionMerchantName}
                      </span>
                  ) : <MonitorInput maxLength={100} simple placeholder="请输入ID" style={{ width: 320 }} />
                  )}

                </Form.Item>
              </Col>
              <Col span={5} offset={1}>
                {onlyView ? '' : (
                  <Button type="primary" onClick={hanldeCheckUnionMerchant.bind(me)}>校验</Button>
                )}
                <span style={{ marginLeft: 10 }}>
                  { me.props?.business?.currentDetailRes?.merchantName }
                </span>
              </Col>
            </Row>

          </div>


          ) : ''}


        <Form.Item {...formItemLayout} label="商家分类：">
          {form.getFieldDecorator('categoryId', {
              rules: [{
                required: true, message: '请选择商家分类',
              }],
              initialValue: data?.categoryId,
              })(
                onlyView ? (
                  <span>
                    {data?.categoryName}
                  </span>
              ) : (
                <AsyncCascaderNew
                  placeholder="全部"
                  asyncType="queryTree"
                  param={{ categoryId: 0, parentId: 0 }}
                  labelParam={
                      {
                        label: 'categoryName',
                        value: 'categoryId',
                        }
                    }
                  filter={res => res.status === 0}
                />
              ))}
        </Form.Item>


        <Form.Item {...formItemLayout} label="经营范围：">
          {form.getFieldDecorator('merchantOperateArr', {
            rules: [{
              required: true, message: '请选择经营范围',
            }],
            initialValue: data?.merchantOperateArr,
            })(
              onlyView ? (
                <span>
                  {data?.merchantOperateNameArr?.join(', ')}
                </span>
            ) : (
              <AsyncSelect />
            )
          )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="关联项目：">
          {!onlyView ? (
            <CommunitySelectBtn
              checkType={3}
              handleChange={me.handleChange}
              okCallBack={(seleted, all, checkAll) => {
                const names = all.filter(
                  l => seleted.indexOf(l.communityId) > -1
                ).map(l => l.communityName).join(', ');
                me.setState({ seleted, all, projectNames: names, checkAll });
                console.log({checkAll}) //eslint-disable-line
              }}
              checkedCommunityIds={data?.checkedCommunityIds}
            />
          ) : ''}
          <div>
            { me.state.checkAll ? '全部小区' : me.state.projectNames || projectNames }
          </div>
        </Form.Item>

        {
         /*  me.state.seleted?.length ? (
          <SelectRegion
          depth={3}
          placeholder="请选择所在地区"
        />
          ) : '' */
        }


        <Row type="flex" justify="center" gutter="12">
          <Col span="6" offset="3" style={{ textAlign: 'center' }}>
            {
                    onlyView ? (
                      <Form.Item {...formItemLayout} label="地址：" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ textAlign: 'left' }}>
                        <span> { `${me.state?.regionName || ''}  ${data?.address || ''}`} </span>
                      </Form.Item>
                    ) : (
                      <Form.Item
                        {...formItemLayout}
                        label="地址："
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                      >
                        {form.getFieldDecorator('regionId', { initialValue: data?.regionId })(
                          <SelectRegion
                            depth={3}
                            placeholder="请选择所在地区"
                            style={{ maxWidth: '200px' }}
                          />
                      )}
                      </Form.Item>
                    )
                  }

          </Col>
          <Col span="10">
            {
                      onlyView ? '' : (
                        <Form.Item {...formItemLayout} label="" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
                          {form.getFieldDecorator('address', { initialValue: data?.address })(
                            <MonitorInput placeholder="请输入具体地址" maxLength={50} simple />
                        )}
                        </Form.Item>
                    )}
          </Col>
        </Row>

        <Form.Item {...formItemLayout} label="联系电话：">
          {form.getFieldDecorator('telphoneNo', {
            rules: [{
              required: true, whitespace: true, message: '请输入联系电话',
            }],
            initialValue: data?.telphoneNo,
          })(
            onlyView ? (
              <span>
                {data?.telphoneNo}
              </span>
          ) : <MonitorInput maxLength={20} simple placeholder="请输入联系电话" />
          )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="订单接收手机号：">
          {form.getFieldDecorator('orderReceiveTelphoneNo', {
            initialValue: data?.orderReceiveTelphoneNo,
            })(
              onlyView ? (
                <span>
                  {data?.orderReceiveTelphoneNo}
                </span>
            ) : <MonitorInput maxLength={20} simple placeholder="请输入手机号" />
            )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="交通信息：">
          {form.getFieldDecorator('trafficInfo', {
          initialValue: data?.trafficInfo,
          })(
            onlyView ? (
              <span>
                {data?.trafficInfo}
              </span>
          ) : <MonitorTextArea datakey="trafficInfo" rows={5} maxLength={200} form={form} simple />
          )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="商家简介：">
          {form.getFieldDecorator('summary', {

          initialValue: data?.summary,
          })(
            onlyView ? (
              <span>
                {data?.summary}
              </span>
          ) : <MonitorTextArea datakey="summary" rows={5} maxLength={200} form={form} simple />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="LOGO：">
          {form.getFieldDecorator('LOGO', {
            initialValue: data?.LOGO,
          })(
            onlyView ? (
              <img src={data?.LOGO} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}
        </Form.Item>


        <Form.Item {...formItemLayout} label="商家头图：">
          {form.getFieldDecorator('HEAD', {
          rules: [{
            message: '请上传商家头图',
          }],
          initialValue: data?.HEAD,
          })(
            onlyView ? (
              <img src={data?.HEAD} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="是否允许使用预存款和家居券：">
          {form.getFieldDecorator('predepositCouponSwitch', {
          rules: [{
            required: true, message: '请选择商家类型',
          }],
          initialValue: data?.predepositCouponSwitch,
          })(
            onlyView ? (
              <span>
                {
                  data?.predepositCouponSwitch === 1 ? '允许' : '不允许'
              }
              </span>
          ) : (
            <RadioGroup onChange={handleUseTicketChange.bind(me)}>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </RadioGroup>
            )
          )}
        </Form.Item>

        {me.state.useTicket === 1 ? (
          <Form.Item {...formItemLayout} label="家居券平台账号：">
            {form.getFieldDecorator('couponAccount', {
            rules: [{ required: true, whitespace: true, message: '请输入ID' }],
          initialValue: data?.couponAccount,
          })(
            onlyView ? (
              <span>
                {data?.couponAccount}
              </span>
          ) : <MonitorInput maxLength={100} simple placeholder="请输入ID" />
          )}
          </Form.Item>
        ) : ''}

        {
          onlyView ? renderButton(data, me) : ''
        }
        {
          onlyView ? renderEditBtn(me.state?.fmtData?.merchantBaseVo?.merchantId, 'Basic') : ''
        }
      </Card>
    </div>
  );
}

/* 渲染资质信息 */
function renderQualification(me) {
  const { fileList, pattern } = me.state;
  // 请求到接口之前是undefined 用?过滤此情况
  let data = me.props.business?.details?.merchantQualificationVo;// 请求到接口之前是undefined 用?过滤此情况
  if (pattern === 'currdetail' || pattern === 'edit') {
    data = me?.state?.fmtData?.merchantQualificationVo;
  } else {
    data = {};
  }
  const { form } = me.props;
  const onlyView = pattern === 'currdetail';


  return (
    <div id="Qualification">
      <Card title="资质信息" className={styles.card} bordered={false}>

        <Form.Item {...formItemLayout} label="营业执照注册号：">
          {form.getFieldDecorator('licenseNumber', {
                initialValue: data?.licenseNumber,
                })(
                  onlyView ? (<span> { data?.licenseNumber } </span>
                ) : <MonitorInput maxLength={30} simple />
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="营业执照名称：">
          {form.getFieldDecorator('licenseName', {
                initialValue: data?.licenseName,
                })(
                  onlyView ? (<span> { data?.licenseName } </span>
                ) : <MonitorInput maxLength={30} simple />
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="营业执照照片：">
          {form.getFieldDecorator('LICENCE', {
                initialValue: data?.LICENCE,
                })(
                  onlyView ? (
                    <img src={data?.LICENCE} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="法人代表：">
          {form.getFieldDecorator('legalRepresentative', {
                initialValue: data?.legalRepresentative,
                })(
                  onlyView ? (
                    <span>{data?.legalRepresentative}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="法人身份证号：">
          {form.getFieldDecorator('legalRepresentativeIdcardNo', {
                initialValue: data?.legalRepresentativeIdcardNo,
                })(
                  onlyView ? (
                    <span>{data?.legalRepresentativeIdcardNo}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="法人身份证照片(正面)：">
          {form.getFieldDecorator('LEGALA', {
                initialValue: data?.LEGALA,
                })(
                  onlyView ? (
                    <img src={data?.LEGALA} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}
        </Form.Item>


        <Form.Item {...formItemLayout} label="法人身份证照片(反面)：">
          {form.getFieldDecorator('LEGALB', {
                initialValue: data?.LEGALB,
                })(
                  onlyView ? (
                    <img src={data?.LEGALB} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}
        </Form.Item>


        <Form.Item {...formItemLayout} label="组织机构代码：">
          {form.getFieldDecorator('institutionaCode', {
                initialValue: data?.institutionaCode,
                })(
                  onlyView ? (
                    <span>{data?.institutionaCode}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="组织机构代码照片：">
          {form.getFieldDecorator('ORGA', {
                initialValue: data?.ORGA,
                })(
                  onlyView ? (
                    <img src={data?.ORGA} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}

        </Form.Item>


        <Form.Item {...formItemLayout} label="授权证明：">
          {form.getFieldDecorator('AUTH', {
                initialValue: data?.AUTH,
                })(
                  onlyView ? (
                    <img src={data?.AUTH} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}

        </Form.Item>
        {
          onlyView ? renderEditBtn(me.state?.fmtData?.merchantBaseVo?.merchantId, 'Qualification') : ''
        }

      </Card>
    </div>
  );
}
/* 银行信息 */
function renderReceipt(me) {
  const { fileList, pattern } = me.state;
  // 请求到接口之前是undefined 用?过滤此情况
  let data = me.props?.business?.details?.merchantBeneficiaryVo;
  if (pattern === 'currdetail' || pattern === 'edit') {
    data = me.state?.fmtData?.merchantBeneficiaryVo;
  } else {
    data = {};
  }
  const { form } = me.props;
  const onlyView = pattern === 'currdetail';
  return (
    <div id="Receipt">
      <Card title="银行信息" className={styles.card} bordered={false}>


        <Form.Item {...formItemLayout} label="税务登记证编号：">
          {form.getFieldDecorator('taxNumber', {
                initialValue: data?.taxNumber,
                })(
                  onlyView ? (
                    <span>{data?.taxNumber}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="税务登记证照片：">
          {form.getFieldDecorator('TAX', {
                initialValue: data?.TAX,
                })(
                  onlyView ? (
                    <img src={data?.TAX} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}

        </Form.Item>


        <Form.Item {...formItemLayout} label="收款人：">
          {form.getFieldDecorator('beneficiaryName', {
                initialValue: data?.beneficiaryName,
                })(
                  onlyView ? (
                    <span>{data?.beneficiaryName}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="收款人身份证号：">
          {form.getFieldDecorator('beneficiaryIdentityCardNumber', {
                initialValue: data?.beneficiaryIdentityCardNumber,
                })(
                  onlyView ? (
                    <span>{data?.beneficiaryIdentityCardNumber}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="收款人身份证照片(正面)">
          {form.getFieldDecorator('BENEA', {
                initialValue: data?.BENEA,
                })(
                  onlyView ? (
                    <img src={data?.BENEA} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}

        </Form.Item>


        <Form.Item {...formItemLayout} label="收款人身份证照片(反面)">
          {form.getFieldDecorator('BENEB', {
                initialValue: data?.BENEB,
                })(
                  onlyView ? (
                    <img src={data?.BENEB} alt="" style={{ width: 130, height: 130 }} />
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
          {onlyView ? '' : (<span>{'图片大小<=5M'}</span>)}

        </Form.Item>


        <Form.Item {...formItemLayout} label="收款账号：">
          {form.getFieldDecorator('beneficiaryAccountNumber', {
                initialValue: data?.beneficiaryAccountNumber,
                })(
                  onlyView ? (
                    <span>{data?.beneficiaryAccountNumber}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="收款银行：">
          {form.getFieldDecorator('beneficiaryBankName', {
                initialValue: data?.beneficiaryBankName,
                })(
                  onlyView ? (
                    <span>{data?.beneficiaryBankName}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="收款账号开户行：">
          {form.getFieldDecorator('beneficiaryOpeningBankName', {
                initialValue: data?.beneficiaryOpeningBankName,
                })(
                  onlyView ? (
                    <span>{data?.beneficiaryOpeningBankName}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>
        {
          onlyView ? renderEditBtn(me.state?.fmtData?.merchantBaseVo?.merchantId, 'Receipt') : ''
        }

      </Card>
    </div>
  );
}

/* 联系人信息 */
function renderContact(me) {
  const { pattern } = me.state;
  let data;// 请求到接口之前是undefined 用?过滤此情况
  if (pattern === 'currdetail' || pattern === 'edit') {
    data = me.state?.fmtData?.merchantContactVo;
  } else {
    data = {};
  }
  // console.log({'联系人信息':data}) //eslint-disable-line
  const { form } = me.props;
  const onlyView = pattern === 'currdetail';
  return (
    <div id="Contact">
      <Card title="联系人信息" className={styles.card} bordered={false}>


        <Form.Item {...formItemLayout} label="联系人姓名：">
          {form.getFieldDecorator('contactPersonName', {
                initialValue: data?.contactPersonName,
                })(
                  onlyView ? (
                    <span>{data?.contactPersonName}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="联系人电话：">
          {form.getFieldDecorator('contactPersonPhone', {
                initialValue: data?.contactPersonPhone,
                })(
                  onlyView ? (
                    <span>{data?.contactPersonPhone}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="联系人手机：">
          {form.getFieldDecorator('contactPersonMobilePhone', {
                initialValue: data?.contactPersonMobilePhone,
                })(
                  onlyView ? (
                    <span>{data?.contactPersonMobilePhone}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>


        <Form.Item {...formItemLayout} label="联系邮箱：">
          {form.getFieldDecorator('contactPersonEmail', {
                initialValue: data?.contactPersonEmail,
                })(
                  onlyView ? (
                    <span>{data?.contactPersonEmail}</span>
                ) : (
                  <MonitorInput maxLength={30} simple />
                )
                )}
        </Form.Item>

        {
          onlyView ? renderEditBtn(me.state?.fmtData?.merchantBaseVo?.merchantId, 'Contact') : ''
        }
      </Card>
    </div>
  );
}

/* 操作日志 */
function renderOperationLog(me) {
  const data = me.props?.business?.details?.merchantLogVoList;// 请求到接口之前是undefined 用?过滤此情况
  return (
    <div id="OperationLog">
      <Card title="操作日志" className={styles.card} bordered={false}>
        <Table
          loading={data?.loading}
          columns={
                [
                  {
                    title: '操作时间',
                    dataIndex: 'operateTime',
                    render: current => <span>{moment(current).format(format)}</span>,
                  },
                  {
                    title: '操作人',
                    dataIndex: 'operaterName',
                  },
                  {
                    title: '操作结果',
                    dataIndex: 'operateResult',
                  },
                  {
                    title: '状态',
                    dataIndex: 'statusName',
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                  },
                ]
              }
          dataSource={data}
          pagination={data?.pagination}
        />
      </Card>
    </div>
  );
}


export {
  renderBasic,
  renderOperationLog,
  renderReceipt,
  renderContact,
  renderQualification,
};
