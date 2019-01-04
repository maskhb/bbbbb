import { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import runNext from 'utils/runNext';
import { goTo } from 'utils/utils'; 

export default class view extends PureComponent { 

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => { 
      // 对参数进行处理
      if (!error) {
        const gen = this.doSubmitOperate(values);

        runNext(gen, message.error);
      }
    });
  }

  * doSubmitOperate(values) {
    const { proprietor: { gresDetails } } = this.props;

    let p = { ...gresDetails, ...values }; 

    p = yield this.mergeBasicInfo(p);
    p = yield this.mergeLinkRooms(p);
    yield this.save(p)
  }

  mergeBasicInfo = values => {
    if(values.birthday){
      values.birthday = values.birthday?.valueOf();
    }    
    return next => next('', {...values})
  }
 
  mergeLinkRooms = (values) => {
    const { proprietor: { roomOwnerDetail:{roomVO} } } = this.props;
    let uniqRoomVo = _.uniqBy(roomVO, 'roomId')
    return next => roomVO[0]?.roomId? next('', { ...values, roomVO:uniqRoomVo }): next('', values);
  }
  
  save = values => {
    const {dispatch, proprietor:{roomOwnerDetail}} = this.props;
    const { pathname } = this.props.location;
    values.roomOwnerId = roomOwnerDetail.roomOwnerId||0;
    dispatch({
      type: "proprietor/roomOwnerSave",
      payload: {
        roomOwnerVO:values
      }
    }).then(res=>{
      if(res){
        const str  = !!values.roomOwnerId? '编辑': '新增';
        message.success(`${str}业主成功`, 1, () => {
          goTo(pathname.split(/\/add|\/edit/)[0]);
        });
      }
    })
    return next => next('', values);
  };
 
  goBackList = () => {
    const { pathname } = this.props.location;
    goTo(pathname.split(/\/add|\/edit/)[0]);
  }
}
