import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Button, message, Select } from 'antd';
import getColumns from './columns';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';


const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

const EditableCellSelect = ({ editable, value, onChange }) => {
  const status = ['启用', '禁用'];

  return (
    <div>
      {editable
        ? (
          <Select defaultValue={value} onChange={onChange}>
            <Select.Option key="0" value={0}>{status[0]}</Select.Option>
            <Select.Option key="1" value={1}>{status[1]}</Select.Option>
          </Select>
        )
        : status[value]
      }
    </div>
  );
};

@connect(({ pagetable, loading }) => ({
  pagetable,
  loading: loading.models.pagetable,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    list: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pagetable/tablist',
      payload: {},
    }).then(() => {
      const { pagetable } = this.props;
      this.setState({
        list: pagetable?.list?.list,
      });
    });
  }

  edit(key) {
    const newList = [...this.state.list];
    const target = newList.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ list: newList });
    }
  }

  cancel(key) {
    const newList = [...this.state.list];
    const target = newList.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData?.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ list: newList });
    }
  }

  save(key) {
    const { dispatch } = this.props;
    const target = this.state.list.filter(item => key === item.key)[0];
    dispatch({
      type: 'business/edit',
      payload: {
        target,
      },
    }).then(() => {
      const { business: { edit } } = this.props;
      if (edit.result === 0) {
        message.success('保存成功');
        this.cancel(key);
        dispatch({
          type: 'business/list',
          payload: {},
        }).then(() => {
          const { business } = this.props;
          this.setState({
            list: business?.list?.list,
          });
        });
      } else if (edit.result === 1) {
        message.error(`保存失败, ${edit.msg || '请稍后再试。'}`);
      }
    });
  }

  handleChange(value, key, column) {
    const newData = [...this.state.list];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ list: newData });
    }
  }

  add() {
    const newList = [...this.state.list];
    newList.unshift({
      id: '--',
      key: '--',
      parentId: 0,
      name: '',
      description: '',
      time: '--',
      status: 1,
      editable: true,
    });
    this.setState({
      list: newList,
    });
  }

  renderColumns(text, record, column) {
    const { editable } = record;

    return (
      <EditableCell
        editable={editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  renderColumnsSelect(text, record, column) {
    const { editable } = record;

    return (
      <EditableCellSelect
        editable={editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  render() {
    const { loading } = this.props;
    const { list } = this.state;

    return (
      <PageHeaderLayout>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Button type="primary" onClick={this.add.bind(this)}>添加栏目</Button>
          </div>
          <Table
            loading={loading}
            columns={getColumns(this)}
            dataSource={list}
            pagination={false}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
