import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { Card, Button, Input, Select, Radio, DatePicker, Divider } from 'antd';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import getColumns from './columns';
import SelectSource from '../common/SelectSource';
import { orderStatus, QUERY_STATE, RES_TYPE, GRES_TYPE, BATCH } from '../common/status';
import qs from 'qs';
import { parseQueryDate } from '../common/utils';

const { RangePicker } = DatePicker;

@connect(({ checkIn, user, loading, nightCheck, cashier }) => ({
  checkIn,
  user,
  loading: loading.models.checkIn,
  nightCheck,
  cashier,
}))
class view extends PureComponent {
  static defaultProps = {
    searchDefault: {

    },
  };

  state = {
    defaultProps: {
      gresNo: (qs.parse(this.props.location.search?.replace('?', '')) || {}).gresNo,
    },
    selectedRadio: QUERY_STATE.All.value,
    newDeferredDate: '',
    pageInfo: {
      currPage: 1,
      pageSize: 10,
    },
    orgId: -1,
    resType: RES_TYPE.person.value,
    gresType: GRES_TYPE.order.value,
  }

  componentDidMount() {
    const { batch } = qs.parse(this.props.location.search?.replace('?', '')) || {};
    const val = BATCH[batch] || QUERY_STATE.All.value;
    this.setState({
      selectedRadio: val,
    });

    this.search.props.form.setFieldsValue(this.state.defaultProps);
    this.doSearch({ queryType: val, ...this.state.defaultProps });
  }

  handleSearch(values = {}) {
    this.setState({
      selectedRadio: QUERY_STATE.All.value,
    });
    this.doSearch(values);
  }

  // 响应搜索请求
  doSearch = async ({ currPage, pageSize, ...query } = this.state.pageInfo) => {
    const { dispatch } = this.props;
    const gresPageVO = {
      ...parseQueryDate(query),
      resType: this.state.resType,
      gresType: this.state.gresType,
      pageInfo: {
        currPage,
        pageSize: pageSize || 10,
      },
    };

    await dispatch({
      type: 'checkIn/gresListByPage',
      payload: { gresPageVO },
    });

    this.table?.cleanSelectedKeys();
  }

  // 处理不同条件的搜索
  handleBatchChange = (e) => {
    const queryObj = { queryType: '' };
    const val = e.target.value;
    queryObj.queryType = val || QUERY_STATE.All.value;

    this.setState({
      selectedRadio: val,
    });


    if(val === QUERY_STATE.All.value){
      this.doSearch({...this.search.props.form.getFieldsValue()});
    }else{
      this.doSearch(queryObj);
    }
  }


  // 需要干掉数组里的'children'字段，否则会跟antd的sorter里面逻辑耦合导致报错
  deleteChildrenProp(list) {
    const arr = list?.slice() || [];
    return arr.map((it) => {
      delete it.children;
      return it;
    });
  }

  componentWillReceiveProps(props) {
    if (props.user.AccountOrgsInTree) {
      this.setState({
        orgId: props.user.AccountOrgsInTree[0]?.orgId,
      });
    }
  }

  renderSearchPanel() {
    const { searchDefault } = this.props;
    return (
      <Search
        ref={(inst) => {
        this.search = inst;
      }}
        searchDefault={searchDefault}
        onSearch={this.handleSearch.bind(this)}
      >
        <Search.Item label="预订单号：" simple>
          {// 在登记单管理里面，gresNo就是登记单; 在预订单里面，gresNo就是预订单号
          ({ form }) => (
            form.getFieldDecorator('gresNo')(
              <Input placeholder="请输入登记单号" />
            )
          )
        }
        </Search.Item>
        <Search.Item label="预订人:" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('guestName')(
              <Input maxLength="20" placeholder="请输入预订人" />
            )
          )
        }
        </Search.Item>
        <Search.Item label="手机号码：" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('phone')(
              <Input maxLength="20" placeholder="请输入手机号码" />
            )
          )
        }
        </Search.Item>
        <Search.Item label="业务来源：" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('sourceId')(
              <SelectSource
                sourceList={this.props.checkIn?.sourceList}
                dispatch={this.props.dispatch}
                orgId={this.state.orgId}
              />
            )
          )
        }
        </Search.Item>
        <Search.Item label="订单状态：" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('status')(
              <Select placeholder="请选择" allowClear>
                {
                  orderStatus?.map(item => (
                    <Select.Option value={item.value} key={item.value}>
                      {item.label}
                    </Select.Option>
                  ))
                }
              </Select>
            )
          )
        }
        </Search.Item>
        <Search.Item label="创建日期：" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('createdDateRange', {
            })(
              <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />
            )
          )
        }
        </Search.Item>
        <Search.Item label="入住日期：" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('arrivalDateRange', {
            })(
              <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />
            )
          )
        }
        </Search.Item>
        <Search.Item label="离店日期：" simple>
          {
          ({ form }) => (
            form.getFieldDecorator('departureDateRange', {
            })(
              <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />
            )
          )
        }
        </Search.Item>
      </Search>
    );
  }

  render() {
    const { loading, searchDefault, checkIn } = this.props;


    return (
      <PageHeaderLayout>
        <Card>
          <h2>
            <span>散客预订</span>
            <Authorized authority={[permission.PMS_CHECKIN_INDIVIDUALRESERVATION_INDIVIDUALRESERVE]}>
              <Button type="gray" style={{ float: 'right' }} href="#/checkin/orderform/add">+ 散客预订</Button>
            </Authorized>
          </h2>
          <Divider />
          <PanelList>
            {this.renderSearchPanel()}
            <Batch>
              <Radio.Group value={this.state.selectedRadio} buttonStyle="solid" onChange={this.handleBatchChange.bind(this)}>
                <Radio.Button value={QUERY_STATE.TodayWillIn.value}>今日预抵</Radio.Button>
                <Radio.Button value={QUERY_STATE.TodayIn.value}>今日已抵</Radio.Button>
                <Radio.Button value={QUERY_STATE.All.value}>所有预订单</Radio.Button>
              </Radio.Group>
            </Batch>

            <Table
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault, checkIn)}
              dataSource={this.deleteChildrenProp(checkIn?.checkInList?.dataList)}
              pagination={checkIn?.checkInList?.pagination}
              disableRowSelection
              rowKey="gresId"
              ref={(inst) => {
                this.table = inst;
              }}
              loading={loading}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default view;
