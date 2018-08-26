/*
 * 商家选择框  --  业务组件
 * value:{
 *  factoryId,
 *  factoryName,
 *  merchantId,
 *  merchantName,
 * }
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import emitter from 'utils/events';
import ProjectSelect from './MerchantSelect';

@connect(({ common }) => ({
  common,
}))
class ProjectInputBusiness extends PureComponent {
  constructor(props) {
    super(props);
    const { linkId, value, parentItem = {} } = props;
    this.state = {
      linkId,
      value,
      loading: false,
      keyName: 'merchantList',
      parentItem,
    };
  }

  componentDidMount() {
    const { eventName } = this.props;
    if (eventName) {
      emitter.addListener(eventName, ({ linkId, item }) => {
        if (linkId !== this.state.linkId) {
          this.setState({ linkId, parentItem: item }, () => {
            this.resetData();
          });
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }

    if (nextProps.linkId !== this.props.linkId ||
      JSON.stringify(nextProps.parentItem) !== JSON.stringify(this.props.parentItem)
    ) {
      this.setState({
        linkId: nextProps.linkId,
        parentItem: nextProps.parentItem,
      });
    }
  }

  resetData = () => {
    if (this.props.form) {
      this.props.form.resetFields([this.props.id]);
    } else {
      this.setState({ value: '' });
      this.props.onChange();
    }

    this.resetMerchant(this.state.keyName);
  }

  handleSearch = async (payload) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    const { linkId, keyName, parentItem } = this.state;

    await dispatch({
      type: 'common/queryMerchantList',
      payload: {
        ...payload,
        unionMerchantId: Number(linkId),
        statusList: [1, 2],
        merchantTypeList: [1, 2, 3],
        keyName,
        parentItem: parentItem ? [parentItem] : [],
      },
    });
    this.setState({ loading: false });
  }

  handleChange = (value) => {
    this.props.onChange(value);
  }

  resetMerchant = () => {
    const { dispatch } = this.props;
    const { keyName } = this.state;

    dispatch({
      type: 'common/save',
      payload: {
        [keyName]: [],
      },
    });
  }

  render() {
    const { common, disabled, ...otherProps } = this.props;
    const { loading, value, keyName, linkId } = this.state;
    return (
      <ProjectSelect
        {...common}
        {...otherProps}
        onChange={this.handleChange}
        handleSearch={this.handleSearch}
        resetMerchant={this.resetMerchant}
        loading={loading}
        value={value}
        list={common[keyName]}
        disabled={disabled || !linkId}
      />
    );
  }
}

export default ProjectInputBusiness;
