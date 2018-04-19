/*
 * @Author: wuhao
 * @Date: 2018-04-16 20:26:21
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-17 17:22:58
 *
 * 选择商品
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Modal, Button, Input, Table, Row, Col } from 'antd';

import PopconfirmSelectGoodsSpec from 'components/PopconfirmSelectGoodsSpec';

import styles from './index.less';

const { Search } = Input;

class ModalSelectGoods extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
  }

  getColumns = () => {
    return [
      {
        title: '商品信息',
        dataIndex: 'goodsName',
        render: (text, record, index) => {
          return (
            <Row type="flex">
              <Col>
                <img className="select_goods_img" src="https://www.baidu.com/img/bd_logo1.png" alt="" />
              </Col>
              <Col>
                <div className="select_goods_name">
                  <span>索菲亚 1030样板间次卧衣柜HA11（仅限12#04户型）三室两厅一卫115m²</span>
                </div>
                <div className="select_goods_oper">
                  {
                    index % 2 === 0 ? (
                      <span>
                        已选:1.8主柜*2门*组装（
                        <PopconfirmSelectGoodsSpec dataSource={[{ key: 1 }, { key: 2 }]}>
                          <a>修改</a>
                        </PopconfirmSelectGoodsSpec>
                        ）
                      </span>
                    ) : (
                      <PopconfirmSelectGoodsSpec dataSource={[{ key: 1 }, { key: 2 }]}>
                        <Button type="primary" size="small">选择规格</Button>
                      </PopconfirmSelectGoodsSpec>
                    )
                  }

                </div>
              </Col>
            </Row>
          );
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        width: '90px',
      },
      {
        title: '库存',
        dataIndex: 'goodsNum',
        width: '80px',
      },
      {
        title: '购买数量',
        dataIndex: 'buyNum',
        width: '80px',
        render: (text, record, index) => {
          return index % 2 === 0 ? '' : (
            <Input />
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'oper',
        width: '80px',
        render: (text, record, index) => {
          let elm = <Button>选取</Button>;

          if (index % 2 === 0) {
            elm = <Button type="primary">取消</Button>;
          }

          return elm;
        },
      },
    ];
  }

  /**
   * 用于判断是否选择的map
   */
  RecordSelectMap = {

  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleSearch = (e) => {
    console.log(e);
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
    });
  }

  handleModalOk = () => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    const { hideBtn, className } = this.props;
    const { showModal, loading } = this.state;

    const btnElm = <Button type="primary" onClick={this.handleButtonClick}>选择商品</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="选择商品"
        okText="确定使用"
        width="700px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
        className={classNames(className, styles.component_modal_select_goods)}
      >
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Search
            placeholder="请输入搜索关键词"
            enterButton
            onSearch={this.handleSearch}
            style={{
              width: 300,
            }}
          />
        </div>
        <Table
          dataSource={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}
          columns={this.getColumns()}
          size="small"
          locale={{
            emptyText: '没有相关商品，请换个关键词搜索',
          }}
          pagination={{
            pageSize: 4,
          }}
        />
      </Modal>,
    ];
  }
}

export default ModalSelectGoods;
