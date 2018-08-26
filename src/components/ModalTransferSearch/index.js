/*
 * @Author: wuhao
 * @Date: 2018-07-13 11:06:48
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-26 15:08:12
 *
 * 穿梭框搜索弹窗组件
 */


import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Modal, message, Button, Transfer, Pagination, Spin, Form } from 'antd';

import Search from './Search';
import SearchShowItem from './SearchShowItem';

import styles from './index.less';

// const { Item: FormItem } = Form;

@Form.create()
class ModalTransferSearch extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    searchLoading: false,
    dataSource: [],
    targetKeys: [],
    targetKeysRow: [],
    current: 1,
    total: 0,
    pageSize: 20,
    searchKey: null,
    rowKey: 'key',
    setedRef: false,
  }

  onSearchClear = async (side) => {
    const e = { target: { value: '' } };
    // console.log('check clear');
    this.onSearchChange(side, e);
  }

  onSearchChange = async (side, e) => {
    if (side !== 'left') return;

    this.setState({
      searchLoading: true,
    });

    const { onSearch } = this.props;
    const data = {
      total: 0,
      dataSource: [],
    };


    if (onSearch) {
      const res = await onSearch({
        values: { merchantName: e.target.value },
        current: 1,
      });

      data.total = res?.total || 0;
      data.dataSource = this.getNewDataSource(res?.dataSource);
    }

    this.setState({
      searchLoading: false,
      dataSource: data?.dataSource || [],
      total: data?.total || 0,
    });
  }

  // 渲染分页代码
  getTransferFooterRender = () => {
    const { isShowPage = false } = this.props;
    const { current = 1, total = 0, pageSize = 20 } = this.state;
    return isShowPage ? (
      <Pagination
        simple
        pageSize={pageSize}
        current={current}
        total={total}
        onChange={this.handlePaginationChange}
      />
    ) : null;
  }

  // 渲染穿梭框代码
  getTransferRender = (record) => {
    const { renderkey = 'name', isShowSearch = false, isDefault = true, form, searchShowItem, isNeedNum } = this.props;
    const { targetKeys = [], rowKey } = this.state;
    // const { getFieldDecorator } = form || {};

    const labelDom = isShowSearch ? (
      isDefault ? (
        <SearchShowItem
          record={record}
          rowKey={rowKey}
          form={form}
          isShowInput={isNeedNum && targetKeys?.some(key => key === record?.[`${rowKey}`])}
          onChange={(value) => {
            this.handleInputNumberChange(record, value);
          }}
        />
      ) : searchShowItem
    ) : record?.[`${renderkey}`];


    return {
      label: labelDom,
      value: '',
    };
  }

  // 设置左侧标识
  getNewDataSource = (dataSource = []) => {
    const { targetKeysRow = [], targetKeys = [], rowKey } = this.state;

    return [
      ...dataSource?.filter((item) => {
        return !targetKeys?.some(key => key === item?.[`${rowKey}`]);
      }),
      ...targetKeysRow,
    ];
  }

  // 清除组件状态
  clearModalState = () => {
    this.setState({
      showModal: false,
      loading: false,
      searchLoading: false,
      dataSource: [],
      targetKeys: [],
      targetKeysRow: [],
      current: 1,
      total: 0,
      searchKey: null,
      rowKey: 'key',
    });
  }

  // 显示组件弹框
  handleButtonClick = () => {
    const { pageSize = 20, transfer, rowKey = 'key', selectedKeys } = this.props;
    const { targetKeys = [], targetKeysRow = [] } = transfer || {};
    this.setState({
      showModal: true,
      pageSize,
      targetKeys: [
        ...targetKeys,
      ],
      targetKeysRow: [
        ...targetKeysRow,
      ],
      rowKey,
    });
    // console.log('buttonClick selectedKeys', selectedKeys, this.props);
    // 初始化调用
    this.handleSearchOk(null, 1, selectedKeys);
  }

  // 关闭组件弹框
  handleModalCancle = () => {
    this.clearModalState();
  }

  // 确定并关闭组件弹框
  handleModalOk = async () => {
    const { onOk, form, maxLength } = this.props;
    const { targetKeys = [], targetKeysRow = [] } = this.state;
    if (maxLength && targetKeys.length > maxLength) {
      message.error(`最多可选${maxLength}项`);
      return;
    }
    form?.validateFields((err) => {
      if (!err) {
        if (onOk) {
          // console.log('keys rows....', targetKeys, targetKeysRow);
          onOk(targetKeys, targetKeysRow);
        }

        this.clearModalState();
      }
    });
  }

  // 搜索调用方法
  handleSearchOk = async (values, current, selected = {}) => {
    this.setState({
      searchLoading: true,
      current,
      searchKey: values,
    });

    // console.log('searchOk...', selected);

    const { onSearch } = this.props;
    const data = {
      total: 0,
      dataSource: [],
    };

    // console.log('selectedKeys....', selectedKeys);
    const selectedRes = {};
    if (onSearch) {
      const res = await onSearch({
        values,
        current,
      });
      const { keys, nums } = selected;
      const numsRes = {};

      if (keys && keys.length > 0) {
        if (nums) {
          keys.forEach((item, i) => {
            numsRes[item] = nums?.[i] || 1;
          });
        }
        // console.log('onsearch keys', keys);
        const selRes = await onSearch({
          values: {
            skuIdsStr: keys,
          },
          current: 1,
          pageSize: 10000,
        });
        selectedRes.targetKeysRow = this.getNewDataSource(selRes?.dataSource).map((r) => {
          const rs = { ...r };

          rs.num = numsRes[r.key];
          return rs;
        });
        selectedRes.targetKeys = selectedRes.targetKeysRow.map(l => l.key);
        // console.log('numsRes', numsRes, selectedRes.targetKeysRow);

        // console.log('.......lll', ll);
      }

      data.total = res?.total || 0;
      data.dataSource = this.getNewDataSource(res?.dataSource).map((d) => {
        if (numsRes[d.key]) {
          return { ...d, num: numsRes[d.key] };
        }
        return d;
      });
      const cIds = data.dataSource.map(s => s.key);
      if (selectedRes.targetKeysRow) {
        selectedRes.targetKeysRow.forEach((row) => {
          if (cIds.indexOf(row.key) === -1) {
            data.dataSource.push(row);
          }
        });
      }
    }

    this.setState({
      ...selectedRes,
      searchLoading: false,
      dataSource: data?.dataSource || [],
      total: data?.total || 0,
      // targetKeys: data?.targetKeys
    });
  }

  // 穿梭框左右转移回调
  handleTransferChange = (targetKeys) => {
    const { dataSource = [], rowKey } = this.state;
    this.setState({
      targetKeys: [
        ...targetKeys,
      ],
      targetKeysRow: [
        ...dataSource?.filter((item) => {
          return targetKeys?.some(key => key === item?.[`${rowKey}`]);
        }),
      ],
    });
  }

  // 穿梭框分页调用
  handlePaginationChange = (page) => {
    const { searchKey } = this.state;
    this.handleSearchOk(searchKey, page);
  }

  // 穿梭框搜索过滤
  handleTransferFilterChange = (inputValue, option) => {
    return option?.name?.indexOf(inputValue) > -1;
  }

  // 输入框修改
  handleInputNumberChange = (record, value) => {
    const { targetKeysRow = [], dataSource = [], rowKey } = this.state;
    const keys = Object.keys(value || {});

    this.setState({
      targetKeysRow: [
        ...targetKeysRow?.map((item) => {
          const newItem = item;
          if (newItem?.[`${rowKey}`] === record?.[`${rowKey}`]) {
            // newItem.num = value;
            if (value) {
              keys?.forEach((key) => {
                newItem[`${key}`] = value[`${key}`];
              });
            }
          }
          return newItem;
        }),
      ],
      dataSource: [
        ...dataSource?.map((item) => {
          const newItem = item;
          if (newItem?.[`${rowKey}`] === record?.[`${rowKey}`]) {
            // newItem.num = value;
            if (value) {
              keys?.forEach((key) => {
                newItem[`${key}`] = value[`${key}`];
              });
            }
          }
          return newItem;
        }),
      ],
    });
  }

  render() {
    const {
      hideBtn,
      className,
      btnTitle = '选择商品',
      modalTitle = '选择商品',
      btnDom,
      isShowSearch = false,
      isDefault = true,
      searchDom,
      transfer,
    } = this.props;

    const {
      showModal,
      loading,
      searchLoading,
      targetKeys = [],
      dataSource = [],
      rowKey,
    } = this.state;

    const { titles = ['可选供应商', '已选供应商'], showSearch = false } = transfer || {};

    const btnElm = btnDom ? React.cloneElement(
      btnDom,
      {
        onClick: this.handleButtonClick,
      }
    ) : <Button type="primary" onClick={this.handleButtonClick}>{btnTitle}</Button>;


    return [
      (hideBtn ? null : btnElm),
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title={modalTitle}
        okText="确定"
        width="700px"
        onCancel={this.handleModalCancle}
        onOk={this.handleModalOk}
        className={classNames(className, styles.component_modal_transfer_search)}
      >

        {
          isShowSearch ? (
            <div className="search">
              {
                isDefault ? (
                  <Search btnLoading={searchLoading} onOk={this.handleSearchOk} />
                ) : searchDom
              }
            </div>
          ) : null
        }

        <div className="transfer">
          <Spin spinning={searchLoading}>
            <Transfer
              listStyle={{
                width: 300,
                height: 400,
              }}
              ref={(ref) => {
                if (ref) {
                  setTimeout(() => {
                    if (!this.state.setedRef) {
                      this.state.setedRef = true;
                      const old = ref.handleClear;
                      // const self = this;
                      // eslint-disable-next-line
                      ref.handleClear = (direction) => {
                        old(direction);
                        this.onSearchClear(direction);
                      };
                    }
                  }, 10);
                }
                // this.transferRef = ref;
              }}
              lazy={false}
              dataSource={dataSource}
              showSearch={showSearch}
              filterOption={this.handleTransferFilterChange}
              // onSelectChange={this.handleSelectChange}
              targetKeys={targetKeys}
              onChange={this.handleTransferChange}
              onSearchChange={this.onSearchChange}
              handleClear={this.onSearchClear}
              titles={titles}
              render={this.getTransferRender}
              footer={this.getTransferFooterRender}
              rowKey={record => record?.[`${rowKey}`]}
            />
          </Spin>
        </div>
      </Modal>,
    ];
  }
}

export default ModalTransferSearch;
