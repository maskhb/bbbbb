import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, message, Modal, Transfer, Form, Input, Checkbox } from 'antd';
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
    targetKeys: [],
    currentSpaceName: '',
    currentSpaceId: 0,
    modalConnectDataSource: [],
    targetSelectedKeys: [],
    sourceSelectedKeys: [],
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
      payload: {
        spaceId,
      },
    }).then(() => {
      const { remove } = this.props.space;
      if (remove === 1) {
        message.success('删除成功');
        this.handleSearch();
      } else if (remove === 0) {
        message.error(`删除失败, ${remove.msg || '请稍后再试。'}`);
      }
    });
  }
  openFn(spaceId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'space/enable',
      payload: {
        spaceId,
      },
    }).then(() => {
      const { enable } = this.props.space;
      if (enable === 1) {
        message.success('启用成功');
        this.handleSearch();
      } else if (enable === 0) {
        message.error(`启用失败, ${enable.msg || '请稍后再试。'}`);
      }
    });
  }
  closeFn(spaceId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'space/disable',
      payload: {
        spaceId,
      },
    }).then(() => {
      const { disable } = this.props.space;
      if (disable === 1) {
        message.success('禁用成功');
        this.handleSearch();
      } else if (disable === 0) {
        message.error(`禁用失败, ${disable.msg || '请稍后再试。'}`);
      }
    });
  }

  /* ---- 关联分类弹框的分割线 ----*/
  modalConnectShow(record) {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'space/queryFirstCategory',
      payload: {
        parentId: 0,
      },
    }).then(() => {
      const result = [];
      const { categoryList } = that.props.space;
      if (categoryList) {
        categoryList.forEach((v) => {
          result.push({ key: v.categoryId, title: v.categoryName });
        });
        that.setState({
          targetKeys: [],
          targetSelectedKeys: [],
          sourceSelectedKeys: [],
          modalConnectVisible: true,
          currentSpaceName: record.name,
          currentSpaceId: record.spaceId,
          modalConnectDataSource: result,
        });
      }
    });
  }
  modalConnectCancel() {
    this.setState({ modalConnectVisible: false });
  }
  modalConnectOk() {
    const that = this;
    const { targetKeys, currentSpaceId, targetSelectedKeys } = this.state;
    if (targetKeys.length > 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'space/link',
        payload: {
          spaceId: currentSpaceId,
          categoryIds: targetSelectedKeys,
        },
      }).then(() => {
        const { link } = that.props.space;
        if (link === 1) {
          message.success('关联成功');
          that.handleSearch();
          that.modalConnectCancel();
        } else if (link === 0) {
          message.error(`关联失败, ${link.msg || '请稍后再试。'}`);
        }
      });
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
    const that = this;
    if (type === 1) {
      that.setState({
        modalAddVisible: true,
        modalAddForm: {},
        modalAddType: type,
        modalAddTitle: type === 1 ? '添加空间' : '编辑空间',
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
          modalAddVisible: true,
          modalAddForm: detail || {},
          modalAddType: type,
          modalAddTitle: type === 1 ? '添加空间' : '编辑空间',
        });
      });
    }
  }
  modalAddCancel() {
    this.setState({ modalAddVisible: false });
  }
  modalAddOk() {
    // const that = this;
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => {
      console.log(error, values);
    });
    // that.modalAddCancel();
  }
  render() {
    const { form, space, loading, searchDefault } = this.props;
    const { modalConnectVisible, currentSpaceName, targetSelectedKeys, sourceSelectedKeys,
      modalConnectDataSource, targetKeys, modalAddTitle, modalAddVisible, modalAddType,
      modalAddForm,
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
              <Button
                icon="plus"
                type="primary"
                onClick={this.modalAddShow.bind(this, {}, 1)}
              >添加适用空间
              </Button>
            </Batch>
            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={space?.list}
              pagination={space?.list?.pagination}
              disableRowSelection
            />
          </PanelList>
          <Modal
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
                  initialValue: modalAddForm?.name,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="别名">
                {form.getFieldDecorator('aliasName', {
                  rules: [{
                    max: 20, message: '最多20个字',
                  }],
                  initialValue: modalAddForm?.aliasName,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="排序">
                {form.getFieldDecorator('orderNum', {
                  rules: [{
                    pattern: /^[1-9]\d*$/, message: '请输入一个正整数',
                  }],
                  initialValue: modalAddForm?.orderNum || 100,
                })(
                  <Input />
                )}
              </FormItem>
              {
                (modalAddType === 1) ? (
                  <FormItem {...formItemLayout} label="" style={{ marginLeft: 50 }}>
                    {form.getFieldDecorator('xxx', {
                    })(
                      <Checkbox defaultChecked>保存后立即启用</Checkbox>
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
