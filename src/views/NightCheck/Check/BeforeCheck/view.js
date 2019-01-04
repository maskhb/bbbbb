import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button, Tabs, Modal, Form, Input, Radio, Select, DatePicker, Tag } from 'antd';
import moment from 'moment/moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { fenToYuan } from 'utils/money';
import { handleTime } from 'utils/utils';
import ModalWithForm from './ModalWithForm';
import getColumns from './columns';
import styles from '../../index.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let timer = null;

@Form.create()
@connect(({ nightCheck, checkIn, common, loading }) => ({
  nightCheck,
  checkIn,
  common,
  loading: loading.models.nightCheck,
}))
export default class List extends PureComponent {
  static defaultProps = {};
  state = {
    currentTab: '1',
    cancelModal: {
      priceInfo: {},
      visible: false,
      title: '取消',
    },
    delayModal: {
      visible: false,
      title: '延到',
      initData: {},
    },
    returnModal: {
      title: '退房',
      visible: false,
      priceInfo: {},
    },
    linkModal: {
      title: '联房',
      visible: false,
      selectedRoomId: null,
      linkHouseList: [],
      searchRoom: [],
    },
    companyList: [],
  };
  componentDidMount() {
    this.search.handleSearch();
    this.getCompanyList();
  }
  getHouseList(value, cb) { // 模糊搜索房屋列表
    const that = this;
    const { dispatch } = this.props;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      dispatch({
        type: 'nightCheck/searchRoom',
        payload: {
          roomNo: value,
        },
      }).then(() => {
        const result = that.props.nightCheck?.searchRoom;
        if (cb && typeof cb === 'function') {
          cb(result);
        }
      });
    }, 300);
  }
  getCompanyList() {
    const that = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'nightCheck/getCompany',
      payload: {
        accountReceivablePageVO: {
          accountReceivableQueryVO: {},
          currPage: 1,
          pageSize: 1000,
        },
      },
    }).then(() => {
      const result = that.props.nightCheck?.companyList;
      that.setState({
        companyList: result?.dataList || [],
      });
    });
  }
  /*  取消或No Show操作弹窗 Start */
  cancelModalShow(rows, type) {
    const that = this;
    const { dispatch } = this.props;
    const { cancelModal } = this.state;
    dispatch({
      type: 'nightCheck/getDepositInfo',
      payload: {
        gresId: rows.gresId,
      },
    }).then(() => {
      const result = that.props.nightCheck.priceInfo;
      that.setState({
        cancelModal: Object.assign({}, cancelModal, {
          visible: true,
          type,
          title: type === 'cancel' ? '取消预定' : 'No Show',
          currentObj: rows,
          priceInfo: result,
        }),
      });
    });
  }
  cancelModalOk(data) {
    const that = this;
    const { dispatch } = this.props;
    const { cancelModal } = this.state;
    switch (cancelModal.type) {
      // case 'cancel':
      //   dispatch({
      //     type: 'nightCheck/cancel',
      //     payload: {
      //       gresId: cancelModal.currentObj.gresId,
      //       remark: data.remark,
      //     },
      //   }).then(() => {
      //     const result = that.props.nightCheck?.cancel;
      //     if (result) {
      //       Modal.success({
      //         title: '提示',
      //         content: '取消成功！',
      //         onOk() {
      //           that.search.handleSearch();
      //           that.handleModalCancel('cancelModal');
      //         },
      //       });
      //     }
      //   });
      //   break;
      case 'noShow':
        dispatch({
          type: 'nightCheck/noShow',
          payload: {
            gresId: cancelModal.currentObj.gresId,
            remark: data.remark,
          },
        }).then(() => {
          const result = that.props.nightCheck?.noShow;
          if (result) {
            Modal.success({
              title: '提示',
              content: 'No Show成功！',
              onOk() {
                that.search.handleSearch();
                that.handleModalCancel('cancelModal');
              },
            });
          } else {
            Modal.error({
              title: '提示',
              content: 'No Show失败！',
            });
          }
        });
        break;
      default:
    }
  }
  /*  取消或No Show操作弹窗 End */
  /*  退房或补结账操作弹窗 START */
  returnModalShow(rows, type) {
    const that = this;
    const { dispatch } = this.props;
    const { returnModal } = this.state;
    dispatch({
      type: 'nightCheck/preCheckOut',
      payload: {
        gresId: rows.gresId,
      },
    }).then(() => {
      const result = that.props.nightCheck.preCheckOut;
      that.setState({
        returnModal: Object.assign({}, returnModal, {
          visible: true,
          type,
          priceInfo: result,
          title: type === 'return' ? '退房' : '补结账',
          currentObj: rows,
        }),
      });
    });
  }
  returnModalOk(data) {
    const that = this;
    const { dispatch } = this.props;
    const { returnModal } = this.state;
    let params = {};
    let interfaceString = '';
    switch (returnModal.type) {
      case 'return':
        switch (data.payWay) {
          case 1:
            interfaceString = 'nightCheck/returnHouse';
            params = {
              gresId: returnModal.currentObj.gresId,
              payWay: data.payWay,
              roomId: returnModal.currentObj.roomId,
              companyId: data?.companyId,
            };
            break;
          case 2:
            interfaceString = 'nightCheck/returnHouseCredit';
            params = {
              tempAccountRegVO: {
                regNo: returnModal.currentObj.gresNo,
                roomNo: returnModal.currentObj.roomNo,
                roomType: returnModal.currentObj.roomType,
                roomTypeName: returnModal.currentObj.roomTypeName,
                checkInDate: returnModal.currentObj.arrivalDate,
                checkOutDate: returnModal.currentObj.departureDate,
                owner: returnModal.currentObj.guestName,
                accountBalance: returnModal.priceInfo.receivableAmount,
                regTime: new Date().getTime(),
                remark: '',
              },
            };
            break;
          case 3:
            interfaceString = 'nightCheck/returnHouseProtocol';
            params = {
              agreementUnitAccountVO: {
                accountId: data.companyId,
                gresId: returnModal.currentObj.gresId,
              },
            };
            break;
          default:
        }
        dispatch({
          type: interfaceString,
          payload: params,
        }).then(() => {
          const { returnHouse, returnHouseCredit, returnHouseProtocol } = that.props.nightCheck;
          switch (data.payWay) {
            case 1:
              if (returnHouse && typeof returnHouse === 'boolean') {
                Modal.success({
                  title: '提示',
                  content: '退房成功！',
                  onOk() {
                    that.search.handleSearch();
                    that.returnModalCancel();
                  },
                });
              }
              break;
            case 2:
              if (returnHouseCredit && typeof returnHouseCredit === 'number') {
                Modal.success({
                  title: '提示',
                  content: '退房成功！',
                  onOk() {
                    that.search.handleSearch();
                    that.returnModalCancel();
                  },
                });
              }
              break;
            case 3:
              if (returnHouseProtocol && typeof returnHouseProtocol === 'number') {
                Modal.success({
                  title: '提示',
                  content: '退房成功！',
                  onOk() {
                    that.search.handleSearch();
                    that.returnModalCancel();
                  },
                });
              }
              break;
            default:
          }
        });
        break;
      case 'appendCheckOut':
        dispatch({
          type: 'nightCheck/appendCheckOut',
          payload: {
            gresId: returnModal.currentObj.gresId,
            payWay: data.payWay,
          },
        }).then(() => {
          const result = that.props.nightCheck.appendCheckOut;
          if (result && typeof result === 'boolean') {
            Modal.success({
              title: '提示',
              content: '补结账成功！',
              onOk() {
                that.search.handleSearch();
                that.returnModalCancel();
              },
            });
          }
        });
        break;
      default:
    }
  }
  returnModalCancel() {
    const { returnModal } = this.state;
    this.setState({
      returnModal: Object.assign({}, returnModal, {
        visible: false,
        priceInfo: {},
      }),
    });
  }
  /*  退房或补结账操作弹窗 END */
  /*  延到或延住操作弹窗 Start */
  delayModalShow(rows, type) { // type: 'delay'延到  'stayLong'延住
    const { delayModal } = this.state;
    this.setState({
      delayModal: Object.assign({}, delayModal, {
        visible: true,
        type,
        initData: type === 'delay' ? {
          arrivalDate: [
            moment(rows.arrivalDate),
            moment(rows.departureDate),
          ],
        } : {
          departureDate: moment(rows.departureDate),
        },
        title: type === 'delay' ? '延到' : '延住',
        currentObj: rows,
      }),
    });
  }
  delayModalOk() {
    const that = this;
    const { common, dispatch, nightCheck } = this.props;
    const { delayModal } = this.state;
    const { setModalWithForm: { delayForm } } = common;
    const businessTime = nightCheck?.wrongList?.businessTime || 0;
    delayForm.validateFields((err, data) => {
      if (!err) {
        switch (delayModal.type) {
          case 'delay':
            if (handleTime(1, data.arrivalDate[0]) < handleTime(1, new Date())) {
              Modal.error({
                title: '提示',
                content: '入住日期不能早于当天!',
              });
            }
            dispatch({
              type: 'nightCheck/delay',
              payload: {
                gresId: delayModal.currentObj.gresId,
                arrivalDate: new Date(data.arrivalDate[0]).getTime(),
                departureDate: new Date(data.arrivalDate[1]).getTime(),
              },
            }).then(() => {
              const result = that.props.nightCheck?.delay;
              if (result && typeof result === 'boolean') {
                Modal.success({
                  title: '提示',
                  content: '延到成功！',
                  onOk() {
                    that.search.handleSearch();
                    that.handleModalCancel('delayModal');
                  },
                });
              }
            });
            break;
          case 'stayLong':
            if (handleTime(1, delayModal.currentObj.departureDate)
              > handleTime(1, data.departureDate)) {
              Modal.error({
                title: '提示',
                content: '新的离店日期不能早于原有离店日期！',
              });
            } else if (handleTime(1, data.departureDate) === handleTime(1, businessTime)) {
              that.handleModalCancel('delayModal');
            } else {
              dispatch({
                type: 'nightCheck/stayLong',
                payload: {
                  gresId: delayModal.currentObj.gresId,
                  departureDate: new Date(data.departureDate).getTime(),
                },
              }).then(() => {
                const result = that.props.nightCheck.stayLong;
                if (result && typeof result === 'boolean') {
                  Modal.success({
                    title: '提示',
                    content: '延住成功！',
                    onOk() {
                      that.search.handleSearch();
                      that.handleModalCancel('delayModal');
                    },
                  });
                }
              });
            }
            break;
          default:
        }
      }
    });
  }
  /*  延到或延住操作弹窗 End */
  /*  联房操作弹窗 Start */
  linkModalShow(rows) {
    const that = this;
    const { linkModal } = this.state;
    this.queryLinkDetail(rows.gresId, (linkHouseList) => {
      that.setState({
        linkModal: Object.assign({}, linkModal, {
          currentObj: rows,
          visible: true,
          linkHouseList,
        }),
      });
    });
  }
  queryLinkDetail(gresId, cb) {
    const that = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'nightCheck/linkHouseDetail',
      payload: {
        gresId,
      },
    }).then(() => {
      let result = that.props.nightCheck.linkHouseDetail;
      if (result?.length > 0) {
        result = result.map((v) => {
          return { buildingRoomNo: v.buildingRoomNo, roomId: v.roomId };
        });
      }
      if (cb && typeof cb === 'function') {
        cb(result);
      }
    });
  }
  linkModalOk() {
    const that = this;
    const { dispatch } = this.props;
    const { linkModal } = this.state;
    if (linkModal.selectedRoomId) {
      dispatch({
        type: 'nightCheck/linkHouse',
        payload: {
          gresId: linkModal.currentObj.gresId,
          roomId: linkModal.selectedRoomId,
        },
      }).then(() => {
        const result = that.props.nightCheck.linkHouse;
        if (result && typeof result === 'boolean') {
          Modal.success({
            title: '提示',
            content: '添加成功！',
            onOk() {
              that.queryLinkDetail(linkModal.currentObj.gresId, (linkHouseList) => {
                that.setState({
                  linkModal: Object.assign({}, linkModal, {
                    linkHouseList,
                    inputValue: '',
                  }),
                });
              });
            },
          });
        }
      });
    } else {
      Modal.error({
        title: '提示',
        content: '请先输入正确的房号',
      });
    }
  }
  linkModalCancel() {
    const { linkModal } = this.state;
    this.search.handleSearch();
    this.setState({
      linkModal: Object.assign({}, linkModal, {
        visible: false,
        selectedRoomId: null,
        linkHouseList: [],
      }),
    });
  }
  handleSelectChange(value, e) {
    const { linkModal } = this.state;
    this.setState({
      linkModal: Object.assign({}, linkModal, {
        selectedRoomId: e.props.value,
      }),
    });
  }
  handleSelectSearch(value) {
    const that = this;
    const { linkModal } = this.state;
    this.getHouseList(value, (searchRoom) => {
      that.setState({
        linkModal: Object.assign({}, linkModal, {
          searchRoom,
        }),
      });
    });
  }
  deleteLink(index) {
    const that = this;
    const { dispatch } = this.props;
    const { linkModal } = this.state;
    Modal.confirm({
      title: '提示',
      content: `房间${linkModal.linkHouseList[index].buildingRoomNo}确定取消联房？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'nightCheck/cancelLinkHouse',
          payload: {
            roomId: linkModal.linkHouseList[index].roomId,
          },
        }).then(() => {
          const result = that.props.nightCheck.cancelLinkHouse;
          if (result && typeof result === 'boolean') {
            Modal.success({
              title: '提示',
              content: '取消联房成功！',
              onOk() {
                const linkHouseList = Object.assign([], linkModal.linkHouseList);
                linkHouseList.splice(index, 1);
                that.setState({
                  linkModal: Object.assign({}, linkModal, {
                    linkHouseList,
                  }),
                });
              },
            });
          }
        });
      },
    });
  }
  /*  联房操作弹窗 End */
  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const { currentTab } = this.state;
    const param = {
      orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
      type: Number(currentTab),
      currentPage: values?.pageInfo?.currPage || 1,
      pageSize: values?.pageInfo?.pageSize || 10,
    };
    return dispatch({
      type: 'nightCheck/wrongList',
      payload: param,
    });
  };
  handleModalCancel(type) {
    this.setState({
      [type]: Object.assign({}, this.state[type], {
        visible: false,
      }),
    });
  }
  tabChange(currentTab) {
    const { dispatch } = this.props;
    dispatch({
      type: 'nightCheck/wrongList',
      payload: {
        orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
        type: Number(currentTab),
        currentPage: 1,
        pageSize: 10,
      },
    }).then(() => {
      this.setState({
        currentTab,
      });
    });
  }
  renderTab(type) {
    const { nightCheck, loading, searchDefault } = this.props;
    const mesResult = nightCheck?.wrongList;
    const that = this;
    return (
      <Table
        className={styles.iDoNotLikeAdd}
        loading={loading}
        rowKey={(record, index) => `${record.gresId}${index}`}
        searchDefault={searchDefault}
        columns={getColumns(this, type, searchDefault)}
        onChange={(pagination) => {
          that.handleSearch({
            pageInfo: {
              currPage: pagination.current,
              pageSize: pagination.pageSize,
            },
          });
        }}
        dataSource={mesResult?.pageQuery?.dataList}
        expandedRowRender={null}
        pagination={{
          current: mesResult?.pageQuery?.currPage || 1,
          pageSize: mesResult?.pageQuery?.pageSize || 10,
          total: mesResult?.pageQuery?.totalCount || 0,
        }}
        disableRowSelection
      />
    );
  }
  renderCancelModal() {
    const { cancelModal } = this.state;
    return (
      <ModalWithForm
        id="cancelForm"
        title={cancelModal.title}
        initFormData={{}}
        visible={cancelModal.visible}
        modalSubmit={this.cancelModalOk.bind(this)}
        modalCancel={this.handleModalCancel.bind(this, 'cancelModal')}
      >
        <FormItem label="已付订金" name="depostAmount" rules={[]} className={styles.inlineFormItem}>
          <div>
            <span>&yen;{ fenToYuan(cancelModal.priceInfo?.depostAmount) }，</span>
            <span style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)', marginLeft: 10 }}>已退金额：</span>
            <span>&yen;{ fenToYuan(cancelModal.priceInfo?.refundAmount) }</span>
          </div>
        </FormItem>
        <FormItem label="备注" name="remark" rules={[{ required: true, message: '最多200个字符', max: 200 }]}>
          <TextArea rows={4} />
        </FormItem>
      </ModalWithForm>
    );
  }
  renderDelayModal() {
    const { delayModal } = this.state;
    return (
      <ModalWithForm
        id="delayForm"
        title={delayModal.title}
        initFormData={delayModal.initData}
        visible={delayModal.visible}
        modalSubmit={this.delayModalOk.bind(this)}
        modalCancel={this.handleModalCancel.bind(this, 'delayModal')}
      >
        {
          (delayModal.type === 'delay') ? (
            <FormItem label="入离店日期" name="arrivalDate" rules={[]}>
              <RangePicker />
            </FormItem>
          ) : (
            <FormItem label="离店日期" name="departureDate" rules={[]}>
              <DatePicker />
            </FormItem>
          )
        }
      </ModalWithForm>
    );
  }
  renderReturnModal() {
    const { common } = this.props;
    const { returnModal, companyList } = this.state;
    const { setModalWithForm: { returnForm } } = common;
    const formValue = (returnForm && returnForm.getFieldsValue()) || {};
    return (
      <ModalWithForm
        id="returnForm"
        title={returnModal.title}
        initFormData={{ payWay: 1 }}
        visible={returnModal.visible}
        modalSubmit={this.returnModalOk.bind(this)}
        modalCancel={this.returnModalCancel.bind(this)}
      >
        <FormItem label="当前总消费" name="totalFee" rules={[]}>
          <span>&yen;{fenToYuan(returnModal.priceInfo?.totalFee)}</span>
        </FormItem>
        <FormItem label="总收款" name="totalReceipt" rules={[]}>
          <span>&yen;{fenToYuan(returnModal.priceInfo?.totalReceipt)}</span>
        </FormItem>
        <FormItem label="应收客人" name="receivableAmount" rules={[]}>
          <span>&yen;{fenToYuan(returnModal.priceInfo?.receivableAmount)}</span>
        </FormItem>
        <FormItem label="结账方式" name="payWay" rules={[{ required: true, message: '请选择结账方式' }]}>
          {
            returnModal.type === 'return' ? (
              <RadioGroup>
                <Radio value={1}>现结</Radio>
                <Radio value={2}>临时挂账</Radio>
                <Radio value={3}>协议单位挂账</Radio>
              </RadioGroup>
            ) : (
              <RadioGroup>
                <Radio value={1}>现结</Radio>
              </RadioGroup>
            )
          }

        </FormItem>
        {
          formValue.payWay === 3 ? (
            <FormItem label="协议单位" name="companyId" rules={[{ required: true, message: '请选择协议单位' }]}>
              <Select>
                {companyList.map(v => (
                  <Select.Option key={v.accountId} value={v.accountId}>
                    {v.accountName}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          ) : ''
        }
      </ModalWithForm>
    );
  }
  renderLinkModal() { // 联房
    const { linkModal } = this.state;
    return (
      <Modal
        title={linkModal.title}
        visible={linkModal.visible}
        onCancel={this.linkModalCancel.bind(this)}
        footer={null}
      >
        <div className={styles.formItem}>
          <div className={styles.formLabel}>房号：</div>
          <div className={styles.formValue}>
            <Select
              showSearch
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              value={linkModal.selectedRoomId}
              style={{ width: 200 }}
              onSearch={this.handleSelectSearch.bind(this)}
              onChange={this.handleSelectChange.bind(this)}
              notFoundContent={null}
            >
              {linkModal?.searchRoom.map(v =>
                <Select.Option key={v.roomId} value={v.roomId}>{v.buildingRoomNo}</Select.Option>
               )}
            </Select>
            <a onClick={this.linkModalOk.bind(this)}>添加</a>
          </div>
        </div>
        <div className={styles.formItem}>
          <div className={styles.formLabel}>当前次房：</div>
          <div className={styles.formValue}>
            {
              linkModal.linkHouseList.map((v, i) => (
                <Tag
                  key={v.roomId}
                  closable
                  onClose={this.deleteLink.bind(this, i)}
                >{v.buildingRoomNo}
                </Tag>
              ))
            }
          </div>
        </div>
      </Modal>
    );
  }
  render() {
    const { nightCheck, searchDefault } = this.props;
    const { currentTab } = this.state;
    const mesResult = nightCheck?.wrongList;
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.title}>
            <div className={styles.titleName}>执行夜审_夜审前需解决事项</div>
            <div className={styles.time}>当前营业日：{moment(mesResult?.businessTime).format('YYYY-MM-DD')}</div>
            <Link to="/nightcheck/check/priceCheck"><Button className={styles.nextButton} type="primary">下一步</Button></Link>
          </div>
          <PanelList>
            {/* 搜索条件 */}
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            />
            <Batch />
            <Tabs type="card" onChange={this.tabChange.bind(this)} activeKey={currentTab}>
              <Tabs.TabPane tab={`应到未到散客(${mesResult?.notToGuestCount || 0})`} key="1">{this.renderTab(1)}</Tabs.TabPane>
              <Tabs.TabPane tab={`应到未到团队(${mesResult?.notToTeamCount || 0})`} key="2">{this.renderTab(2)}</Tabs.TabPane>
              <Tabs.TabPane tab={`应离未离住客(${mesResult?.notAwayGuestCount || 0})`} key="3">{this.renderTab(3)}</Tabs.TabPane>
            </Tabs>
          </PanelList>
          {this.renderCancelModal()}
          {this.renderDelayModal()}
          {this.renderReturnModal()}
          {this.renderLinkModal()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
