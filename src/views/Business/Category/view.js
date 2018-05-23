import React, { Component } from 'react';
import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput, MonitorTextArea } from 'components/input';
import TableOrderList from 'components/TableOrderList';
import { connect } from 'dva';
import { Card, Button, message, Radio, Modal, Form } from 'antd';
import getColumns from './columns';

const RadioGroup = Radio.Group;
@connect(({ businessClass, loading }) => ({
  businessClass,
  loading: loading.models.businessClass,
}))
@Form.create()

export default class View extends Component {
  static defaultProps = {
  };

  state = {
    modalAddVisible: false,
  };


  componentDidMount() {
    this.query();
  }

  query = () => {
    this.props.dispatch({
      type: 'businessClass/queryList',
      payload: {
        merchantCategoryVoCondition: {},
      },
    });
  }

  modalAddShow = () => {
    this.setState({ modalAddVisible: true });
  }

  modalAddCancel = () => {
    this.setState({
      modalAddVisible: false,
      record: null,
    });
  }

  // 判断是哪个分类
  checkRecordType=() => {
    let upName;
    let upId;
    const { modalType, record, parentRecord } = this.state;
    if (modalType === 'add1') {
      // 新增一级分类
      upName = '根目录';
      upId = 0;
    } else if (modalType === 'add2') {
      // 新增二级分类
      upName = record.categoryName;
      upId = record.categoryId;
    } else if (modalType === 'edit') {
      // 编辑
      if (parentRecord) {
        // 编辑二级分类
        upName = parentRecord.categoryName;
        upId = parentRecord.categoryId;
      } else {
        // 编辑一级分类
        upName = '根目录';
        upId = 0;
      }
    }


    return [upName, upId];
  }


  modalAddOk = () => {
    const { modalType, record } = this.state;
    const { dispatch } = this.props;
    const formData = this.props.form.getFieldsValue();
    const subtype = (modalType === 'add1' || modalType === 'add2' ? 'add' : 'edit');
    const merchantCategoryVo = {
      parentId: this.checkRecordType()[1],
      ...formData,
      ...{ categoryId: record?.categoryId },
    };
    if (modalType === 'add2') {
      delete merchantCategoryVo.categoryId;
    }
    dispatch({
      type: `businessClass/${subtype}Classification`,
      payload: { merchantCategoryVo },
    }).then(() => {
      console.log(this.props) //eslint-disable-line
      if (subtype === 'add' && this.props.businessClass.addClassificationRes) {
        message.success('保存成功');
        this.props.dispatch({
          type: 'businessClass/queryList',
          payload: {},
        });
        this.modalAddCancel();
      } else if (subtype === 'edit' && this.props.businessClass.editClassification) {
        message.success('保存成功');
        this.props.dispatch({
          type: 'businessClass/queryList',
          payload: {},
        });
        this.modalAddCancel();
      }
    });
  }

  handleDelete=(record) => {
    const { dispatch } = this.props;
    const self = this;
    Modal.confirm({
      title: '确定要删除该分类？',
      content: '删除后该分类将无法找回',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'businessClass/deleteCategory',
          payload: { categoryId: record.categoryId },
        }).then(() => {
          if (self.props.businessClass.deleteRes === 1) {
            message.success('删除成功');
            self.query();
            return 1;
          }
        });
      },
      onCancel() {
        console.log(1) //eslint-disable-line
      },

    });
  };

  render() {
    const formItemLayout = {
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
    const { loading, form } = this.props;
    const { record } = this.state;
    return (
      <PageHeaderLayout >

        <Card>
          {this.state.modalAddVisible ? (

            <Modal
              title="新增分类"
              visible={this.state.modalAddVisible}
              onOk={this.modalAddOk}
              onCancel={this.modalAddCancel}
            >

              <Form
                ref={(inst) => { this.modalAdd = inst; }}
              >

                <Form.Item {...formItemLayout} label="上级类目：">
                  <span>
                    {
                    this.checkRecordType()[0]

                  }
                  </span>
                </Form.Item>

                <Form.Item {...formItemLayout} label="类目名称：">
                  {form.getFieldDecorator('categoryName', {
                  rules: [{
                    required: true, message: '请输入类目名称',
                  }],
                  initialValue: record?.categoryName,
                })(
                  <MonitorInput maxLength={10} simple="true" />
                )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="类目说明：">
                  {form.getFieldDecorator('description', {
                    initialValue: record?.description,
                  })(
                    <MonitorTextArea maxLength={20} datakey="description" simple="true" form={form} rows={5} />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="状态：">
                  {form.getFieldDecorator('status', {
                  rules: [{
                    required: true, message: '请选择状态',
                  }],
                  initialValue: record?.status || 0,
                })(
                  <RadioGroup onChange={this.handleRadioChange} >
                    <Radio value={0}>启用</Radio>
                    <Radio value={1}>禁用</Radio>
                  </RadioGroup>
                )}
                </Form.Item>
              </Form>
            </Modal>

          ) : ''}


          <div style={{ marginBottom: '16px' }}>

            <Authorized authority={['OPERPORT_JIAJU_SHOPCATEGORY_ADD']}>
              <Button
                type="primary"
                onClick={() => {
              this.setState({ modalType: 'add1' });
              this.modalAddShow();
            }}
              >新增一级分类
              </Button>
            </Authorized>
          </div>

          <TableOrderList
            {...this.props}
            isExpanded
            isColumnSame
            rowKey="categoryId"
            loading={loading}
            columns={getColumns(this)}
            dataSource={this.props?.businessClass?.list}
            pagination={{
              pageSize: 10,
              total: this.props?.businessClass?.list?.length,
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
