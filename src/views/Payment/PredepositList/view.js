import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select, Tabs } from 'antd';
// import _ from 'lodash';
import PanelList, { Search, Table, Batch } from 'components/PanelList';
import RangeInput from 'components/RangeInput';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';


@connect(({ predeposit, loading }) => ({
  predeposit,
  loading: loading.models.predeposit,
}))


export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
      auditStatus: 1,
      onlineStatus: 0,
    },
  };

  state = {
    // modalPeriodVisible: false,
  };

  componentDidMount() {
    // this.search.handleSearch();
  }

  // modalPeriodItemShow = (adItem) => {
  //   this.setState({ modalAddItemVisible: true });
  //   if (adItem) {
  //     this.state.adItem = adItem;
  //     console.log(adItem.picUrl);
  //     // this.state.fileList = [adItem.picUrl];
  //   }
  // }

  // modalPeriodCancel = () => {
  //   this.setState({ modalAddItemVisible: false });
  // }

  // modalPeriodOk = () => {
  //   // 这里写接口
  //   const { form } = this.props;
  //   const { dispatch } = this.props;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       dispatch({
  //         type: 'pagetable/tabsave',
  //         payload: values,
  //       }).then(() => {
  //         const { predeposit } = this.props;
  //         this.setState({
  //           list: predeposit?.list?.list,
  //         });
  //       });
  //     }
  //   });
  // }

  // setperiod = (record) => {

  // }

  // charge = (record) => {

  // }

  handleSearch = (values = {}) => {
    console.log(values);
    const { dispatch } = this.props;
    return dispatch({
      type: 'predeposit/getlist',
      payload: values,
    });
  }

  renderList() {
    const { predeposit, loading, searchDefault } = this.props;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 28 },
    //     sm: { span: 4 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 12 },
    //     sm: { span: 20 },
    //   },
    // };
    return (
      <Card>
        <PanelList>
          <Search
            ref={(inst) => { this.search = inst; }}
            searchDefault={searchDefault}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          >
            <Search.Item label="关键字" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('id', {
                  })(
                    <Input placeholder="请输入" />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="余额" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('money', {
                    initialValue: { min: null, max: null },
                  })(
                    <RangeInput placeholders={['大于等于', '小于等于']} />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="是否过期" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('payState', {
                    initialValue: '',
                  })(
                    <Select>
                      <Select.Option key="" value="">请选择</Select.Option>
                      <Select.Option key="1" value="1">是</Select.Option>
                      <Select.Option key="0" value="0">否</Select.Option>
                    </Select>
                  )
                )
              }
            </Search.Item>
          </Search>

          <Batch>
            <div>
              <Button icon="plus" type="primary">充值预付款</Button>
              <Button type="primary" style={{ marginLeft: '30px' }}>导出预存款</Button>
            </div>
          </Batch>

          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={getColumns(this, searchDefault)}
            dataSource={predeposit?.list?.list}
            pagination={predeposit?.list?.pagination}
            disableRowSelection
          />
        </PanelList>

        {/* <Modal
          title="设置有效期"
          visible={this.state.modalPeriodVisible}
          onOk={this.modalPeriodOk}
          onCancel={this.modalPeriodCancel}
          okText="保存"
          width="30%"
        >
          <Form>
            <Form.Item label="名称：" {...formItemLayout}>
              {
                ({ form }) => (
                  form.getFieldDecorator('nameInput', {
                    initialValue: adItem?.adName,
                    rules: rules([{
                      required: true, message: '请输入名称',
                    }]),
                  })(
                    <DatePicker.RangePicker format="YYYY-MM-DD HH:mm:ss" />
                  )
                )
              }
            </Form.Item>
          </Form>
        </Modal> */}
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="预存款列表" key="1">{this.renderList()}</Tabs.TabPane>
          <Tabs.TabPane tab="交易流水" key="2">{this.renderList()}</Tabs.TabPane>
          <Tabs.TabPane tab="操作日志" key="3">{this.renderList()}</Tabs.TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
