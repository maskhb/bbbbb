import React from 'react';
import { Card, Form, Col, Row, Popconfirm, Table, InputNumber, Divider, Spin } from 'antd';
import { d2Col } from 'components/Const';
import _ from 'lodash';

import ModalCover from './ModalCover';
import ModalGoodsList from './ModalGoodsList';
import ButtonAddSpace from './ButtonAddSpace';
import GoodsListTable from './GoodsListTable';
import { getTotal } from './common';

import { fenToYuan } from '../../../../utils/money';

import styles from '../package.less';

const filterUnSelectSpaceList = (spaceList, arrSelected) => {
  return spaceList?.filter(item =>
    (arrSelected ? !(arrSelected.find(space => item.spaceId === space.spaceId)) : true)
  );
};

const transformData = (list, valueKey, labelKey) => {
  return list?.map(item => ({ value: item[valueKey], label: item[labelKey], ...item }));
};

const isShowAddGoodsButton = (pathname) => {
  return !pathname.match('/detail');
};

const isShowDelSpaceButton = (pathname) => {
  return !pathname.match('/detail');
};

export default class SpaceAndGoods extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'goodsPackage/spaceList',
      payload: {},
    });
  }

  getOperate = () => {
    const { pathname } = this.props.location;
    const { goodsPackage: { detail } } = this.props;
    const { packageSpaceVoQs } = detail || {};
    const arr = [];

    if (isShowAddGoodsButton(pathname)) {
      const title = '添加商品';

      arr.push(record => (
        <ModalCover
          title={title}
          content={<ModalGoodsList
            ref={(inst) => {
              this.goodsListModel = inst;
            }}
            {...this.props}
            spaceId={record.spaceId}
            selectedList={_.find(
              packageSpaceVoQs, item => item.spaceId === record.spaceId)?.packageGoodsList || []
            }
          />}
          width="900px"
          onOk={this.handleChange.bind(this, record.spaceId)}
        >
          {
            (modalGoodsShow) => {
              return (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    modalGoodsShow();
                  }}
                >
                  添加商品
                </a>
              );
            }
          }
        </ModalCover>
      ));
    }

    if (isShowDelSpaceButton(pathname)) {
      arr.push(
        record => (
          <Popconfirm
            key={2}
            placement="top"
            title="确认删除？"
            onConfirm={this.handleRemove.bind(this, { spaceId: record.spaceId })}
            okText="确认"
            cancelText="取消"
          >
            <a>删除空间</a>
          </Popconfirm>
        )
      );
    }

    return arr;
  }

  getTotal = (detail) => {
    const totalPrice = getTotal(detail);

    this.props.form.setFieldsValue({ totalPrice: fenToYuan(totalPrice, true) });
    return totalPrice;
  }

  getColumnOperate = () => {
    const arrOperate = this.getOperate();
    return {
      title: '',
      dataIndex: 'spaceId',
      key: 'spaceId',
      render(val, record) {
        return (
          <div>
            {
              arrOperate.map((el, index) => {
                const arr = [];
                if (index > 0) {
                  arr.push(<Divider type="vertical" key={record.spaceId} />);
                }
                if (el instanceof Function) {
                  arr.push(<span key={`s_${arr.length}`}>{el(record)}</span>);
                  return arr;
                }
                arr.push(<span key={`s_${arr.length}`}>{el}</span>);
                return arr;
              })
            }
          </div>
        );
      },
    };
  }

  /**
   * 添加空间
   * @param checkedList
   * @param arrSpace
   */
  modalSpaceListOk = (checkedList, arrSpace) => {
    const { dispatch, goodsPackage } = this.props;
    const { detail = {} } = goodsPackage;
    detail.packageSpaceVoQs = (detail.packageSpaceVoQs || []).concat(arrSpace);
    dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
  }

  /**
   * 添加商品
   * @param spaceId
   */
  handleChange = (spaceId) => {
    const { goodsPackage: { detail, packageGoodsList: goodsList }, dispatch } = this.props;
    const { packageSpaceVoQs } = detail;

    const index = _.findIndex(packageSpaceVoQs, item => item.spaceId === spaceId);
    if (!packageSpaceVoQs[index] || !packageSpaceVoQs[index]?.packageGoodsList) {
      detail.packageSpaceVoQs[index].packageGoodsList = [];
    }

    const { selectedRowKeys } = this.goodsListModel.table.state;

    const selectedRows = _.filter(goodsList.allList, (item) => {
      return selectedRowKeys.indexOf(item.skuId) !== -1;
    }) || [];

    const { packageGoodsList } = packageSpaceVoQs[index];

    detail.packageSpaceVoQs[index].packageGoodsList = _.cloneDeep(packageGoodsList.concat(
      selectedRows.map(item =>
        ({ ...item, packagePrice: item.salePrice, isDefault: Number(item.isDefault || 0) })
      )
    ));
    detail.totalPrice = this.getTotal(detail);

    dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
  }

  /**
   * 删除空间
   * @param spaceId
   */
  handleRemove = ({ spaceId }) => {
    const { dispatch, goodsPackage } = this.props;
    const { detail } = goodsPackage;
    const index = _.findIndex(detail.packageSpaceVoQs, item => item.spaceId === spaceId);
    detail.packageSpaceVoQs.splice(index, 1);
    detail.totalPrice = this.getTotal(detail);
    dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
  }

  render() {
    const { form, goodsPackage, disabled } = this.props;
    const { spaceList, detail } = goodsPackage;
    const isDetail = Boolean(this.props.location.pathname.match('/detail'));

    const columns = [{
      title: '',
      dataIndex: 'spaceName',
      key: 'spaceName',
      width: isDetail ? '90%' : '60%',
    }];

    if (!isDetail) {
      columns.push(this.getColumnOperate());
    }

    return (
      <Spin spinning={disabled} tip="请先选择厂家和商家" indicator={<span />}>
        <Card title="空间及商品信息" bordered={false} className={styles.card}>
          <Form layout="inline">
            <Row className={styles.spaceRow}>
              {isDetail ? null : (
                <Col {...d2Col}>
                  <ButtonAddSpace
                    unSelectedSpaceList={transformData(filterUnSelectSpaceList(spaceList, detail?.packageSpaceVoQs), 'spaceId', 'name')}
                    modalGoodsListOk={this.modalSpaceListOk}
                  />
                </Col>
              )}
              <Col>
                <Form.Item label="当前套餐总价：" style={{ width: 'auto' }}>
                  {form.getFieldDecorator('totalPrice', {
                    rules: [{
                      required: true, message: '当前套餐总价不能为空',
                    }],
                    initialValue: fenToYuan(detail?.totalPrice, true) || 0,
                  })(
                    <InputNumber
                      placeholder="0"
                      formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      min={0}
                      step={0.01}
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="起购金额：">
                  {form.getFieldDecorator('minPrice', {
                    rules: [{
                      required: true,
                      message: '请输入起购金额',
                    }],
                    initialValue: detail?.minPrice ? fenToYuan(detail?.minPrice, true) : '',
                  })(
                    <InputNumber
                      placeholder="请输入起购金额"
                      formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      min={0}
                      step={0.01}
                      max={fenToYuan(detail?.totalPrice || 0, true)}
                      disabled={isDetail}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={detail?.packageSpaceVoQs}
              bordered
              showHeader={false}
              expandedRowRender={record => (
                <GoodsListTable
                  record={record}
                  {...this.props}
                  getTotal={this.getTotal}
                  key={record.spaceId}
                  isDetail={isDetail}
                />)}
              rowKey="spaceId"
            />
          </Form>
        </Card>
      </Spin>
    );
  }
}
