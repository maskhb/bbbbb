import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Message, Modal, Transfer, Form, Checkbox } from 'antd';
import Input from 'components/input/DecorateInput';
import Authorized from 'utils/Authorized';
import PanelList, { Batch, Table } from '../../../components/PanelList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';

const FormItem = Form.Item;
@Form.create()
@connect(({ space, loading }) => ({
  space,
  loading: loading.models.space,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    modalConnectVisible: false,
    modalAddVisible: false,
    modalAddType: null,
    modalAddCheckboxStatus: 1,
    targetKeys: [],
    currentSpaceName: '',
    currentSpaceId: 0,
    modalConnectDataSource: [],
    targetSelectedKeys: [],
    sourceSelectedKeys: [],
    modalConnectKey: 0,
    modalAddKey: 0,
  };
  componentDidMount() {
    this.handleSearch();
  }
  handleSearch = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'space/list',
      payload: {},
    });
  };
  removeFn(spaceId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'space/remove',
      payload: { spaceId },
    }).then(() => {
      const { remove } = this.props.space;
      if (remove === 'success') {
        Message.success('删除成功');
        this.handleSearch();
      } else if (remove === 0) {
        Message.error(`删除失败, ${remove.msg || '请稍后再试。'}`);
      }
    });
  }
  openFn = (spaceId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'space/enable',
      payload: { spaceId },
    }).then(() => {
      const { enable } = this.props.space;
      if (enable === 'success') {
        Message.success('启用成功');
        this.handleSearch();
      } else {
        Message.error(`启用失败, ${enable.msg || '请稍后再试。'}`);
      }
    });
  };
  closeFn = (spaceId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'space/disable',
      payload: { spaceId },
    }).then(() => {
      const { disable } = this.props.space;
      if (disable === 'success') {
        Message.success('禁用成功');
        this.handleSearch();
      } else {
        Message.error(`禁用失败, ${disable.msg || '请稍后再试。'}`);
      }
    });
  };

  /* ---- 关联分类弹框的分割线 ----*/
  modalConnectShow(record) {
    const { dispatch } = this.props;
    const { modalConnectKey } = this.state;
    const that = this;
    dispatch({
      type: 'space/queryFirstCategory',
      payload: {
        parentId: 0,
      },
    }).then(() => {
      const result = [];
      const { categoryList } = that.props.space;
      const linkCategoryNameList = record?.categorys?.split(',');
      const targetKeys = [];
      if (categoryList) {
        categoryList.forEach((v) => {
          result.push({ key: v.categoryId, title: v.categoryName });
          if (linkCategoryNameList?.length > 0 &&
            linkCategoryNameList.indexOf(v.categoryName) >= 0) {
            targetKeys.push(v.categoryId);
          }
        });
        that.setState({
          modalConnectKey: modalConnectKey + 1,
          modalConnectDataSource: result,
          targetKeys,
          targetSelectedKeys: [],
          sourceSelectedKeys: [],
          modalConnectVisible: true,
          currentSpaceName: record.name,
          currentSpaceId: record.spaceId,
        });
      }
    });
  }
  modalConnectCancel() {
    this.setState({ modalConnectVisible: false });
  }
  modalConnectOk() {
    const that = this;
    const { targetKeys, currentSpaceId } = this.state;
    if (targetKeys.length > 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'space/link',
        payload: {
          spaceId: currentSpaceId,
          categoryIds: targetKeys,
        },
      }).then(() => {
        const { link } = that.props.space;
        that.modalConnectCancel();
        if (link === 'success') {
          Message.success('关联成功');
          that.handleSearch();
        } else if (link === 0) {
          Message.error(`关联失败, ${link.msg || '请稍后再试。'}`);
        }
      });
    } else {
      Message.error('请先选择至少一个分类再提交！');
    }
  }
  handleChange(targetKeys) {
    this.setState({ targetKeys });
  }
  handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
    this.setState({ sourceSelectedKeys, targetSelectedKeys });
  }
  /* ---- 编辑、新增弹框的分割线 ----*/
  modalAddShow(record, type) {
    const { dispatch } = this.props;
    const { modalAddKey } = this.state;
    const that = this;
    if (type === 1) {
      that.setState({
        modalAddKey: modalAddKey + 1,
        modalAddVisible: true,
        modalAddForm: {},
        modalAddType: type,
        modalAddTitle: type === 1 ? '添加空间' : '编辑空间',
      });
      this.props.form.setFieldsValue({
        name: '',
        aliasName: '',
        orderNum: 100,
      });
    } else {
      dispatch({
        type: 'space/detail',
        payload: {
          spaceId: record.spaceId,
        },
      }).then(() => {
        const { detail } = this.props.space;
        that.setState({
          modalAddKey: modalAddKey + 1,
          modalAddVisible: true,
          modalAddForm: detail || {},
          modalAddType: type,
          modalAddTitle: type === 1 ? '添加空间' : '编辑空间',
        });
        this.props.form.setFieldsValue({
          name: detail?.name,
          aliasName: detail?.aliasName,
          orderNum: detail?.orderNum || 100,
        });
      });
    }
  }
  modalAddCancel() {
    this.setState({ modalAddVisible: false, modalAddCheckboxStatus: 1 });
  }
  modalAddOk() {
    // const that = this;
    const { form, dispatch } = this.props;
    const { modalAddCheckboxStatus, modalAddType, modalAddForm } = this.state;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        let params = {};
        if (modalAddType === 1) {
          params = Object.assign({}, values);
          params.status = modalAddCheckboxStatus;
          dispatch({
            type: 'space/add',
            payload: { spaceVos: params },
          }).then(() => {
            const { add } = this.props.space;
            if (add === 'success') {
              Message.success('保存成功。', 1, () => {
                this.handleSearch();
                this.modalAddCancel();
              });
            }
          });
        } else if (modalAddType === 2) {
          params = Object.assign({}, modalAddForm, values);
          delete params.updatedTime;
          delete params.updatedBy;
          delete params.categorys;
          dispatch({
            type: 'space/edit',
            payload: { spaceVos: params },
          }).then(() => {
            const { edit } = this.props.space;
            if (edit === 'success') {
              Message.success('编辑成功。', 1, () => {
                this.handleSearch();
                this.modalAddCancel();
              });
            }
          });
        }
      }
    });
  }
  handleCheckboxChange(e) {
    let modalAddCheckboxStatus = 0;
    if (e.target.checked) {
      modalAddCheckboxStatus = 1;
    }
    this.setState({ modalAddCheckboxStatus });
  }
  render() {
    const { form, space, loading, searchDefault } = this.props;
    const { modalConnectVisible, currentSpaceName, targetSelectedKeys, sourceSelectedKeys,
      modalConnectDataSource, targetKeys, modalAddTitle, modalAddVisible, modalAddType,
      modalConnectKey, modalAddKey,
    } = this.state;
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
        <Card>
          <PanelList>
            <Batch>
              <Authorized authority={['OPERPORT_JIAJU_SPACELIST_ADD']}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.modalAddShow.bind(this, {}, 1)}
                >添加适用空间
                </Button>
              </Authorized>
            </Batch>
            <Table
              loading={loading}
              rowKey={(record, index) => `${record.spaceId}${index}`}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={space?.list || []}
              pagination={false}
              totalCount={space?.list?.length}
              disableRowSelection
            />
          </PanelList>
          <Modal
            key={`connect${modalConnectKey}`}
            width={700}
            title="关联分类"
            visible={modalConnectVisible}
            onCancel={this.modalConnectCancel.bind(this)}
            onOk={this.modalConnectOk.bind(this)}
          >
            <p>当前空间：{ currentSpaceName }</p>
            <Transfer
              titles={['可选分类', '已选分类']}
              dataSource={modalConnectDataSource}
              showSearch
              listStyle={{
                width: 250,
                height: 300,
              }}
              targetKeys={targetKeys}
              selectedKeys={[...sourceSelectedKeys, ...targetSelectedKeys]}
              onChange={this.handleChange.bind(this)}
              onSelectChange={this.handleSelectChange.bind(this)}
              render={item => `${item.title}`}
            />
          </Modal>
          <Modal
            key={`add${modalAddKey}`}
            title={modalAddTitle}
            visible={modalAddVisible}
            onCancel={this.modalAddCancel.bind(this)}
            onOk={this.modalAddOk.bind(this)}
          >
            <Form style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="空间名称">
                {form.getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请选择空间名称',
                  }, {
                    max: 20, message: '最多20个字',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="别名">
                {form.getFieldDecorator('aliasName', {
                  rules: [{
                    max: 20, message: '最多20个字',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="排序">
                {form.getFieldDecorator('orderNum', {
                  rules: [{
                    pattern: /^[1-9]\d*$/, message: '请输入一个正整数',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              {
                (modalAddType === 1) ? (
                  <FormItem {...formItemLayout} label="" style={{ marginLeft: 50 }}>
                    {form.getFieldDecorator('status', {
                    })(
                      <Checkbox
                        defaultChecked
                        onChange={this.handleCheckboxChange.bind(this)}
                      >保存后立即启用
                      </Checkbox>
                    )}
                  </FormItem>
                ) : ''
              }
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
