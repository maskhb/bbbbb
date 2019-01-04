import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import {
  Form,
  Button,
  Card,
  Input,
  Checkbox,
  message,
} from 'antd';
import SelectGoodSubjects from 'components/SelectGoodSubjects';
import { orgId } from 'utils/getParams';
import { goTo } from 'utils/utils';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import LinkRoom from '../components/LinkRoom';


@connect(({
  room,
  user,
  tag,
  proprietor,
  loading,
}) => ({
  room,
  user,
  tag,
  proprietor,
  loading,
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    checkTagIds: [],
  }

  componentDidMount() {
    // 初始化调用
    this.getDetail();
    this.SelDataRows();
    // console.log(this.props);
  }

  getDetail = () => {
    if (this.isEdit()) {
      const { roomId } = this.props.match.params;
      this.props.dispatch({
        type: 'room/details',
        payload: {
          roomId,
        },
      }).then((rs) => {
        // console.log('details', rs);
        this.setState({
          checkTagIds: (rs?.roomTags || []).map(tg => tg.tagId),
        });
      });
    }
  }

  isEdit = () => {
    return !!this.props.match?.params?.roomId;
  }

  SelDataRows = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'room/buildingData',
      payload: {
        orgId,
        status: 1,
        currPage: 1,
        pageSize: 9999,
      },
    });

    await dispatch({
      type: 'room/floorData',
      payload: {
        orgId,
        status: 1,
        currPage: 1,
        pageSize: 9999,
      },
    });

    await dispatch({
      type: 'room/tagData',
      payload: {
        orgId,
        status: 1,
        currPage: 1,
        pageSize: 9999,
      },
    });

    await dispatch({
      type: 'room/roomTypeData',
      payload: {
        orgId,
        status: 1,
        currPage: 1,
        pageSize: 9999,
      },
    });

    await dispatch({
      type: 'tag/tagDocType',
      payload: {},
    });
  }

  handleCheck = (e) => {
    const { onCheck } = this.props;
    if (onCheck) {
      onCheck(e.target.checked);
    }
  }

  refreshPropTable = () => {
    const { refreshTable } = this.props;

    if (refreshTable) {
      refreshTable();
    }
  }

  reqOk = async (values) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'room/addRoom',
      payload: values,
    });
    if (res) {
      if (this.isEdit()) {
        message.success('编辑成功！');
        goTo('/house/room/');
        this.refreshPropTable();
        return true;
      } else {
        message.success('新增成功！');
        goTo('/house/room/');
        this.refreshPropTable();
        return true;
      }
    }

    return false;
  }

  handleSubmit = () => {
    const { form, user: { AccountLoginSelected }, room: { details } } = this.props;
    const { validateFieldsAndScroll } = form;
    let params;
    validateFieldsAndScroll((error, { tagId, ...values }) => {
      // 对参数进行处理
      // console.log('values', user);
      if (error) {
        return;
      }
      if (this.isEdit()) {
        params = { ...details,
          ...values,
          orgId: AccountLoginSelected?.orgId,
          orgName: AccountLoginSelected?.orgName,
          regionNamePath: AccountLoginSelected?.regionNamePath.split('_').splice(0, 2).join('-'),
          regionId: AccountLoginSelected?.regionId,
          roomTags: this.state.checkTagIds.map(t => ({ tagId: t })),
          // status: 1,
          roomOwners: details?.roomOwners,
        };

        this.reqOk(params);
      } else {
        const refRoom = this.refLinkRoom.getFieldsValue();
        params = { ...details,
          ...values,
          orgId: AccountLoginSelected?.orgId,
          orgName: AccountLoginSelected?.orgName,
          regionNamePath: AccountLoginSelected?.regionNamePath.split('_').splice(0, 2).join('-'),
          regionId: AccountLoginSelected?.regionId,
          roomTags: this.state.checkTagIds.map(t => ({ tagId: t })),
          // status: 1,
          roomOwners: refRoom.tableData.map((t) => {
            const { isAdd, isEdit, saveOwners, ...value } = t;
            return value;
          }),
        };


        this.reqOk(params);
      }
    });
  }

  goBackList = () => {
    const { form } = this.props;
    form.resetFields();
    goTo('/house/room/');
  }
  render() {
    const { submitting, form, user, room } = this.props;
    const { form: delForm, ...otherProps } = this.props;
    const { AccountLoginSelected } = user;
    const { buildingData, floorData, tagData, roomTypeData, details } = room;
    const roomOwners = (details?.roomOwners || []).map((r) => { return r.name; });
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 12,
      },
    };
    const { getFieldDecorator } = form;

    const buildingDataSource = (buildingData?.list || [])?.map((item) => {
      return {
        label: item?.buildingName,
        value: item?.buildingId,
      };
    });

    const floorDataSource = (floorData?.list || [])?.map((item) => {
      return {
        label: item?.floorName,
        value: item?.floorId,
      };
    });

    const roomTypeDataSource = (roomTypeData?.list || [])?.map((item) => {
      return {
        label: item?.roomTypeName,
        value: item?.roomTypeId,
      };
    });

    return (
      <PageHeaderLayout>
        <Card title="基本信息" bordered={false}>
          <Form.Item label="所属城市" {...formItemLayout}>
            {getFieldDecorator('regionNamePath', {
            })(<span>{AccountLoginSelected?.regionNamePath.split('_').splice(0, 2).join('-')}</span>)}
          </Form.Item>

          <Form.Item label="所属门店" {...formItemLayout}>
            {getFieldDecorator('orgName', {
            })(<span>{AccountLoginSelected?.orgName}</span>)}
          </Form.Item>

          <Form.Item label="房间号" {...formItemLayout}>
            {getFieldDecorator('roomNo', {
              initialValue: details?.roomNo,
              rules: [
                {
                  required: true,
                  message: '请输入房间号',
                }, {
                  max: 10,
                  message: '最多10个字',
                },
              ],
            })(<Input placeholder="最多10个字" />)}
          </Form.Item>

          <Form.Item label="房间房型" {...formItemLayout}>
            {getFieldDecorator('roomTypeId', {
              initialValue: details?.roomTypeId,
              rules: [
                {
                  required: true,
                  message: '请选择房间房型',
                },
              ],
            })(
              <SelectGoodSubjects style={{ width: '150px' }} dataSource={roomTypeDataSource} placeholder="请选择" />
            )}
          </Form.Item>

          <Form.Item label="楼栋楼层" style={{ marginBottom: 0 }} {...formItemLayout}>
            {getFieldDecorator('_j', {
              initialValue: 9,
              rules: [
                {
                  required: true,
                  message: '请选择楼栋',
                },
              ],
            })(<span />)}
            <Form.Item style={{ float: 'left' }}>
              {getFieldDecorator('buildingId', {
              initialValue: details?.buildingId,
              rules: [
                {
                  required: true,
                  message: '请选择楼栋',
                },
              ],
            })(
              <SelectGoodSubjects style={{ width: '150px', marginRight: '20px' }} dataSource={buildingDataSource} placeholder="请选择" />
            )}
            </Form.Item>

            <Form.Item style={{ float: 'left' }}>

              {getFieldDecorator('floorId', {
              initialValue: details?.floorId,
              rules: [
                {
                  required: true,
                  message: '请选择楼层',
                },
              ],
            })(
              <SelectGoodSubjects style={{ width: '150px' }} dataSource={floorDataSource} placeholder="请选择" />
            )}
            </Form.Item>

          </Form.Item>


          <Form.Item label="分机号" {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: details?.phone,
              rules: [
                {
                  max: 8,
                  message: '最多8个字',
                },
              ],
            })(<Input placeholder="最多8个字" />)}
          </Form.Item>

          <Form.Item label="标签" {...formItemLayout}>
            {getFieldDecorator('tagId', {
            })(
              <div>
                {
              (tagData?.list || []).map((tag) => {
                return (
                  <Checkbox
                    onChange={() => {
                      // if(this.state.checkTagIds.indexOf())
                      const id = this.state.checkTagIds.indexOf(tag.tagId);
                      const { checkTagIds } = this.state;
                      if (id > -1) {
                      checkTagIds.splice(id, 1);
                        this.setState({
                          checkTagIds: [...checkTagIds],
                        });
                      } else {
                        checkTagIds.push(tag.tagId);
                        this.setState({
                          checkTagIds: [...checkTagIds],
                        });
                      }
                    }}
                    checked={this.state.checkTagIds.indexOf(tag.tagId) > -1}
                  >{tag.name}
                  </Checkbox>
                );
              })}
              </div>
            )}
          </Form.Item>
          {
            this.isEdit() ? (
              <Form.Item label="关联业主" {...formItemLayout}>
                <span dangerouslySetInnerHTML={{ __html: roomOwners.join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') }} />
              </Form.Item>) : null
            }
        </Card>
        { this.isEdit() ? null : (
          <Card title="关联业主" bordered={false} >
            <LinkRoom {...otherProps} ref={(ref) => { window.refRoom = this.refLinkRoom = ref; }} />
          </Card>
        )}
        <FooterToolbar>
          <Button
            type="primary"
            onClick={this.handleSubmit}
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
