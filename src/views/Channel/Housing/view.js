import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Card, Button, Icon, Select, DatePicker, Modal, Spin } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch } from 'components/PanelList';
import CalendarModal from 'components/ModalCalendar';
import { getWeekday, checkArr, handleTime } from 'utils/utils';
import { fenToYuan } from 'utils/money';
import Authorized from 'utils/Authorized';
import channelOptions from '../attr';
import styles from '../index.less';

@connect(({ housing, loading }) => ({
  housing,
  loading: loading.models.housing,
}))
export default class View extends PureComponent {
  state = {
    sourceList: [],
    list: [], // 用于显示的list
    allList: [], // 整体的list
    typeList: [], // 用户类型选择的下拉框
    typeValue: '0', // 选中的用户类型
    viewType: 1, // 当前的viewType
    searchParams: {},
    calendarVisible: false,
    calendarTitle: '',
    businessTime: 0,
    currentDateTime: new Date().getTime(),
  };

  componentDidMount() {
    this.search.handleSearch();
    this.getSourceList();
    this.getBusinessTime();
    this.getRoomTypeList();
    this.getRateCodeList();
  }
  onCalendarCancel() {
    this.setState({
      calendarVisible: false,
    });
  }
  onCalendarOk() {
    this.setState({
      calendarVisible: false,
    });
  }
  getRoomTypeList() {
    const that = this;
    const { dispatch } = this.props;
    const orgId = JSON.parse(localStorage.user).orgIdSelected;
    dispatch({
      type: 'housing/roomTypeList',
      payload: {
        roomTypeQueryVO: {
          status: 1,
          orgId,
          currPage: 1,
          pageSize: 1000,
        },
      },
    }).then(() => {
      const result = that.props.housing.roomTypeList;
      localStorage.roomTypeList = JSON.stringify(result?.dataList) || '[]';
    });
  }
  getRateCodeList() {
    const that = this;
    const { dispatch } = this.props;
    const orgId = JSON.parse(localStorage.user).orgIdSelected;
    dispatch({
      type: 'housing/rateCodeList',
      payload: {
        rateCodePageQueryVO: {
          status: 1,
          sourceId: 0,
          orgId,
          currPage: 1,
          pageSize: 1000,
          orderField: 'sort',
        },
      },
    }).then(() => {
      const result = that.props.housing.rateCodeList;
      localStorage.rateCodeList = JSON.stringify(result?.dataList) || '[]';
    });
  }
  getBusinessTime() {
    const that = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'housing/businessTime',
      payload: {
        orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
      },
    }).then(() => {
      const { businessTime } = that.props.housing;
      if (businessTime && typeof businessTime === 'number') {
        that.setState({
          businessTime,
        });
      }
    });
  }
  getSourceList() {
    const that = this;
    const { dispatch } = this.props;
    const orgId = JSON.parse(localStorage.user).orgIdSelected;
    dispatch({
      type: 'housing/sourceList',
      payload: {
        orgId,
      },
    }).then(() => {
      const result = that.props.housing.sourceList;
      that.setState({
        sourceList: result?.dataList || [],
      });
    });
  }
  handleSearch = (values = {}) => {
    const that = this;
    const { dispatch } = this.props;
    const param = {
      roomRateQueryVO: {
        beginDate: values.beginDate ? handleTime(1, values?.beginDate) : handleTime(1, new Date()),
        endDate: ((values.beginDate ? handleTime(1, values?.beginDate) : handleTime(1, new Date()))
          + (7 * 24 * 3600 * 1000)) - 1,
        viewType: Number(values?.viewType),
        sourceId: values?.sourceId,
      },
    };
    return dispatch({
      type: 'housing/list',
      payload: param,
    }).then(() => {
      const result = that.props.housing.list;
      that.setState({
        searchParams: values,
        typeValue: '0',
      });
      if (Number(values.viewType) === 1) {
        that.setState({
          viewType: Number(values.viewType),
          list: result?.list || [],
          allList: result?.list || [],
          typeList: result?.rateCodeList || [],
        });
      } else {
        that.setState({
          viewType: Number(values.viewType),
          list: result?.list || [],
          allList: result?.list || [],
          typeList: result?.roomTypeList || [],
        });
      }
    });
  };
  clearHousePrice(rateCodeId, roomTypeId) {
    const that = this;
    const { dispatch } = this.props;
    const { businessTime, viewType } = this.state;
    let params = {};
    let content = '';
    if (!rateCodeId && !roomTypeId) {
      params = {
        beginDate: businessTime,
      };
      content = '确定要清除所有房价的数据？';
    } else if (Number(viewType) === 1) {
      params = {
        beginDate: businessTime,
        rateCodeId,
      };
      content = '确定要清除该价格代码的房价数据？';
    } else if (Number(viewType) === 2) {
      params = {
        beginDate: businessTime,
        roomTypeId,
      };
      content = '确定要清除该房型的房价数据？';
    }
    Modal.confirm({
      title: '提示',
      content,
      onOk: () => {
        dispatch({
          type: 'housing/clearHousePrice',
          payload: {
            roomRateDeletePriceVO: params,
          },
        }).then(() => {
          const result = that.props.housing.clearHousePrice;
          if (result && typeof result === 'boolean') {
            Modal.success({
              title: '提示',
              content: '清除房价成功！',
              onOk() {
                that.search.handleSearch();
              },
            });
          }
        });
      },
    });
  }
  handleSelectChange(value) {
    const { viewType, allList } = this.state;
    let result;
    switch (viewType) {
      case 1:
        result = checkArr(allList, 'rateCodeId', value);
        break;
      case 2:
        result = checkArr(allList, 'roomTypeId', value);
        break;
      default:
    }
    if (Number(value) === 0) {
      this.setState({
        list: allList,
        typeValue: value,
      });
    } else {
      this.setState({
        list: [allList[result.index]],
        typeValue: value,
      });
    }
  }
  changeDate(type) { // 'before': 上一周   'after': 下一周
    const { form } = this.search.props;
    const { searchParams, currentDateTime } = this.state;
    let newDateTime;
    switch (type) {
      case 'before':
        this.handleSearch(Object.assign({}, searchParams, {
          beginDate: handleTime(1, searchParams.beginDate) - (7 * 24 * 3600 * 1000),
        }));
        newDateTime = currentDateTime - (7 * 24 * 3600 * 1000);
        form.setFieldsValue({
          beginDate: moment(newDateTime),
        });
        this.setState({
          currentDateTime: newDateTime,
        });
        break;
      case 'after':
        this.handleSearch(Object.assign({}, searchParams, {
          beginDate: handleTime(1, searchParams.beginDate) + (7 * 24 * 3600 * 1000),
        }));
        newDateTime = currentDateTime + (7 * 24 * 3600 * 1000);
        form.setFieldsValue({
          beginDate: moment(newDateTime),
        });
        this.setState({
          currentDateTime: newDateTime,
        });
        break;
      default:
    }
  }
  /*  加载房价日历 */
  /* 打开日历 */
  showCalendar(roomTypeId, rateCodeId, roomTypeName, rateCodeName) {
    const { searchParams } = this.state;
    const startTime = searchParams.beginDate;
    const beginDate = moment(startTime).startOf('month').valueOf();
    const endDate = moment(startTime).add(1, 'months').endOf('month').valueOf();

    const { dispatch } = this.props;
    const searchForm = {
      beginDate,
      endDate,
      rateCodeId,
      roomTypeId,
    };
    dispatch({
      type: 'housing/calendarPrice',
      payload: searchForm,
    }).then((suc) => {
      if (suc) {
        this.setState({
          calendarVisible: true,
          calendarTitle: `${roomTypeName}（${rateCodeName}）`,
        });
      }
    });
  }
  /* 日历弹框 */
  renderCalendarModal() {
    const { calendarVisible, calendarTitle } = this.state;
    return (
      <CalendarModal
        ref={(inst) => { this.calendarModal = inst; }}
        title={calendarTitle}
        visible={calendarVisible}
        onCancel={this.onCalendarCancel.bind(this)}
        onOk={this.onCalendarOk.bind(this)}
      />
    );
  }
  renderTable() {
    const { list, viewType, searchParams } = this.state;
    const label = viewType === 1 ? 'roomTypeAndDateList' : 'rateCodeAndDateList';
    return list.map(v => (
      v[label] ? (
        <div className={styles.tableContainer} key={viewType === 1 ? v.rateCodeId : v.roomTypeId}>
          <div className={styles.leftArea}>
            <div className={styles.projectInfo}>
              <div className={styles.portrait}><img alt="" src={viewType === 1 ? v.rateCodeUrl : v.roomTypeUrl} /></div>
              <p>{viewType === 1 ? v.rateCodeName : v.roomTypeName}</p>
              {
                viewType === 1 ? (
                  <Authorized authority={['PMS_CHANNEL_ROOMRATE_PRICECODESETUP']}>
                    <Link to={`/channel/housing/pricesetting/${viewType}/${new Date(searchParams.beginDate).getTime()}/${v.rateCodeId}/${v.rateCodeName}`}>
                      <Button type="primary" className={styles.setPriceBtn}>设置房价</Button>
                    </Link>
                  </Authorized>
                ) : (
                  <Authorized authority={['PMS_CHANNEL_ROOMRATE_ROOMSTYLESETUP']}>
                    <Link to={`/channel/housing/pricesetting/${viewType}/${new Date(searchParams.beginDate).getTime()}/${v.roomTypeId}/${v.roomTypeName}`}>
                      <Button type="primary" className={styles.setPriceBtn}>设置房价</Button>
                    </Link>
                  </Authorized>
                )
              }
              <br />
              <Authorized authority={['PMS_CHANNEL_ROOMRATE_RESETONEROOMRATE']}>
                <Button
                  onClick={this.clearHousePrice.bind(this,
                    viewType === 1 ? v.rateCodeId : null, viewType === 2 ? v.roomTypeId : null)}
                >
                  清除房价
                </Button>
              </Authorized>
            </div>
          </div>
          <div className={styles.tableArea}>
            <table border="0" className={styles.priceTable}>
              <thead>
                <tr>
                  <th rowSpan="2">
                    <div style={{ fontSize: 16 }}>
                    房型/日期
                    </div>
                  </th>
                  <th key="0">今天</th>
                  {
                  v[label][0].dateArr.map((av, i) => <th key={`${i + 1}_date`}>{moment(av).format('MM月DD日')}</th>)
                }
                  <th rowSpan="2" className="lastTh">操作</th>
                </tr>
                <tr>
                  <th key="0">{getWeekday(new Date())}</th>
                  {
                  v[label][0].dateArr.map((av, i) => <th key={`${i + 1}_date`}>{getWeekday(av)}</th>)
                }
                </tr>
              </thead>
              <tbody className={styles.assessDetail}>
                {
                  v[label].map(av => (
                    <tr key={viewType === 1 ? av.roomTypeId : av.rateCodeId}>
                      <td>{viewType === 1 ? av.roomTypeName : av.rateCodeName}</td>
                      <td>{ fenToYuan(av.todayPrice) }</td>
                      {
                        av.priceArr.map((bv, i) => <td key={`${i + 1}_price`}>{fenToYuan(bv)}</td>)
                      }
                      <td>
                        <a onClick={this.showCalendar.bind(this, (viewType === 1) ? av.roomTypeId :
                          v.roomTypeId, (viewType === 1) ? v.rateCodeId : av.rateCodeId,
                          (viewType === 1) ? av.roomTypeName : v.roomTypeName,
                          (viewType === 1) ? v.rateCodeName : av.rateCodeName)}
                        >
                          房价日历
                        </a>
                      </td>
                    </tr>
                  ))
                }
                <tr />
              </tbody>
            </table>
          </div>
        </div>
      ) : ''
    ));
  }
  render() {
    const { searchDefault, loading } = this.props;
    const { sourceList, typeList, typeValue, viewType, searchParams } = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          <Spin spinning={loading}>
            <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #e3e3e3', overflow: 'hidden' }}>
              <Authorized authority={['PMS_CHANNEL_ROOMRATE_RESETALLROOMRATE']}>
                <Button type="gray" style={{ float: 'right' }} onClick={this.clearHousePrice.bind(this, null, null)}>清除房价</Button>
              </Authorized>
              <Authorized authority={['PMS_CHANNEL_ROOMRATE_ROOMSTYLESETUP']}>
                <Link to={`/channel/housing/pricesetting/2/${new Date(searchParams.beginDate).getTime()}`}>
                  <Button type="gray" style={{ float: 'right', marginRight: 20 }}>按房型设置</Button>
                </Link>
              </Authorized>
              <Authorized authority={['PMS_CHANNEL_ROOMRATE_PRICECODESETUP']}>
                <Link to={`/channel/housing/pricesetting/1/${new Date(searchParams.beginDate).getTime()}`}>
                  <Button type="gray" style={{ float: 'right', marginRight: 20 }}>按价格代码设置</Button>
                </Link>
              </Authorized>
            </div>
            <PanelList>
              {/* 搜索条件 */}
              <Search
                ref={(inst) => { this.search = inst; }}
                searchDefault={searchDefault}
                onSearch={this.handleSearch}
              >
                <Search.Item label="当前视图" simple>
                  {
                    ({ form }) => (
                      form.getFieldDecorator('viewType', {
                        initialValue: '1',
                      })(
                        <Select>
                          {channelOptions.DQST.map(v =>
                            <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                          )}
                        </Select>
                      )
                    )
                  }
                </Search.Item>
                <Search.Item label="选择日期" simple>
                  {
                    ({ form }) => (
                      form.getFieldDecorator('beginDate', {
                        initialValue: moment(new Date()),
                      })(
                        <DatePicker allowClear={false} />
                      )
                    )
                  }
                </Search.Item>
                <Search.Item label="业务来源" simple>
                  {
                    ({ form }) => (
                      form.getFieldDecorator('sourceId', {
                      })(
                        <Select showSearch optionFilterProp="children">
                          <Select.Option key="0" value="0">全部</Select.Option>
                          {sourceList.map(v => (
                            <Select.Option
                              key={v.sourceId}
                              value={v.sourceId}
                              title={v.sourceName}
                            >
                              {v.sourceName}
                            </Select.Option>
                          ))}
                        </Select>
                      )
                    )
                  }
                </Search.Item>
              </Search>
              <Batch style={{ overflow: 'hidden' }}>
                <Select
                  value={typeValue}
                  style={{ width: 200 }}
                  onChange={this.handleSelectChange.bind(this)}
                >
                  {
                    viewType === 1 ? <Select.Option key="0" value="0">全部价格代码</Select.Option> : <Select.Option key="0" value="0">全部房型</Select.Option>
                  }
                  {
                    viewType === 1 ? typeList.map(v => (
                      <Select.Option key={v.rateCodeId} value={v.rateCodeId}>
                        {v.rateCodeName}
                      </Select.Option>
                    )) : typeList.map(v => (
                      <Select.Option key={v.roomTypeId} value={v.roomTypeId}>
                        {v.roomTypeName}
                      </Select.Option>
                    ))
                  }
                </Select>
                <Button style={{ float: 'right', marginRight: 0 }} onClick={this.changeDate.bind(this, 'after')}>后一周<Icon type="right" /></Button>
                <Button style={{ float: 'right', marginRight: 20 }} onClick={this.changeDate.bind(this, 'before')}><Icon type="left" />前一周</Button>
              </Batch>
            </PanelList>
            {/* 列表部分 */}
            {this.renderTable()}
            {this.renderCalendarModal()}
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
