import React from "react";
import _ from "lodash";
import moment from "moment";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import {
  Form,
  Button,
  Card,
  Input,
  Select,
  Radio,
  DatePicker,
  message
} from "antd";
import PageHeaderLayout from "layouts/PageHeaderLayout";
import FooterToolbar from "components/FooterToolbar";
import { d2Col } from "components/Const";
import qs from "qs";
// import { orderEditReceiptTypeMap, orderAddAccTypeMap } from
// 'viewmodels/GresDetailVO'; import { transformArrivalDate,
// transformDepartureDate } from 'viewmodels/GresDetailResp';
import AddComponent from "../common/AddComponent";
// import LinkRoom from "../common/LinkRoom";
import LinkTable from "../common/LinkTable";
import history from "utils/history";

// import AddAccountModal from '../../common/AddAccountModal'; import
// '../../index.less';

@connect(
  ({
    proprietor,
    loading,
    building,
    houseStatus,
    floor,
    baseSetting,
    common,
    tag
  }) => ({
    common,
    baseSetting,
    floor,
    houseStatus,
    building,
    proprietor,
    // submitting: loading.effects["proprietor/add"], 
    loading,
    tag
    // detailLoading: loading.effects["proprietor/details"]
  })
)
@Form.create()
export default class View extends AddComponent {
  static defaultProps = {};

  constructor() {
    super();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "tag/tagDocType", 
      payload: {}
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: "proprietor/resetDetail", payload: {} });
  }

  // 产品说要废弃,不需要自动处理生日等信息
  handleDocNoChange = (e, b, c, d) => {
    return false;
    const { form } = this.props;
    let val = e.target.value;
    if (val && val.length != 18) {
      return false;
    }
    const isBoy = !!(val.split("")[16] % 2 === 1);
    const birthday = moment(val.slice(6, 14), "YYYYMMDD");
    if (birthday.valueOf()) {
      form.setFieldsValue({
        gender: isBoy ? "M" : "F",
        birthday: birthday
      });
    }
  };

  // 证件类型选项
  mergeOptions = () => {
    const { tag } = this.props;
    const arr = [];
    _.each(tag?.tagDocType, (val, key) =>
      arr.push(
        <Select.Option value={key} key={key}>
          {val}
        </Select.Option>
      )
    );
    return arr;
  };

  render() {
    const {
      submitting,
      form,
      proprietor: { roomOwnerDetail }
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 12
      }
    };
    const { getFieldDecorator } = form;

    return (
      <PageHeaderLayout>
        <Card title="基本信息" bordered={false}>
          <Form.Item label="业主姓名" {...formItemLayout}>
            {getFieldDecorator("name", {
              initialValue: roomOwnerDetail?.name,
              rules: [
                {
                  required: true,
                  message: "请输入业主姓名"
                },
                {
                  max: 10,
                  message: "最多10个字"
                }
              ]
            })(<Input placeholder="最多10个字" />)}
          </Form.Item>

          <Form.Item label="电话号码" {...formItemLayout}>
            {getFieldDecorator("phone", {
              initialValue: roomOwnerDetail?.phone,
              rules: [
                {
                  required: true,
                  message: "请输入电话号码"
                },
                {
                  max: 11,
                  message: "最多11个字"
                },
                {
                  validator: (rule, value, callback) =>
                    callback(/[^\d]/.test(value) ? "只允许数字" : undefined)
                }
              ]
            })(<Input placeholder="最多11个字" />)}
          </Form.Item>

          <Form.Item label="证件类型" {...formItemLayout}>
            {getFieldDecorator("docType", {
              initialValue: "" + roomOwnerDetail?.docType,
              rules: [
                {
                  required: true,
                  message: "请选择证件类型"
                }
              ]
            })(
              <Select
                style={{
                  width: 150
                }}
                placeholder="请选择证件类型"
              >
                {this.mergeOptions()}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="证件号码" {...formItemLayout}>
            {getFieldDecorator("docNo", {
              initialValue: roomOwnerDetail?.docNo,
              rules: [
                {
                  required: true,
                  message: "请输入证件号码"
                },
                {
                  max: 18,
                  message: "最多18个字"
                }
              ]
            })(
              <Input
                placeholder="最多18个字"
                onChange={this.handleDocNoChange}
              />
            )}
          </Form.Item>

          <Form.Item label="性别" {...formItemLayout}>
            {getFieldDecorator("gender", {
              initialValue: roomOwnerDetail?.gender
            })(
              <Radio.Group>
                <Radio value={"M"}>男</Radio>
                <Radio value={"F"}>女</Radio>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="生日" {...formItemLayout}>
            {getFieldDecorator("birthday", {
              //initialValue: moment(roomOwnerDetail?.birthday)
            })(<DatePicker placeholder="请选择日期" />)}
          </Form.Item>
        </Card>

        <Card title="关联房间" bordered={false}>
          <LinkTable {...this.props} editting={false} />
        </Card>

        <FooterToolbar>
          <Button
            type="primary"
            onClick={_.debounce(this.handleSubmit, 100)}
            loading={submitting}
          >
            保存
          </Button>
          <Button onClick={this.goBackList}>取消</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
