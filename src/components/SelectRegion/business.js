/*
 * @Author: wuhao
 * @Date: 2018-05-05 14:27:50
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-05 21:00:22
 *
 * 选择地区 下拉组件 业务组件
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import SelectRegion from './index';

@connect(({ common }) => ({
  common,
}))
class SelectRegionBusiness extends PureComponent {
  static defaultProps = {};

  state = {
    defValue: this.props.value || [],
    depth: this.props.depth || 4,
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const defValue = nextProps.value;
      this.setState({
        defValue,
      });
    }
  }

  transformOptions = (options = [], level = 0) => {
    return options?.map((item) => {
      return {
        label: item?.regionName,
        value: item?.regionId,
        isLeaf: (level + 1) === this.state?.depth,
        level: level + 1,
        region: item,
      };
    });
  }

  queryRegionInfo = async (targetOption) => {
    const regionId = targetOption?.value || 0;

    const { common: oldCommon } = this.props;
    if (oldCommon?.[`queryRegionInfo-${regionId}`]) {
      return this.transformOptions(oldCommon?.[`queryRegionInfo-${regionId}`], targetOption?.level);
    }

    const { dispatch } = this.props;
    await dispatch({
      type: 'common/queryRegionInfo',
      payload: {
        regionId,
      },
    });
    const { common } = this.props;
    return this.transformOptions(common?.[`queryRegionInfo-${regionId}`], targetOption?.level);
  }

  render() {
    const { depth, defValue } = this.state;
    return (
      <SelectRegion
        {...this.props}
        loadData={this.handleLoadData}
        callback={this.queryRegionInfo}
        defValue={defValue}
        depth={depth}
      />
    );
  }
}

export default SelectRegionBusiness;
