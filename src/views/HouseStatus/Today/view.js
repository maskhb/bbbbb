import React, { PureComponent } from 'react';
import { Card, Modal, Input, Select, Popover, Tooltip, Message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { goTo } from 'utils/utils';
import Authorized from 'utils/Authorized';
import { houseTypeList, statusList, getMenuList, getColor, isShow, hasChild, getHouseNum } from 'utils/attr/houseStatus';
import styles from './../view.less';
import RepairModal from './repairModal';
import RetentionModal from './retentionModal';
import WakeUpModal from './wakeUpModal';

const SelectOption = Select.Option;
const Search = Input.Search;
const InputGroup = Input.Group;


@connect(({ houseStatus }) => ({
  houseStatus,
}))

class View extends PureComponent {
  static defaultProps = {};

  state = {
    typeList: houseTypeList,
    roomId: 0,
    orderType: 1,
    searchKey: '',
    roomStatusTagCode: 0,
    tagId: 0,
    tagListOption: [],
    repairVisible: false,
    retentionVisible: false,
    wakeUpVisible: false,
    repairType: 'add',
    retentionType: 'add',
    wakeType: 'add',
  };

  componentDidMount() {
    // this.getTagList();
    this.getTag();
    this.query();
  }

  /* 维修 */
  onRepairCancel() {
    this.setState({
      repairVisible: false,
    });
  }
  onRepairOk() {
    const { dispatch, houseStatus } = this.props;
    const { repairDetail } = houseStatus || {};
    const { roomId, repairType } = this.state;
    const { repairModal } = this;
    repairModal.validateFields((err, values) => {
      if (err) {
        return;
      }
      const postData = Object.assign({}, values);
      if (postData.startTime) {
        postData.startTime = moment(postData.startTime).valueOf();
      }
      if (postData.endTime) {
        postData.endTime = moment(postData.endTime).valueOf();
      }
      postData.addressType = 1;
      postData.roomId = roomId;
      /* 新增 */
      if (repairType === 'add') {
        dispatch({
          type: 'houseStatus/repairSave',
          payload: postData,
        }).then((suc) => {
          if (suc) {
            Message.success('新增成功');
            this.query();
            this.setState({
              repairVisible: false,
            });
          }
        });
      } else {
        if (repairDetail.repairId) {
          postData.repairId = repairDetail.repairId;
        }
        dispatch({
          type: 'houseStatus/repairUpdate',
          payload: postData,
        }).then((suc) => {
          if (suc) {
            Message.success('修改成功');
            this.query();
            this.setState({
              repairVisible: false,
            });
          }
        });
      }
    });
  }

  /* 自留 */
  onRetentionCancel() {
    this.setState({
      retentionVisible: false,
    });
  }
  onRetentionOk() {
    const { dispatch, houseStatus } = this.props;
    const { retentionDetail } = houseStatus || {};
    const { roomId, retentionType } = this.state;
    const { retentionModal } = this;
    retentionModal.validateFields((err, values) => {
      if (err) {
        return '';
      }
      const postData = Object.assign({}, values);
      if (postData.startTime) {
        postData.startTime = moment(postData.startTime).valueOf();
      }
      if (postData.endTime) {
        postData.endTime = moment(postData.endTime).valueOf();
      }
      postData.roomId = roomId;
      if (postData.isSetDirtyRoom) {
        postData.isSetDirtyRoom = 1;
      } else {
        postData.isSetDirtyRoom = 0;
      }
      /* 新增 */
      if (retentionType === 'add') {
        dispatch({
          type: 'houseStatus/retentionAdd',
          payload: postData,
        }).then((suc) => {
          if (suc) {
            Message.success('新增成功');
            this.query();
            this.setState({
              retentionVisible: false,
            });
          }
        });
      } else {
        if (retentionDetail.roomRetentionId) {
          postData.roomRetentionId = retentionDetail.roomRetentionId;
        }
        dispatch({
          type: 'houseStatus/retentionUpdate',
          payload: postData,
        }).then((suc) => {
          if (suc) {
            Message.success('修改成功');
            this.query();
            this.setState({
              retentionVisible: false,
            });
          }
        });
      }
    });
  }

  /* 叫醒 */
  onWakeUpCancel() {
    this.setState({
      wakeUpVisible: false,
    });
  }
  onWakeUpOk() {
    const { wakeUpModal } = this;
    const { dispatch } = this.props;
    const { wakeType, roomId } = this.state;

    wakeUpModal.validateFields(wakeType === 'add' ? ['roomIdList', 'wakeTime'] : ['roomIdList'], (err, values) => {
      if (err) {
        return '';
      }
      const postData = Object.assign({}, values);
      if (postData.wakeTime) {
        postData.wakeTime = moment(postData.wakeTime).valueOf();
      }
      postData.roomId = roomId;
      if (wakeType === 'add') {
        dispatch({
          type: 'houseStatus/wakeAdd',
          payload: postData,
        }).then((suc) => {
          if (suc) {
            Message.success('新增成功');
            this.query();
            this.setState({
              wakeUpVisible: false,
            });
          }
        });
      } else {
        dispatch({
          type: 'houseStatus/wakeCancel',
          payload: postData,
        }).then((suc) => {
          if (suc) {
            Message.success('取消成功');
            this.query();
            this.setState({
              wakeUpVisible: false,
            });
          }
        });
      }
    });
  }

  getTagList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseStatus/getTagList',
      payload: {
        currPage: 1,
        pageSize: 1000,
        orgId: localStorage.user ? JSON.parse(localStorage.user).orgIdSelected : 1,
        status: 1,
      },
    }).then((suc) => {
      if (suc && suc.dataList) {
        const arr = [];
        suc.dataList.map((v) => {
          arr.push({ label: v.tagName, value: v.tagId });
          return '';
        });
        this.setState({
          tagListOption: arr,
        });
      }
    });
  }

  getTag() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseStatus/getTag',
      payload: {
      },
    }).then((suc) => {
      if (suc && suc.tagVOList) {
        const arr = [];
        suc.tagVOList.map((v) => {
          arr.push({ label: v.name, value: v.tagId });
          return '';
        });
        this.setState({
          tagListOption: arr,
        });
      }
    });
  }

  query() {
    const { dispatch } = this.props;
    const { orderType, tagId, roomStatusTagCode, searchKey } = this.state;
    const postData = {
      orderType,
    };
    if (searchKey) {
      postData.queryParam = searchKey;
    }
    if (tagId) {
      postData.tagIdList = [tagId];
    }
    if (roomStatusTagCode) {
      postData.roomStatusTagCodeList = [roomStatusTagCode];
    }
    dispatch({
      type: 'houseStatus/queryToday',
      payload: postData,
    });
  }

  changeOrderType(value) {
    this.setState({
      orderType: value,
    }, () => {
      this.query();
    });
  }

  /* 改变选中 */
  changeChecked(index) {
    const { typeList } = this.state;
    if (index === 0) {
      typeList.map((v) => {
        v.checked = false;
        return v;
      });
    } else {
      typeList[index].checked = !typeList[index].checked;
    }
    this.setState({
      typeList: [...typeList],
    });
  }

  searchToday(value) {
    this.setState({
      searchKey: value,
    }, () => {
      this.query();
    });
  }

  changeRoomStatusTagCode(value) {
    this.setState({
      roomStatusTagCode: value,
    }, () => {
      this.query();
    });
  }

  changeTagId(value) {
    this.setState({
      tagId: value,
    }, () => {
      this.query();
    });
  }

  /* 操作 */
  toOperate(btn, house) {
    const _this = this;
    const { dispatch } = this.props;
    const { roomId, roomNo, gresNo, gresId, gresParentId } = house;
    switch (btn.value) {
      // 散客入住
      case 1:
        goTo(`/checkin/checkinform/add?roomId=${roomId}&roomNo=${roomNo}`);
        break;
      // 房间维修
      case 2:
        this.repairModal.resetFields();
        this.setState({
          repairType: 'add',
          roomId: house.roomId,
          repairVisible: true,
        });
        break;
      // 修改维修
      case 3:
        this.repairModal.resetFields();
        dispatch({
          type: 'houseStatus/repairDetail',
          payload: {
            repairId: gresId,
          },
        }).then((suc) => {
          if (suc) {
            this.setState({
              repairType: 'edit',
              roomId: house.roomId,
              repairVisible: true,
            });
          }
        });

        break;
      // 完成维修
      case 4:
        Modal.confirm({
          title: '确定要完成维修？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'houseStatus/repairFinish',
              payload: {
                repairId: gresId,
              },
            }).then((suc) => {
              if (suc) {
                Message.success('操作成功');
                _this.query();
              } else if (suc === false) {
                Message.error('操作失败');
              }
            });
          },
        });
        break;
      // 房间自留
      case 5:
        this.retentionModal.resetFields();
        this.setState({
          retentionType: 'add',
          roomId: house.roomId,
          retentionVisible: true,
        });
        break;
      // 修改自留占用
      case 6:
        this.retentionModal.resetFields();
        dispatch({
          type: 'houseStatus/retentionDetail',
          payload: {
            roomRetentionId: gresId,
          },
        }).then((suc) => {
          if (suc) {
            this.setState({
              retentionType: 'edit',
              roomId: house.roomId,
              retentionVisible: true,
            });
          }
        });

        break;
      // 结束自留占用
      case 7:
        Modal.confirm({
          title: '确定要结束自留占用？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'houseStatus/retentionClose',
              payload: {
                roomRetentionId: gresId,
              },
            }).then((suc) => {
              if (suc) {
                Message.success('操作成功');
                _this.query();
              } else if (suc === false) {
                Message.error('操作失败');
              }
            });
          },
        });
        break;
      // 房间预订
      case 8:
        goTo(`/checkin/orderform/add?roomId=${roomId}&roomNo=${roomNo}`);
        break;
      // 查看预订详情
      case 9:
        if (gresParentId > 0) {
          goTo(`/checkin/orderform/edit/${gresParentId}`);
        } else {
          goTo(`/checkin/orderform/edit/${gresId}`);
        }
        break;
      // 预订抵达
      case 10:
        goTo(`/checkin/orderform/edit/${gresId}`);
        break;
      // 取消预订
      case 11:
        goTo(`/checkin/orderform?gresNo=${gresNo}`);
        break;
      // 查看登记详情
      case 12:
        goTo(`/checkin/checkinform/edit/${gresId}`);
        break;
      // 房间延住
      case 13:
        goTo(`/checkin/checkinform?gresNo=${gresNo}`);
        break;
      // 结账退房
      case 14:
        goTo(`/checkin/checkinform?gresNo=${gresNo}`);
        break;
      // 设置为脏房
      case 15:
        Modal.confirm({
          title: '确定要设置为脏房？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'houseStatus/dirty',
              payload: {
                roomId,
              },
            }).then((suc) => {
              if (suc) {
                Message.success('操作成功');
                _this.query();
              } else if (suc === false) {
                Message.error('操作失败');
              }
            });
          },
        });
        break;
      // 打扫干净
      case 16:
        Modal.confirm({
          title: '确定打扫干净？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'houseStatus/clean',
              payload: {
                roomId,
              },
            }).then((suc) => {
              if (suc) {
                Message.success('操作成功');
                _this.query();
              } else if (suc === false) {
                Message.error('操作失败');
              }
            });
          },
        });
        break;
      // 新增叫醒
      case 17:
        this.wakeUpModal.resetFields();
        dispatch({
          type: 'houseStatus/getWakeDetail',
          payload: roomId,
        }).then((suc) => {
          if (suc) {
            this.setState({
              wakeType: 'add',
              roomId: house.roomId,
              wakeUpVisible: true,
            });
          }
        });

        break;
      // 取消叫醒
      case 18:
        this.wakeUpModal.resetFields();
        dispatch({
          type: 'houseStatus/getWakeDetail',
          payload: roomId,
        }).then((suc) => {
          if (suc) {
            this.setState({
              wakeType: 'cancel',
              roomId: house.roomId,
              wakeUpVisible: true,
            });
          }
        });
        break;
      // 房间锁定
      case 19:
        Modal.confirm({
          title: '确定要锁定房间？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'houseStatus/lock',
              payload: {
                roomId,
              },
            }).then((suc) => {
              if (suc) {
                Message.success('操作成功');
                _this.query();
              } else if (suc === false) {
                Message.error('操作失败');
              }
            });
          },
        });
        break;
      // 解除锁定
      case 20:
        Modal.confirm({
          title: '确定要取消锁定？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'houseStatus/unlock',
              payload: {
                roomId,
              },
            }).then((suc) => {
              if (suc) {
                Message.success('操作成功');
                _this.query();
              } else if (suc === false) {
                Message.error('操作失败');
              }
            });
          },
        });
        break;
      // 查看未来预订单
      case 21:
        dispatch({
          type: 'houseStatus/futureGres',
          payload: {
            roomId,
          },
        }).then((suc) => {
          if (suc) {
            goTo(`/checkin/orderform/edit/${suc}`);
          }
        });
        break;
      default:
        break;
    }
  }

  /* 弹出框 */
  renderModal() {
    const {
      repairVisible, retentionVisible, wakeUpVisible, wakeType,
      roomId, repairType, retentionType,
    } = this.state;
    return (
      <div>
        <RepairModal
          ref={(inst) => { this.repairModal = inst; }}
          repairType={repairType}
          visible={repairVisible}
          onCancel={this.onRepairCancel.bind(this)}
          onOk={this.onRepairOk.bind(this)}
        />
        <RetentionModal
          ref={(inst) => { this.retentionModal = inst; }}
          retentionType={retentionType}
          visible={retentionVisible}
          onCancel={this.onRetentionCancel.bind(this)}
          onOk={this.onRetentionOk.bind(this)}
        />
        <WakeUpModal
          ref={(inst) => { this.wakeUpModal = inst; }}
          wakeType={wakeType}
          roomId={roomId}
          visible={wakeUpVisible}
          onCancel={this.onWakeUpCancel.bind(this)}
          onOk={this.onWakeUpOk.bind(this)}
        />

      </div>
    );
  }

  /* 头部筛选 */
  renderSortHeader() {
    const { houseStatus } = this.props;
    const { orderType, typeList } = this.state;
    // const { orderType, roomStatusTagCode, tagId, tagListOption } = this.state;
    const options = [
      { value: 1, label: '按房型展示' },
      { value: 2, label: '按楼栋展示' },
      { value: 3, label: '按楼层展示' },
    ];
    return (
      <div className={styles.searchDom}>
        <div className="fl_r">
          <InputGroup compact>
            <Select
              placeholder="请选择"
              className={styles.sortSelect}
              value={orderType}
              onChange={this.changeOrderType.bind(this)}
            >
              {
                options.map((item) => {
                  return (
                    <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>
                  );
                })
              }
            </Select>
            <Search
              className={styles.searchInput}
              placeholder="房间号/客户姓名"
              onSearch={this.searchToday.bind(this)}
              enterButton
            />
          </InputGroup>
        </div>
        {
          /*
          <Select
          placeholder="请选择"
          className={styles.sortSelect}
          value={roomStatusTagCode}
          onChange={this.changeRoomStatusTagCode.bind(this)}
        >
          <SelectOption key={0} value={0}>全部房态</SelectOption>
          {
            statusList.map((item) => {
              return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
            })
          }
        </Select>
        <Select
          placeholder="请选择"
          className={styles.sortSelect}
          value={tagId}
          onChange={this.changeTagId.bind(this)}
        >
          <SelectOption key={0} value={0}>全部标签</SelectOption>
          {
            tagListOption.map((item) => {
              return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
            })
          }
        </Select>
          */
        }
        <ul className={styles.houstTypeListNew}>
          {
            typeList.map((v, i) => {
              return (
                <li key={i} onClick={this.changeChecked.bind(this, i)}>
                  <i className={`${v.checked ? 'checked' : ''} ${v.color}`} />
                  <span>
                    {v.label}
                    (
                    {houseStatus?.queryToday?.statusCounts ? (getHouseNum(v.value, houseStatus.queryToday.statusCounts)) : ''}
                    )
                  </span>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }


  /* 返回菜单 */
  renderMenuList(house) {
    const btnList = getMenuList(house);
    return (
      <ul className={styles.menuList}>
        {
          btnList.map((v, i) => {
            return (
              <Authorized authority={v.permiss || null} key={i}>
                <li
                  onClick={() => {
                    this.toOperate(v, house);
                  }}
                >{v.label}
                </li>
              </Authorized>

            );
          })
        }
      </ul>
    );
  }

  renderStatusIcon(codeList) {
    if (codeList) {
      return codeList.map((v, i) => {
        let title = '';
        let iconNum = 1;
        statusList.map((sv) => {
          if (sv.value === v) {
            title = sv.label;
            iconNum = sv.iconNum;
          }
          return sv;
        });
        return (
          <Tooltip title={title} key={i}>
            <li className={`icon${iconNum}`} />
          </Tooltip>
        );
      });
    }
  }

  renderCenterPopover(vi) {
    return (
      <div className="forwardToolTip">
        <p>客户姓名：{vi?.guestNames?.join('，')}</p>
        <p>业务来源：{vi.sourceName}</p>
      </div>
    );
  }

  renderCenter(vi) {
    let dom = '';
    switch (parseInt(vi.roomStatusCode, 10)) {
      case 1002:
      case 1003:
      case 1004:
        dom = (
          <Popover
            content={this.renderCenterPopover(vi)}
          >
            <div className="left f_12 p_10">
              <span className="omit">{vi?.guestNames?.join('，')}</span><i className="channel">--{vi.sourceName}</i>
            </div>
          </Popover>
        );
        break;
      case 1005:
        dom = <i className={styles.repairIcon} />;
        break;
      default:
        break;
    }
    return (
      <div className="center">
        {dom}
      </div>
    );
  }

  renderTitle(vi) {
    const { orderType } = this.state;
    let dom = '';
    switch (orderType) {
      case 1:
        dom = (
          <Tooltip title={`${vi.buildingName}-${vi.roomNo}`}>
            <span>{`${vi.buildingName}-${vi.roomNo}`}</span>
          </Tooltip>
        );
        break;
      case 2:
        dom = (
          <Tooltip title={`${vi.roomNo}-${vi.typeName}`}>
            <span>{`${vi.roomNo}-${vi.typeName}`}</span>
          </Tooltip>
        );
        break;
      case 3:
        dom = (
          <Tooltip title={`${vi.buildingName}-${vi.roomNo}-${vi.typeName}`}>
            <span>{`${vi.buildingName}-${vi.roomNo}-${vi.typeName}`}</span>
          </Tooltip>
        );
        break;
      default:
        dom = (
          <Tooltip title={`${vi.buildingName}-${vi.roomNo}`}>
            <span>{`${vi.buildingName}-${vi.roomNo}`}</span>
          </Tooltip>
        );
        break;
    }
    return (
      <div className="title">
        {dom}
      </div>
    );
  }

  /* 返回列表 */
  renderHouse() {
    const { typeList } = this.state;
    const { houseStatus } = this.props;
    return (
      <div>
        {
          houseStatus?.queryToday?.detailGroups?.map((v, i) => {
            if (hasChild(v.roomDetailsVOList, typeList)) {
              return (
                <div key={i} className={styles.typeDom}>
                  <h1>{v.typeName}</h1>
                  <ul className={styles.diyHouseList}>
                    {
                      v.roomDetailsVOList.map((vi, ii) => {
                        if (isShow(vi.roomStatusCode, typeList)) {
                          return (
                            <li key={ii} className={styles[getColor(vi.roomStatusCode)]}>
                              {
                                this.renderTitle(vi)
                              }
                              {
                                vi.roomStatusCode === '1004' ? (
                                  <Tooltip title="今日离">
                                    <i className="leave" />
                                  </Tooltip>) : ''
                              }
                              {
                                this.renderCenter(vi)
                              }
                              <div className="toolBar">
                                <ul>
                                  {this.renderStatusIcon(vi.roomStatusTagCodeList)}
                                </ul>
                                <Popover
                                  placement="rightTop"
                                  content={this.renderMenuList(vi)}
                                  title={`${vi.buildingName}-${vi.roomNo}`}
                                >
                                  <i className="more" />
                                </Popover>
                              </div>
                            </li>
                          );
                        } else {
                          return false;
                        }
                      })
                    }
                  </ul>
                </div>
              );
            } else {
              return false;
            }
          })
        }
      </div>
    );
  }


  render() {
    // const { comment } = this.props;
    return (
      <Card title={this.renderSortHeader()}>
        {this.renderModal()}
        {this.renderHouse()}
      </Card>
    );
  }
}

export default View;
