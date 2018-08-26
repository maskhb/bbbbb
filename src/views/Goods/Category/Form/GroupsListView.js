import React, { PureComponent } from 'react';
import { Input, Popconfirm } from 'antd';
import PanelList, { Search, Table } from 'components/PanelList';

const columns = (self) => {
  return [
    {
      title: '属性组ID',
      dataIndex: 'propertyGroupId',
      width: '30%',
    },
    {
      title: '属性组名称',
      dataIndex: 'propertyGroupName',
      width: '40%',
      render: (val, record) => {
        const { isBind } = record;
        return (
          <span>
            {val}
            {isBind ?
              <span style={{ color: '#ff0000' }}> (已绑定)</span>
              : ''}
          </span>
        );
      },
    },
    {
      title: '操作',
      width: '30%',
      render: (record) => {
        const { type = '', match: { params: { id } } } = self.props;
        const { isBind } = record;
        const confirmTextBindBase = (
          <div style={{ width: '260px' }}>该分类已有关联属性组，是否确认修改？
            <div style={{ color: '#f00' }}>修改完成后，改分类下商品的基本属性将会被初始化为所选属性组的属性！</div>
          </div>
        );
        const confirmTextUnbindBase = (
          <div style={{ width: '260px' }}>
            是否确认取消绑定该属性组？
            <div style={{ color: '#f00' }}>取消以后，如果再重新绑定，原有的基本属性将被清空，并被初始化为新绑定的属性组的属性！</div>
          </div>
        );
        const confirmTextBind = (
          <div style={{ width: '260px' }}>
          该分类已有关联属性组，是否确认修改？
            <div style={{ color: '#f00' }}>修改完成后，该分类下商品原有的SKU不受影响，但新增商品或者SKU时以当前规格属性组为准！</div>
          </div>
        );
        const confirmTextUnbind = (
          <div style={{ width: '260px' }}>
            是否确认取消绑定该属性组？
            <div style={{ color: '#f00' }}>取消以后，如果再重新绑定，该分类下商品原有的SKU将不受影响，但新增商品或者SKU时以新绑定的规格属性组为准！</div>
          </div>
        );
        const confirmText = Number(type) === 1 ?
          (isBind ? confirmTextUnbindBase : confirmTextBindBase)
          : (isBind ? confirmTextUnbind : confirmTextBind);

        const operateFunction = isBind ? self.handleUnbind : self.handleBind;
        return (
          <div>
            {id > 0 ? (
              <Popconfirm
                placement="top"
                title={confirmText}
                onConfirm={() => operateFunction(record)}
                okText="确认"
                cancelText="取消"
              >
                <a onClick="">{!isBind ? '绑定' : '取消绑定'}</a>
              </Popconfirm>
) : <a onClick={() => operateFunction(record)}>{!isBind ? '绑定' : '取消绑定'}</a>
            }

          </div>
        );
      },
    },
  ];
};

export default class View extends PureComponent {
  state = {
    list: [],
    bindItem: null,
  }

  componentWillMount() {
    const { propertyGroup, type } = this.props;
    const data = propertyGroup[`type${type}`];
    const { bindItem } = this.state;
    const list = data?.list || [];
    const newList = [...list];
    if (newList) {
      const target = newList.filter((item) => {
        const newItem = item;
        newItem.isBind = false;
        return bindItem ? bindItem?.propertyGroupId === item.propertyGroupId : false;
      })[0];

      if (target) {
        target.isBind = true;
      }
    }
    this.setState({ list: newList });
  }
  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = ({ pageInfo, ...values }) => {
    const { dispatch, type, propertyGroupId } = this.props;
    return dispatch({
      type: 'propertyGroup/list',
      payload: {
        type,
        status: 1,
        pageInfo: {
          orderType: 'created_time desc',
          ...pageInfo,
        },
        ...values,
      },
    }).then(() => {
      const { propertyGroup } = this.props;
      const data = propertyGroup[`type${type}`];
      // const { bindItem } = this.state;
      const list = data?.list || [];
      const newList = [...list];
      if (newList) {
        const target = newList.filter((item) => {
          const newItem = item;
          newItem.isBind = false;
          // return bindItem ? bindItem?.propertyGroupId === item.propertyGroupId : false;
          return propertyGroupId ? propertyGroupId === item.propertyGroupId : false;
        })[0];

        if (target) {
          target.isBind = true;
        }
      }
      this.setState({ list: newList });
    });
  }

  handleBind = (record) => {
    const { onChange } = this.props;
    const newList = [...this.state.list];
    const target = newList.filter((item) => {
      const newItem = item;
      newItem.isBind = false;
      return record.propertyGroupId === item.propertyGroupId;
    })[0];

    if (target) {
      target.isBind = true;
      this.bindItem = record;
      this.setState({ list: newList, bindItem: target });
      onChange(record);
    }
  }
  handleUnbind = (record) => {
    const { onChange } = this.props;
    const newList = [...this.state.list];
    const target = newList.filter((item) => {
      return record.propertyGroupId === item.propertyGroupId;
    })[0];

    if (target) {
      target.isBind = false;
      this.bindItem = null;
      onChange({});
      this.setState({ list: newList, bindItem: target });
    }
  }
  render() {
    const { loading, propertyGroup, type } = this.props;
    const data = propertyGroup[`type${type}`];

    return (
      <div>
        <PanelList>
          <Search
            ref={(inst) => { this.search = inst; }}
            onSearch={this.handleSearch}
          >
            <Search.Item label="属性组名称" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('propertyGroupName')(
                    <Input />
                  )
                )
              }
            </Search.Item>
          </Search>
          <Table
            loading={loading}
            columns={columns(this)}
            dataSource={this.state.list}
            pagination={data?.pagination}
            disableRowSelection
            rowKey="propertyGroupId"
          />
        </PanelList>

      </div>
    );
  }
}
