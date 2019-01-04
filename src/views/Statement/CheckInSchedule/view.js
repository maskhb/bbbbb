
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Card, DatePicker } from 'antd';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';
import { handleTime } from 'utils/utils';
import { orgId } from 'utils/getParams';
import styles from './style.less';

const { RangePicker } = DatePicker;
// const labelCol = {
//   sm: 24,
//   md: 5,
// };


@connect(({ statement, loading }) => ({
  statement,
  loading: loading.effects['statement/queryStatisticsInfo'],
}))
export default class View extends PureComponent {
  state = {};
  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { collectionDays } = values;
    // 更改数据符合接口定义
    let startBusinessTime;
    let endBusinessTime;
    if (collectionDays && Array.isArray(collectionDays)) {
      if (collectionDays.length) {
        [startBusinessTime, endBusinessTime] = collectionDays;
        startBusinessTime = handleTime(1, new Date(moment(startBusinessTime)));// new Date(moment(startBusinessTime)).getTime();
        endBusinessTime = handleTime(2, new Date(moment(startBusinessTime))) + 1;// new Date(moment(endBusinessTime)).getTime();
      }
      console.log({ startBusinessTime, endBusinessTime });
    }
    const newValues = { ...values, statisticsCondition: { startBusinessTime, endBusinessTime, orgId: orgId(), type: 1 } };
    delete newValues.collectionDays;
    // delete newValues.currPage;


    const { dispatch } = this.props;
    dispatch({
      type: 'statement/queryStatisticsInfo',
      payload: newValues,
    });
    console.log(this.props.statement);
  };
  handleDownLoad = (val) => {
    console.log(val);
    const { endBusinessTime, startBusinessTime, infoId } = val;
    // const statisticsCondition = { endBusinessTime, startBusinessTime };
    this.props.dispatch({
      type: 'statement/download',
      payload: { infoId },
    });
  }

  render() {
    const { statement, loading, searchDefault } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.special}>
            <PanelList >
              <Search
                ref={(inst) => {
              this.search = inst;
            }}
                searchDefault={this.searchDefault}
                onSearch={this.handleSearch}
              >
                <Search.Item
                  label="营业日期"
                  simple
                >
                  {({ form }) => (form.getFieldDecorator('collectionDays', {
              })(
                <RangePicker
                  showTime
                  format="YYYY-MM-DD"
                  placeholder={['开始时间', '结束时间']}
                  style={{ width: '100%' }}
                />
            ))}
                </Search.Item>
              </Search>
              <Batch />
              <Table
                loading={loading}
                rowKey="orderSn"
                searchDefault={searchDefault}
                columns={getColumns(this, searchDefault)}
                dataSource={statement?.ListData?.list}
                pagination={statement?.ListData?.pagination}
                disableRowSelection
              />
            </PanelList>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
