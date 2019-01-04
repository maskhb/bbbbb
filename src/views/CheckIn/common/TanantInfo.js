import React from 'react';
import _ from 'lodash';
import { Table, Select, Button, Divider, Input } from 'antd';
import { rules } from 'components/input';
import FormItem from './FormItem';
import '../index.less';

let num = 0;

export default class TanantInfo extends React.Component {
  componentDidMount() {
    const { checkIn: { gresDetails } } = this.props;

    if (!gresDetails?.tanantInfo || gresDetails?.tanantInfo?.length < 1) {
      num = 0;
      this.handleAddItem();
    } else {
      num = gresDetails?.tanantInfo?.length;
    }
  }

  handleAddItem = () => {
    const { checkIn: { gresDetails }, dispatch } = this.props;

    gresDetails.setGresGuestVOs([
      ...(gresDetails?.gresGuestVOs || []),
      { id: num },
    ]);

    num += 1;

    dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
  }

  handleRemove = (removeIndex) => {
    const { checkIn: { gresDetails }, dispatch } = this.props;

    gresDetails.setGresGuestVOs(_.filter(gresDetails?.gresGuestVOs, (item, index) => {
      return index !== removeIndex;
    }));

    dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
  }

  columns = () => {
    const { checkIn: { gresDetails }, form, gresType } = this.props;

    return [{
      title: gresType === 2 ? <span><i style={{ color: 'red' }}>* </i>姓名</span> : '姓名',
      dataIndex: 'id',
      render(val, record) {
        return (
          <FormItem
            form={form}
            detailDefault={gresDetails}
            keyName={`tanantInfo[${record.value.id}].value.guestName`}
            rules={rules([{
              max: 20,
            }].concat(gresType === 2 ? [{
              required: true, message: '请输入姓名',
            }] : []))}
          >
            <Input placeholder="姓名" />
          </FormItem>
        );
      },
    }, {
      title: '证件号码',
      render(val, record) {
        return (
          <FormItem
            form={form}
            detailDefault={gresDetails}
            keyName={`tanantInfo[${record.value.id}].value.docNo`}
            rules={[{
              pattern: /^[0-9A-Za-z]+$/,
              message: '请输入数字或字母',
            }]}
          >
            <Input placeholder="数字或字母" />
          </FormItem>
        );
      },
    }, {
      title: '性别',
      render(val, record) {
        return (
          <FormItem
            form={form}
            detailDefault={gresDetails}
            keyName={`tanantInfo[${record.value.id}].value.gender`}
          >
            <Select style={{ width: 100 }} placeholder="性别">
              <Select.Option value="F">女</Select.Option>
              <Select.Option value="M">男</Select.Option>
            </Select>
          </FormItem>
        );
      },
    }, {
      title: gresType === 2 ? <span><i style={{ color: 'red' }}>* </i>手机号</span> : '手机号',
      render(val, record) {
        return (
          <FormItem
            form={form}
            detailDefault={gresDetails}
            keyName={`tanantInfo[${record.value.id}].value.mobile`}
            rules={[{
              pattern: /^1\d{10}$/,
              message: '请输入11位数字',
            }].concat(gresType === 2 ? [{
              required: true, message: '请输入11位手机号',
            }] : [])}
          >
            <Input placeholder="11位手机号" />
          </FormItem>
        );
      },
    }, {
      title: '操作',
      dataIndex: '',
      render: (val, record, index) => {
        const len = gresDetails?.tanantInfo.length;
        return (
          <div>
            {index === len - 1 ? <Button className="link-button" onClick={this.handleAddItem}>添加</Button> : null}
            {index === len - 1 && len > 1 ? <Divider type="vertical" /> : null}
            {len === 1 || <Button className="link-button" onClick={this.handleRemove.bind(this, index)}>删除</Button>}
          </div>
        );
      },
    }];
  }

  render() {
    const { checkIn: { gresDetails }, style } = this.props;
    return (
      <Table
        className="tanant-info"
        columns={this.columns()}
        dataSource={gresDetails?.tanantInfo}
        rowKey="id"
        pagination={false}
        style={style}
      />
    );
  }
}
