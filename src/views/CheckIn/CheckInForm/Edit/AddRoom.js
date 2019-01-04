import React from 'react';
import _ from 'lodash';
import { Button, Modal, Row, Col, message, Select, Spin, Tag } from 'antd';

export default class ChooseRoom extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: props.value || [],
      inputValue: '',
      arrLinkRoomIds: [...(props.value || [])],
      inputLabel: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      String(nextProps.value) !== String(this.props.value)
    ) {
      this.setState({
        value: nextProps.value,
        arrLinkRoomIds: [...(nextProps.value || [])],
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'checkIn/save',
      payload: {
        gresSearchRoom: [],
      },
    });
  }

  onChange=(inputValue, option) => {
    this.setState({
      inputValue,
      inputLabel: option.props.children,
    });
  }

  handleModalShow=() => {
    const { value } = this.props;
    this.setState({
      visible: true,
      value,
      arrLinkRoomIds: [...(value || [])],
    });
  }

  handleCancel=() => {
    this.setState({
      visible: false,
    });
  }

  handleAdd= async () => {
    const { dispatch, checkIn: { gresDetails } } = this.props;
    const { inputValue: roomId, arrLinkRoomIds, inputLabel } = this.state;

    if (arrLinkRoomIds.indexOf(roomId) !== -1) {
      return message.warn('已存在该房号');
    }

    const result = await dispatch({
      type: 'checkIn/gresLinkRoom',
      payload: {
        roomId,
      },
    });

    if (result) {
      arrLinkRoomIds.push(roomId);
      const { linkRoomOptions = [] } = gresDetails;
      if (!_.find(linkRoomOptions, item => item.value === roomId)) {
        linkRoomOptions.push({
          value: roomId,
          label: inputLabel,
        });
      }

      gresDetails.setLinkRoomOptions(linkRoomOptions);

      this.setState({ arrLinkRoomIds });
      dispatch({
        type: 'checkIn/save',
        payload: {
          gresDetails,
        },
      });
    }
  }

  handleOk=() => {
    this.props.onChange(this.state.arrLinkRoomIds);
    this.handleCancel();
  }

  handleSearch= async (value) => {
    if (!value) return;
    this.props.dispatch({
      type: 'checkIn/save',
      payload: {
        gresSearchRoom: [],
      },
    });

    this.props.dispatch({
      type: 'checkIn/gresSearchRoom',
      payload: {
        roomNo: value,
      },
    });
  }

  handleCancelRoom= ({ value }) => {
    const { arrLinkRoomIds } = this.state;

    this.setState({
      arrLinkRoomIds: _.filter(arrLinkRoomIds, id => id !== value),
    });
  }

  render() {
    const { form, loading, checkIn: { gresSearchRoom, gresDetails } } = this.props;
    const { value = [], inputValue, arrLinkRoomIds } = this.state;

    const timeArr = form.getFieldValue('arrivalDepartureDate') || [];

    const options = gresSearchRoom?.map(item => (
      <Select.Option key={item.roomId}>
        {item.buildingRoomNo}
      </Select.Option>
    ));

    return (
      <div style={{ minHeight: 32 }}>
        <p className="check-in-para">
          <Button className="link-button" onClick={this.handleModalShow}>选择</Button>
          &nbsp;
          <span >{
            _.map(_.filter(gresDetails?.linkRoomOptions, (item) => {
              return value?.indexOf(item.value) !== -1;
            }), item => item.label)?.join(',')
          }
          </span>
        </p>

        <Modal
          title="添加次房"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>入离店日期：{timeArr[0]?.format('YYYY-MM-DD')} ~ {timeArr[1]?.format('YYYY-MM-DD')}</p>
          <Row gutter={12}>
            <Col span={6}>房号：</Col>
            <Col span={12}>
              <Select
                showSearch
                showArrow={false}
                onSearch={_.debounce(this.handleSearch, 500)}
                onChange={this.onChange}
                style={{ width: 200 }}
                filterOption={false}
                defaultActiveFirstOption={false}
                notFoundContent={loading.effects['checkIn/gresSearchRoom'] ? <Spin size="small" /> : <span>房号不存在</span>}
              >
                {
                  options
                }
              </Select>
            </Col>
            <Col span={6}>
              <Button type="primary" disabled={!inputValue} onClick={this.handleAdd}>添加</Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={6} >当前次房：</Col>
            <Col span={18}>
              {
                _.map(
                  _.filter(gresDetails?.linkRoomOptions, item =>
                    arrLinkRoomIds?.indexOf(item.value) !== -1),
                  item => (
                    <Tag key={item.value} closable onClose={this.handleCancelRoom.bind(this, item)}>
                      {item.label}
                    </Tag>
))
              }
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
