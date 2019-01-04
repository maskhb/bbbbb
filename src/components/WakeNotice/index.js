import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Message } from 'antd';
import cookie from 'utils/cookie';

import moment from 'moment';
import iconUrl from 'assets/fc.png';

@connect(({ common }) => ({
  common,
}))

class WakeNotice extends PureComponent {
  state = {
  };
  componentDidMount() {
    let userObj = localStorage.user ? localStorage.user : '';
    if (userObj) {
      userObj = JSON.parse(userObj);
      if (userObj?.orgType === 1 || userObj?.orgVOSelected?.orgType === 1) {
        this.query();
        window.clearInterval(window.getNoticeInterval);
        window.getNoticeInterval = setInterval(() => {
          if (!cookie.get('x-manager-token') && window.getNoticeInterval) {
            return window.clearInterval(window.getNoticeInterval);
          }
          this.query();
        }, 60 * 1000);
      }
    }
  }
  query() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/canWake',
      payload: {},
    }).then((suc) => {
      if (suc && suc.length > 0) {
        suc.map((v, i) => {
          if (v.roomNo && v.wakeTime) {
            this.notify(v);
          }
          return i;
        });
      }
    });
  }

  notify(room) {
    const { dispatch } = this.props;
    const title = '叫醒提示';
    const content = `房间${room.roomNo}定于${moment(room.wakeTime).format('YYYY-MM-DD HH:mm:ss')}的叫醒时间已经到了`;
    const timeToClose = 15 * 1000; // 30s后关闭notification

    const clickMessage = (obj) => {
      const { roomId } = obj;
      const alertTitle = '叫醒提示';
      const alertContent = `房间${obj.roomNo}定于${moment(obj.wakeTime).format('YYYY-MM-DD HH:mm:ss')}的叫醒时间已经到了`;
      Modal.confirm({
        title: alertTitle,
        content: alertContent,
        okText: '完成叫醒',
        cancelText: '1分钟后提醒',
        onOk() {
          dispatch({
            type: 'common/wakeFinish',
            payload: {
              roomId,
            },
          }).then((suc) => {
            if (suc) {
              Message.success('操作成功!');
            } else {
              Message.success('操作失败!');
            }
          });
        },
      });
    };

    if (window.webkitNotifications) {
      // chrome老版本
      if (window.webkitNotifications.checkPermission() === 0) {
        const notification = window.webkitNotifications.createNotification(iconUrl, title, content);
        notification.display = () => {};
        notification.onerror = () => {};
        notification.onclose = () => {};
        notification.onclick = () => {
          this.cancel();
          clickMessage(room);
          notification.close();
        };
        notification.onshow = () => {
          setTimeout(() => {
            notification.close();
          }, timeToClose);
        };
        // notif.replaceId = 'Meteoric';
        // notif.show();
      } else {
        window.webkitNotifications.requestPermission($jy.notify);
      }
    } else if ('Notification' in window) {
      // 判断是否有权限
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          icon: iconUrl,
          body: content,
        });
        notification.onclick = () => {
          clickMessage(room);
          notification.close();
        };
        notification.onshow = () => {
          setTimeout(() => {
            notification.close();
          }, timeToClose);
        };
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission((permission) => {
          // Whatever the user answers, we make sure we store the
          // information
          if (!('permission' in Notification)) {
            Notification.permission = permission;
          }
          // 如果接受请求
          if (permission === 'granted') {
            const notification = new Notification(title, {
              icon: iconUrl,
              body: content,
            });
            notification.onclick = () => {
              clickMessage(room);
              notification.close();
            };
            notification.onshow = () => {
              setTimeout(() => {
                notification.close();
              }, timeToClose);
            };
          }
        });
      }
    }
  }

  render() {
    return '';
  }
}
export default WakeNotice;
