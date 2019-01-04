import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ housing }) => ({
  housing,
}))

class ModalCalendar extends PureComponent {
  state = {
  };

  componentDidMount() {
  }

  renderEmptyDay=(obj) => {
    if (obj && obj.year && obj.month) {
      const date = new Date(obj.year, obj.month - 1, 1);
      let week = date.getDay();
      if (week === 0) {
        week = 7;
      }
      const list = [];
      if (week > 0) {
        for (let i = 0; i < week - 1; i += 1) {
          list.push(i);
        }
      }

      return (
        list.map((v, i) => {
          return <li key={i}>&nbsp;</li>;
        })
      );
    }
  };

  renderDay=(list, day) => {
    if (list) {
      return (
        list.map((v, i) => {
          return <li key={i} className={day && day > i + 1 ? 'disabled' : ''}><span>{i + 1}</span><i>{v > 0 ? v / 100 : ''}</i></li>;
        })
      );
    }
  };

  render() {
    const { visible, title, housing, onCancel, onOk } = this.props;
    const { calendarPrice } = housing || {};
    // const {  } = this.state;
    return (
      <Modal
        visible={visible}
        title={`当前房型：${title}`}
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
        width={800}
      >
        {
          calendarPrice ? (
            <div className={styles.calendarGroup}>
              {
                calendarPrice[0] ? (
                  <div className={styles.left}>
                    <div className={styles.calendarDom}>
                      <h1>{calendarPrice[0]?.year}年{calendarPrice[0]?.month}月</h1>
                      <ul className={styles.calendarTitle}>
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li className="red">六</li>
                        <li className="red">日</li>
                      </ul>
                      <ul className={styles.calendarContent}>
                        { this.renderEmptyDay(calendarPrice[0]) }
                        { this.renderDay(calendarPrice[0]?.priceArr, new Date().getDate()) }
                      </ul>
                    </div>
                  </div>
                ) : ''
              }
              {
                calendarPrice[1] ? (
                  <div className={styles.right}>
                    <div className={styles.calendarDom}>
                      <h1>{calendarPrice[1]?.year}年{calendarPrice[1]?.month}月</h1>
                      <ul className={styles.calendarTitle}>
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li className="red">六</li>
                        <li className="red">日</li>
                      </ul>
                      <ul className={styles.calendarContent}>
                        { this.renderEmptyDay(calendarPrice[1]) }
                        { this.renderDay(calendarPrice[1]?.priceArr) }
                      </ul>
                    </div>
                  </div>
                ) : ''
              }

            </div>
          ) : ''
        }

      </Modal>
    );
  }
}

export default ModalCalendar;
