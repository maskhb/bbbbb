import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Form, Button, Icon, Popconfirm, message } from 'antd';
import ModalCover from './ModalCover';
import _ from 'lodash';

@Form.create()
export default class LinkModal extends React.Component {
  static propTypes = {
    record: PropTypes.shape({
      gresId: PropTypes.number.isRequired,
    }).isRequired,
    // checkIn: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    data: [],
    gresGetLinkRooms: [],
    value: undefined,
  };

  // 取消联房
  cancelLinkRoom(item) {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'checkIn/gresCancelLinkRoom',
      payload: {
        gresId: record.gresId,
        roomId: +item.roomId,
      },
    }).then((res) => {
      if (res) {
        this.fetchLinkRooms();
        message.success(`成功取消关联${item.buildingRoomNo}房间`);
      }
    });
  }

  // 新增联房
  linkRoom() {
    this.validForm()
      .then((roomId) => {
        const { dispatch, record, form } = this.props;
        dispatch({
          type: 'checkIn/gresDirectLinkRoom',
          payload: {
            gresId: record.gresId,
            roomId: +roomId,
          },
        }).then((res) => {
          if (res) {
            this.fetchLinkRooms();
            message.success('成功关联房间');
            form.resetFields();
          }
        });
      });
  }

  validForm() {
    const { form, checkIn } = this.props;
    const val = form.getFieldValue('roomId');

    return new Promise((resolve) => {
      form?.validateFields((err, values) => {
        if (err) {
          console.log(err);
        } else if (~(this.state.gresGetLinkRooms.indexOf(val))) {
          // 已存在
          console.log(`${val}已经关联房间`);
        } else {
          resolve(+values.roomId);
        }
      });
    });
  }

  fetchLinkRooms= () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'checkIn/gresGetLinkRooms',
      payload: {
        gresId: record.gresId,
      },
    }).then((res) => {
      this.setState({
        gresGetLinkRooms: res,
      });
    });
  }

  handleSearch = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/gresSearchRoom',
      payload: {
        roomNo: +value,
      },
    }).then((data) => {
      if (data && !data.length) {
        message.error(`房号${value}不存在`);
      }
      this.setState({ data });
    });
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  renderForm() {
    const { form, checkIn } = this.props;
    const options = this.state.data.map(d => <Select.Option value={d.roomId} key={d.roomId}>{d.buildingRoomNo}</Select.Option>);
    return (
      <div>
        <Form layout="inline">
          <Form.Item label="房号">
            {form.getFieldDecorator('roomId', {
              rules: [{
                required: true,
                message: '请输入房号',
              }],
            })(
              <Select
                style={{ minWidth: '200px' }}
                showSearch
                placeholder="请输入房号"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={_.debounce(this.handleSearch.bind(this), 1000)}
                onChange={this.handleChange.bind(this)}
                notFoundContent={null}
              >
                {options}
              </Select>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={this.linkRoom.bind(this)}>添加</Button>
          </Form.Item>
        </Form>

        <div>
          <span>当前次房：</span>
          {
            this.state.gresGetLinkRooms?.map((item, i) => (
              <a style={{ marginRight: '10px' }} key={`linkRoomArray${i}`}>
                {item.buildingRoomNo}
                <Popconfirm title={`房间${item.buildingRoomNo}确定取消联房？`} onConfirm={this.cancelLinkRoom.bind(this, item)} okText="确定" cancelText="取消">
                  <Icon type="close" />
                </Popconfirm>
              </a>
              ))
          }
        </div>
      </div>
    );
  }

  render(content) {
    return (
      <ModalCover
        footer={null}
        title="联房"
        content={this.renderForm()}
      >
        {modalShow => (
          <a
            href="#"
            onClick={(e) => {
          e.preventDefault(); modalShow();
          this.fetchLinkRooms();
        }}
          > 联房
          </a>
)}
      </ModalCover>
    );
  }
}
