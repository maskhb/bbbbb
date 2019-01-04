import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, InputNumber } from 'antd';
import moment from 'moment/moment';
import CalendarModal from 'components/ModalCalendar';
import { fenToYuan } from 'utils/money/index';
import { checkArr, handleTime, formatFloat } from 'utils/utils';
import MoneyInput from './MoneyInput';
import styles from './index.less';

@connect(({ housing, loading }) => ({
  housing,
  loading: loading.models.housing,
}))
class PriceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rateCodeId: props?.rateCodeId || null,
      roomTypeId: props?.roomTypeId || null,
      viewType: props?.viewType || null,
      roomTypeAndPriceList: [],
      rateCodeAndPriceList: [],
      calendarVisible: false,
      calendarTitle: '',
      startTime: null,
    };
  }
  componentDidMount() {
    const that = this;
    const { viewType } = this.state;
    if (Number(viewType) === 2) {
      that.setState({
        rateCodeList: JSON.parse(localStorage.rateCodeList).map((v) => {
          return {
            oldPrice: 0, rateCodeId: v.rateCodeId, price: 0, rateCodeName: v.rateCodeName,
          };
        }) || [],
      });
    } else {
      that.setState({
        roomTypeList: JSON.parse(localStorage.roomTypeList).map((v) => {
          return {
            oldPrice: 0, roomTypeId: v.roomTypeId, price: 0, roomTypeName: v.roomTypeName,
          };
        }) || [],
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const that = this;
    const { dispatch } = this.props;
    const { viewType, rateCodeId, roomTypeId } = this.state;
    if ((viewType === 1 && nextProps.rateCodeId !== rateCodeId && nextProps.rateCodeId)
      || (viewType === 2 && nextProps.roomTypeId !== roomTypeId && nextProps.roomTypeId)) {
      dispatch({
        type: 'housing/list',
        payload: {
          roomRateQueryVO: {
            rateCodeId: viewType === 1 ? nextProps.rateCodeId : null,
            roomTypeId: viewType === 2 ? nextProps.roomTypeId : null,
            beginDate: handleTime(1, new Date()),
            endDate: handleTime(2, new Date()),
            viewType,
          },
        },
      }).then(() => {
        const result = that.props.housing.list;
        if (!result?.list) {
          return false;
        }
        let roomTypeAndPriceList = [];
        let rateCodeAndPriceList = [];
        const { rateCodeAndDateList, roomTypeAndDateList } = result?.list?.[0];
        const { roomTypeList, rateCodeList } = that.state;
        if (viewType === 1) {
          roomTypeAndPriceList = roomTypeList.map((v) => {
            let res;
            const checkResult = checkArr(roomTypeAndDateList, 'roomTypeId', v.roomTypeId);
            if (checkResult.hasElement) {
              res = {
                oldPrice: roomTypeAndDateList[checkResult.index].priceArr[0],
                price: roomTypeAndDateList[checkResult.index].priceArr[0],
                roomTypeId: v.roomTypeId,
                roomTypeName: v.roomTypeName,
                submitPrice: -1,
              };
            } else {
              res = {
                oldPrice: 0,
                price: 0,
                roomTypeId: v.roomTypeId,
                roomTypeName: v.roomTypeName,
                submitPrice: -1,
              };
            }
            return res;
          });
        }
        if (viewType === 2) {
          rateCodeAndPriceList = rateCodeList.map((v) => {
            let res;
            const checkResult = checkArr(rateCodeAndDateList, 'rateCodeId', v.rateCodeId);
            if (checkResult.hasElement) {
              res = {
                oldPrice: rateCodeAndDateList[checkResult.index].priceArr[0],
                price: rateCodeAndDateList[checkResult.index].priceArr[0],
                rateCodeId: v.rateCodeId,
                rateCodeName: v.rateCodeName,
                submitPrice: -1,
              };
            } else {
              res = {
                oldPrice: 0,
                price: 0,
                rateCodeId: v.rateCodeId,
                rateCodeName: v.rateCodeName,
                submitPrice: -1,
              };
            }
            return res;
          });
        }
        that.setState({
          priceList: result?.list?.[0],
          roomTypeAndPriceList,
          rateCodeAndPriceList,
        });
      });
    }
    this.setState({
      rateCodeId: nextProps.rateCodeId,
      roomTypeId: nextProps.roomTypeId,
      viewType: nextProps.viewType,
      startTime: nextProps.startTime,
    });
  }
  onCalendarCancel() {
    this.setState({
      calendarVisible: false,
    });
  }

  onCalendarOk() {
    this.setState({
      calendarVisible: false,
    });
  }
  handleChange(id, value) {
    const { viewType, roomTypeAndPriceList, rateCodeAndPriceList } = this.state;
    if (viewType === 1) {
      const newRoomTypeAndPriceList = Object.assign([], roomTypeAndPriceList);
      const checkResult = checkArr(newRoomTypeAndPriceList, 'roomTypeId', id);
      if (checkResult.hasElement) {
        newRoomTypeAndPriceList[checkResult.index].price =
          (value || value === 0) ? formatFloat(value * 100, 2) : newRoomTypeAndPriceList[checkResult.index].oldPrice;
        newRoomTypeAndPriceList[checkResult.index].submitPrice =
          (value || value === 0) ? formatFloat(value * 100, 2) : -1;
      } else {
        newRoomTypeAndPriceList.push({
          roomTypeId: id,
          price: formatFloat(value * 100, 2) || 0,
          oldPrice: 0,
          submitPrice: formatFloat(value * 100, 2) || -1,
        });
      }
      this.setState({
        roomTypeAndPriceList: newRoomTypeAndPriceList,
      });
      this.props.onChange({
        roomTypeAndPriceList: newRoomTypeAndPriceList,
      });
    } else if (viewType === 2) {
      const newRateCodeAndPriceList = Object.assign([], rateCodeAndPriceList);
      const checkResult = checkArr(newRateCodeAndPriceList, 'rateCodeId', id);
      if (checkResult.hasElement) {
        newRateCodeAndPriceList[checkResult.index].price =
          (value || value === 0) ? formatFloat(value * 100, 2) : newRateCodeAndPriceList[checkResult.index].oldPrice;
        newRateCodeAndPriceList[checkResult.index].submitPrice =
          (value || value === 0) ? formatFloat(value * 100, 2) : -1;
      } else {
        newRateCodeAndPriceList.push({
          rateCodeId: id,
          price: formatFloat(value * 100, 2),
          oldPrice: 0,
          submitPrice: formatFloat(value * 100, 2),
        });
      }
      this.setState({
        rateCodeAndPriceList: newRateCodeAndPriceList,
      });
      this.props.onChange({
        rateCodeAndPriceList: newRateCodeAndPriceList,
      });
    }
  }
  /*  加载房价日历 */
  /* 打开日历 */
  showCalendar(roomTypeId, rateCodeId, roomTypeName, rateCodeName) {
    const { startTime } = this.state;
    const beginDate = moment(startTime).startOf('month').valueOf();
    const endDate = moment(startTime).add(1, 'months').endOf('month').valueOf();
    // endDate = moment(endDate).add(1, 'months').valueOf();

    const { dispatch } = this.props;
    const searchForm = {
      beginDate,
      endDate,
      rateCodeId,
      roomTypeId,
    };
    dispatch({
      type: 'housing/calendarPrice',
      payload: searchForm,
    }).then((suc) => {
      if (suc) {
        this.setState({
          calendarVisible: true,
          calendarTitle: `${roomTypeName}（${rateCodeName}）`,
        });
      }
    });
  }
  /* 日历弹框 */
  renderCalendarModal() {
    const { calendarVisible, calendarTitle } = this.state;
    return (
      <CalendarModal
        ref={(inst) => { this.calendarModal = inst; }}
        title={calendarTitle}
        visible={calendarVisible}
        onCancel={this.onCalendarCancel.bind(this)}
        onOk={this.onCalendarOk.bind(this)}
      />
    );
  }
  render() {
    const { viewType, rateCodeAndPriceList, roomTypeAndPriceList,
      roomTypeId, rateCodeId } = this.state;
    const priceListArr = viewType === 1 ? roomTypeAndPriceList : rateCodeAndPriceList;
    return (
      <div>
        <table border="0" className={styles.priceTable}>
          <thead>
            <tr>
              <th className={styles.width200}>
                { viewType === 1 ? '房型' : '价格代码' }
              </th>
              <th className={styles.width150}>今日价格（元）</th>
              <th className={styles.width250}>设置新价格（元）</th>
              <th className={styles.width150} />
            </tr>
            {
              priceListArr ? (priceListArr.map((v, i) => (
                <tr key={`${i}_tr`}>
                  <td className={styles.width200}>
                    { viewType === 1 ? v.roomTypeName : v.rateCodeName }
                  </td>
                  <td className={styles.width150}>{ fenToYuan(v.oldPrice) }</td>
                  <td className={styles.width250}>
                    <MoneyInput
                      style={{ width: 200 }}
                      min={0}
                      placeholder="请输入价格"
                      inputChange={this.handleChange.bind(this, viewType === 1
                        ? v.roomTypeId : v.rateCodeId)}
                    />
                  </td>
                  <td className={styles.width150}>
                    <Button
                      type="primary"
                      onClick={
                        this.showCalendar.bind(this, viewType === 1 ? v.roomTypeId : roomTypeId,
                          viewType === 1 ? rateCodeId : v.rateCodeId,
                          viewType === 1 ? v.roomTypeName : this.props.roomTypeName,
                          viewType === 1 ? this.props.rateCodeName : v.rateCodeName)
                      }
                    >查看价格日历
                    </Button>
                  </td>
                </tr>
              ))) : (<tr />)
            }
          </thead>
          <tbody>
            <tr />
          </tbody>
        </table>
        {this.renderCalendarModal()}
      </div>
    );
  }
}
// Form.childContextTypes = {
//   form: PropTypes.object, // form
// };

PriceTable.propTypes = Object.assign({}, PriceTable.propTypes, {
  viewType: PropTypes.number.isRequired, // 当前视图
  rateCodeName: PropTypes.string, // 价格代码名称
  roomTypeName: PropTypes.string, // 房型名称
  rateCodeId: PropTypes.number, // 价格代码Id
  roomTypeId: PropTypes.number, // 房型Id
  startTime: PropTypes.number.isRequired, // 开始时间的时间戳，用来查看价格日历
  // modalCancel: PropTypes.func, // 弹窗取消时触发
  // initFormData: PropTypes.object.isRequired, // 初始Form值，若为空传{}
});

export default PriceTable;
