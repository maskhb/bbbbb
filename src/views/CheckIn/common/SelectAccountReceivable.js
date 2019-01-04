import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

export default class SelectAccountReceivable extends React.PureComponent {
  static propTypes = {
    currPage: PropTypes.number,
    pageSize: PropTypes.number,
    accountName: PropTypes.string,
    cashier: PropTypes.any, // modal cashier
  }

  static defaultProps = {
    currPage: 1,
    pageSize: 999,
  }

  state = {
    list: [],
  }

  componentDidMount() {
    this.getAccountReceivableList();
  }

  getAccountReceivableList= () => {
    const { dispatch, accountName, currPage, pageSize } = this.props;
    const accountReceivablePageVO = { currPage, pageSize, accountReceivableQueryVO: { status:1  } };
    return dispatch({
      type: 'cashier/queryAccountReceivable',
      payload: { accountReceivablePageVO },
    }).then((res) => {
      if (res) {
        this.setState({
          list: res?.list,
        });
      }
    });
  }

  render() {
    const { sourceList, dispatch, loading, ...others } = this.props;

    return (
      <Select
        {...others}
        notFoundContent={loading ? <Spin spinning /> : '没有数据'}
      >
        {
          this.state.list?.map(item => (
            <Select.Option value={item.accountId} key={item.accountId}>
              {item.accountName}
            </Select.Option>
          ))
        }
      </Select>
    );
  }
}
