import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { formatAllOpion } from 'utils/utils';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import { conditionTypeOptions, areaOptions, statusOptions } from '../attr';
import getColumns from './columns';
import { optionsToHtml } from '../../../../components/DataTransfer';

@connect(({ promotionRules, loading }) => ({
  promotionRules,
  loading: loading.models.promotionRules,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (_values = {}) => {
    let values = _values;
    const { dispatch } = this.props;

    values = formatAllOpion(values);

    return dispatch({
      type: 'promotionRules/queryListAndCasadeByPage',
      data: {
        PromotionRuleVoQPage: { ...values },
      },
    });
  }

  render() {
    const { loading, promotionRules, searchDefault } = this.props;

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="规则名称" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('promotionName')(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="规则类型" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('conditionType', {
                      initialValue: -1,
                    })(
                      <Select placeholder="请选择">
                        {optionsToHtml(conditionTypeOptions)}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="适用范围" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('scopeType', {
                      initialValue: -1,
                    })(
                      <Select placeholder="请选择">
                        {optionsToHtml(areaOptions)}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('status', {
                      initialValue: -1,
                    })(
                      <Select placeholder="请选择">
                        {optionsToHtml(statusOptions)}
                      </Select>
                    )
                  )
                }
              </Search.Item>


            </Search>

            <Batch>
              <Authorized authority={[permission.OPERPORT_JIAJU_PROMOTIONLIST_ADD]}>
                <a href="#/marketing/promotionlist/list/add/0" target="_blank">
                  <Button icon="plus" type="primary">添加促销规则</Button>
                </a>
              </Authorized>
            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns.call(this)}
              dataSource={promotionRules?.list?.list}
              pagination={promotionRules?.list?.pagination}
              disableRowSelection
              rowKey="brandId"
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
