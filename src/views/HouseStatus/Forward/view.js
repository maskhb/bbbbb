import React, { PureComponent } from 'react';
import { Card, Modal, Select, DatePicker, Popover, Tooltip, Message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { goTo } from 'utils/utils';
import Authorized from 'utils/Authorized';
import { forwardHouseTypeList, getWeekStr, getColor, getForwardStyle, getForwardMenuList } from 'utils/attr/houseStatus';
import RepairModal from './repairModal';
import RetentionModal from './retentionModal';
import styles from './../view.less';

const SelectOption = Select.Option;

const nowTime = new Date();
nowTime.setHours(0);
nowTime.setMinutes(0);
nowTime.setSeconds(0);
nowTime.setMilliseconds(0);

@connect(({ houseStatus }) => ({
  houseStatus,
}))

class View extends PureComponent {
  static defaultProps = {};

  state = {
    startTime: nowTime.getTime(),
    buildId: 0,
    roomTypeId: 0,
    buildListOption: [],
    roomTypeListOption: [],
    room: {
      startTime: 0,
    },
    repairVisible: false,
    retentionVisible: false,
    repairType: 'add',
    retentionType: 'add',
  };

  componentDidMount() {
    this.getBuildList();
    this.getRoomTypeList();
    this.query();
  }

  /* 维修 */
  onRepairCancel() {
    this.setState({
      repairVisible: false,
    });
  }
  onRepairOk() {
    const { dispatch } = this.props;
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
      postData.roomId = roomId;
      postData.addressType = 1;
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
    const { dispatch } = this.props;
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
    // this.setState({
    //   retentionVisible: false,
    // });
  }

  getBuildList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseStatus/queryBuild',
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
          arr.push({ label: v.buildingName, value: v.buildingId });
          return '';
        });
        this.setState({
          buildListOption: arr,
        });
      }
    });
  }

  getRoomTypeList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'houseStatus/queryRoomType',
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
          arr.push({ label: v.roomTypeName, value: v.roomTypeId });
          return '';
        });
        this.setState({
          roomTypeListOption: arr,
        });
      }
    });
  }

  changeBuildType(value) {
    this.setState({
      buildId: value,
    }, () => {
      this.query();
    });
  }

  changeRoomType(value) {
    this.setState({
      roomTypeId: value,
    }, () => {
      this.query();
    });
  }

  changeTime(value) {
    const nowDate = new Date();
    nowDate.setHours(0);
    nowDate.setMinutes(0);
    nowDate.setSeconds(0);
    nowDate.setMilliseconds(0);
    if (value.valueOf() < nowDate.getTime()) {
      Message.error('不能早于当前时间');
    } else {
      const selectTime = value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).valueOf();
      this.setState({
        startTime: selectTime,
      }, () => {
        this.query();
      });
    }
  }


  query() {
    const { dispatch } = this.props;
    const { startTime, buildId, roomTypeId } = this.state;
    const postData = {
      startTime,
    };
    if (buildId) {
      postData.buildingIdList = [buildId];
    }
    if (roomTypeId) {
      postData.roomTypeIdList = [roomTypeId];
    }
    dispatch({
      type: 'houseStatus/queryForward',
      payload: postData,
    });
  }

  toOperate(btn, room, dateTime) {
    const _this = this;
    const roomObj = Object.assign({}, room);
    const { dispatch } = this.props;
    const { roomId, roomNo, gresId, gresNo, gresParentId } = roomObj || {};
    if (dateTime) {
      roomObj.startTime = dateTime;
    }

    const preLinkName = `${roomObj.roomStatusCode === '10021' ? 'teambooking' : 'orderform'}`;

    switch (btn.value) {
      // 房间维修
      case 1:
        this.repairModal.resetFields();
        this.setState({
          room: roomObj,
          repairType: 'add',
          roomId,
          repairVisible: true,
        });
        break;
      // 房间自留
      case 2:
        this.retentionModal.resetFields();
        this.setState({
          room: roomObj,
          retentionType: 'add',
          roomId,
          retentionVisible: true,
        });
        break;
      // 散客预订
      case 3:
        goTo(`/checkin/orderform/add?roomId=${roomId}&roomNo=${roomNo}&startTime=${roomObj.startTime}`);
        break;
      // 查看预订详情
      case 4:
        if (gresParentId > 0) {
          goTo(`/checkin/${preLinkName}/edit/${gresParentId}`);
        } else {
          goTo(`/checkin/${preLinkName}/edit/${gresId}`);
        }

        break;
      // 预订抵达
      case 5:
        goTo(`/checkin/${preLinkName}/edit/${gresId}`);
        break;
      // 取消预订
      case 6:
        goTo(`/checkin/${preLinkName}?gresNo=${gresNo}`);
        break;
      // 查看登记详情
      case 7:
        goTo(`/checkin/checkinform/edit/${gresId}`);
        break;
      // 房间延住
      case 8:
        goTo(`/checkin/checkinform?gresNo=${gresNo}`);
        break;
      // 结账退房
      case 9:
        goTo(`/checkin/checkinform?gresNo=${gresNo}`);
        break;
      // 完成维修
      case 10:
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
      // 结束自留占用
      case 11:
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
      default:
        break;
    }
  }

  renderSortHeader() {
    const { startTime, buildId, roomTypeId, buildListOption, roomTypeListOption } = this.state;
    return (
      <div className={styles.searchDom}>
        <div className="fl_r">
          <span>起始时间：</span>
          <DatePicker
            allowClear={false}
            value={moment(startTime)}
            onChange={this.changeTime.bind(this)}
            className={styles.dateSelect}
            format="YYYY-MM-DD"
            placeholder="开始时间"
          />
          <Select
            placeholder="请选择"
            className={styles.buildSelect}
            value={buildId}
            onChange={this.changeBuildType.bind(this)}
          >
            <SelectOption key={0} value={0}>全部楼栋</SelectOption>
            {
              buildListOption.map((item) => {
                return (
                  <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>
                );
              })
            }
          </Select>
          <Select
            placeholder="请选择"
            className={styles.houseSelect}
            value={roomTypeId}
            onChange={this.changeRoomType.bind(this)}
          >
            <SelectOption key={0} value={0}>全部房型</SelectOption>
            {
              roomTypeListOption.map((item) => {
                return (
                  <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>
                );
              })
            }
          </Select>
        </div>
        <ul className={styles.houstTypeList}>
          {
            forwardHouseTypeList.map((v, i) => {
              return (<li className={styles[v.color]} key={i}>{v.label}</li>);
            })
          }
        </ul>
      </div>
    );
  }

  renderRowTitle(list) {
    const arr = [];
    if (list) {
      list.map((v, i) => {
        arr.push(
          <Tooltip title={v.typeName} key={i}>
            <div className="th">
              {v.typeName}
            </div>
          </Tooltip>

        );
        if (v.roomGroupVOList) {
          v.roomGroupVOList.map((rv, ri) => {
            const title = `${rv.buildingName}-${rv.roomNo}`;
            arr.push(
              <Tooltip title={title} key={v.typeName + ri}>
                <div className="td">
                  {title}
                </div>
              </Tooltip>

            );
            return '';
          });
        }
        return this;
      });
    }
    return arr;
  }

  renderToolTipContent(detail) {
    let dom = '';
    const format1 = 'YYYY-MM-DD';
    const format2 = 'YYYY-MM-DD HH:mm:ss';
    switch (parseInt(detail.roomStatusCode, 10)) {
      case 1003:
        dom = (
          <div className="forwardToolTip">
            <p>入住人姓名：{detail.name}</p>
            <p>入住人电话：{detail.phone}</p>
            <p>入住日期：{moment(detail.startTime).format(format1)}</p>
            <p>离店日期：{moment(detail.endTime).format(format1)}</p>
          </div>
        );
        break;
      case 1005:
        dom = (
          <div className="forwardToolTip">
            <p>维修类型：{detail.type}</p>
            <p><i>维修内容：</i><span>{detail.content}</span></p>
            <p>开始时间：{moment(detail.startTime).format(format2)}</p>
            <p>结束时间：{moment(detail.endTime).format(format2)}</p>
          </div>
        );
        break;
      case 1006:
        dom = (
          <div className="forwardToolTip">
            <p><i>自留用途：</i><span>{detail.content}</span></p>
            <p>开始时间：{moment(detail.startTime).format(format2)}</p>
            <p>结束时间：{moment(detail.endTime).format(format2)}</p>
          </div>
        );
        break;
      case 10021:
        dom = (
          <div className="forwardToolTip">
            <p>团队名称：{detail.name}</p>
            <p>预订人电话：{detail.phone}</p>
            <p>预抵日期：{moment(detail.startTime).format(format1)}</p>
            <p>预离日期：{moment(detail.endTime).format(format1)}</p>
          </div>
        );
        break;
      case 10022:
        dom = (
          <div className="forwardToolTip">
            <p>预定人姓名：{detail.name}</p>
            <p>联系电话：{detail.phone}</p>
            <p>预抵日期：{moment(detail.startTime).format(format1)}</p>
            <p>预离日期：{moment(detail.endTime).format(format1)}</p>
          </div>
        );
        break;
      default:
        break;
    }
    return dom;
  }


  /* 弹出框 */
  renderModal() {
    const { repairVisible, retentionVisible, repairType, retentionType, room } = this.state;
    return (
      <div>
        <RepairModal
          ref={(inst) => { this.repairModal = inst; }}
          room={room}
          repairType={repairType}
          visible={repairVisible}
          onCancel={this.onRepairCancel.bind(this)}
          onOk={this.onRepairOk.bind(this)}
        />
        <RetentionModal
          ref={(inst) => { this.retentionModal = inst; }}
          room={room}
          retentionType={retentionType}
          visible={retentionVisible}
          onCancel={this.onRetentionCancel.bind(this)}
          onOk={this.onRetentionOk.bind(this)}
        />

      </div>
    );
  }

  /* 返回菜单 */
  renderMenuList(code, room, dateTime) {
    const btnList = getForwardMenuList(code, room);
    return (
      <ul className={styles.menuList}>
        {
          btnList.map((v, i) => {
            return (
              <Authorized authority={v.permiss || null} key={i}>
                <li
                  onClick={() => {
                    this.toOperate(v, room, dateTime);
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

  renderRowContent(list) {
    const { startTime } = this.state;

    const arr = [];
    if (list) {
      list.map((v, i) => {
        arr.push(
          <div className="thRow" key={i}>
            {v.availableSaleCountList.map((av, ai) => {
              return (
                <div className="th" key={ai}>
                  {av}
                </div>
              );
            })}
          </div>
        );
        if (v.roomGroupVOList) {
          v.roomGroupVOList.map((rv, ri) => {
            const td = (
              <div className="tdRow" key={v.typeName + ri}>
                {v.availableSaleCountList.map((av, ai) => {
                  const dateTime = startTime + ai * 24 * 60 * 60 * 1000;
                  return (
                    <Popover
                      title={`${rv.buildingName}-${rv.roomNo}（${moment(dateTime).format('MM-DD')}）`}
                      content={this.renderMenuList('', rv, dateTime)}
                      placement="right"
                      trigger="click"
                      key={`td${ai}`}
                    >
                      <div className={ai === 29 ? 'tdNoBorder' : 'td'}>&nbsp;</div>
                    </Popover>
                  );
                })}
                {
                  rv.roomDetailsVOList.map((subRow, subIndex) => {
                    return (
                      <Popover content={this.renderToolTipContent(subRow)} key={subIndex}>
                        <Popover
                          title={`${rv.buildingName}-${rv.roomNo}（${moment(subRow.startTime).format('MM月DD日')}）`}
                          content={this.renderMenuList(subRow.roomStatusCode, subRow)}
                          placement="right"
                          trigger="click"
                        >
                          <div className={`diyTd ${getColor(subRow.roomStatusCode)}`} style={getForwardStyle(startTime, subRow.startTime, subRow.endTime, subRow.roomStatusCode)} />
                        </Popover>
                      </Popover>
                    );
                  })
                }

              </div>
            );
            arr.push(td);
            return '';
          });
        }
        return '';
      });
    }
    return arr;
  }

  getDateTDList() {
    const { startTime } = this.state;
    let time = startTime;
    const arr = [];
    for (let i = 0; i < 30; i += 1) {
      arr.push(
        <div className="th" key={i}>
          {moment(time).format('MM-DD')}<br />{getWeekStr(time)}
        </div>
      );
      time += 24 * 60 * 60 * 1000;
    }
    return arr;
  }

  getSaleList(list) {
    if (list) {
      return list.map((v, i) => {
        return (
          <div className="th" key={i}>
            {v}
          </div>
        );
      });
    }
  }


  render() {
    const { houseStatus } = this.props;
    const { queryForward } = houseStatus || {};
    // const usance = {
    //   availableSaleSumList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //   roomTypeGroupVOList: [
    //     {
    //       typeName: '别墅套间',
    //       availableSaleCountList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //       roomGroupVOList: [
    //         {
    //           buildingName: 1,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //             {
    //               roomId: 1,
    //               startTime: new Date().getTime(),
    //               endTime: new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
    //               roomStatusCode: 1003,
    //               name: '张三',
    //               phone: '13566666666',
    //             },
    //             {
    //               roomId: 1,
    //               startTime: new Date().getTime() + 6 * 24 * 60 * 60 * 1000,
    //               endTime: new Date().getTime() + 10 * 24 * 60 * 60 * 1000,
    //               roomStatusCode: 1005,
    //               content: '修复漏水',
    //               type: '漏水',
    //             },
    //           ],
    //         },
    //         {
    //           buildingName: 2,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //             {
    //               roomId: 1,
    //               startTime: new Date().getTime(),
    //               endTime: new Date().getTime() + 24 * 60 * 60 * 1000,
    //               roomStatusCode: 1006,
    //               content: 'VIP客户预留',
    //             },
    //             {
    //               roomId: 1,
    //               startTime: new Date().getTime() + 3 * 24 * 60 * 60 * 1000,
    //               endTime: new Date().getTime() + 6 * 24 * 60 * 60 * 1000,
    //               roomStatusCode: 1006,
    //               content: 'VIP客户预留',
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       typeName: '豪华单人房',
    //       availableSaleCountList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //       roomGroupVOList: [
    //         {
    //           buildingName: 1,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //             {
    //               roomId: 1,
    //               startTime: new Date().getTime() + 24 * 60 * 60 * 1000,
    //               endTime: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
    //               roomStatusCode: 10021,
    //               name: '关羽',
    //               phone: '13588888888',
    //             },
    //             {
    //               roomId: 1,
    //               startTime: new Date().getTime() + 8 * 24 * 60 * 60 * 1000,
    //               endTime: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
    //               roomStatusCode: 10022,
    //               name: '曹操',
    //               phone: '13288888877',
    //             },
    //           ],
    //         },
    //         {
    //           buildingName: 2,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       typeName: '标准商务房',
    //       availableSaleCountList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //       roomGroupVOList: [
    //         {
    //           buildingName: 1,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //           ],
    //         },
    //         {
    //           buildingName: 2,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       typeName: '标准双人房',
    //       availableSaleCountList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //       roomGroupVOList: [
    //         {
    //           buildingName: 1,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //           ],
    //         },
    //         {
    //           buildingName: 2,
    //           roomNo: '201',
    //           roomId: 1,
    //           roomDetailsVOList: [
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // };

    return (
      <Card title={this.renderSortHeader()}>
        {
          this.renderModal()
        }
        {
          queryForward ? (
            <div className={styles.forwardTable}>
              <div className="rowTitle">
                <div className="headerTh">
                  <div className="diyTh">
                    <span className="left">房间</span>
                    <span className="right">日期</span>
                  </div>
                </div>
                <div className="th">
                  可售总数
                </div>
                {
                  this.renderRowTitle(queryForward?.roomTypeGroupVOList)
                }
              </div>
              <div className="rowContent">
                <div className="content">
                  <div className="dateRow">
                    {this.getDateTDList()}
                  </div>
                  <div className="thRow">
                    {this.getSaleList(queryForward?.availableSaleSumList)}
                  </div>
                  {
                    this.renderRowContent(queryForward?.roomTypeGroupVOList)
                  }
                </div>
              </div>

            </div>
          ) : ''
        }
      </Card>
    );
  }
}

export default View;
