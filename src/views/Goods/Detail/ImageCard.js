import React, { Component } from 'react';
import { Card, Button, Icon, Popover, Input } from 'antd';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import ISSTATUS from 'components/IsStatus';
import './ImageCard.less';

export default class ImageCard extends Component {
  constructor(props) {
    super(props);

    const { value = {} } = this.props;
    this.state = {
      imageGroups: value.imageGroups || [],
    };
  }

  componentDidMount() {
    const { pattern } = this.props;

    if (pattern === 'add') {
      this.handleAddClick();
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({
        imageGroups: value.imageGroups || [],
      });
    }
  }

  // 添加图片组
  handleAddClick = () => {
    const uuid = uuidv4();
    const oldImageGroups = this.state.imageGroups;
    const imageGroups = oldImageGroups.concat({
      // 图片组 - ID
      imgGroupId: uuid,
      // 图片组 - 名称
      imgGroupName: oldImageGroups?.length ? `图片组${uuid.split('-')[0].slice(0, 3)}` : '默认图片组',
      // 是否默认(1:否,2:是)
      isDefault: oldImageGroups?.length ? ISSTATUS.NO.value : ISSTATUS.YES.value,
      // 图片list
      goodsImgVoList: [],
    });

    this.setState({ imageGroups });
    this.triggerChange({ imageGroups });
    console.log(this.props.disabled,imageGroups) //eslint-disable-line
  }

  // 删除图片组
  handleRemoveClick = (group) => {
    const { imageGroups } = this.state;
    _.remove(imageGroups, g => g.imgGroupId === group.imgGroupId);
    this.setState(imageGroups);
    this.triggerChange({ imageGroups });
  }

  // 图片组变更
  handleImageGroupsChange = (group, goodsImgVoList) => {
    const imageGroups = this.state.imageGroups.map((g) => {
      const newGroup = { ...g };
      if (newGroup.imgGroupId === group.imgGroupId) {
        newGroup.goodsImgVoList = goodsImgVoList;
      }
      return newGroup;
    });
    this.setState({ imageGroups });
    this.triggerChange({ imageGroups });
  }

  // 改变图片组名称
  handleImgGroupNameChange = (group, e) => {
    const imageGroups = this.state.imageGroups.map((g) => {
      const newGroup = { ...g };
      if (newGroup.imgGroupId === group.imgGroupId) {
        newGroup.imgGroupName = e.target.value;
      }
      return newGroup;
    });

    this.setState({ imageGroups });
    this.triggerChange({ imageGroups });
  }

  // 改变form的值
  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { disabled, form } = this.props;
    const { imageGroups } = this.state;

    for (const group of Object.values(imageGroups)) {
      group.enableDelete = true;
      if (!group.isDefault) {
        group.isDefault = ISSTATUS.NO.value;
      } else if (group.isDefault === ISSTATUS.YES.value) {
        group.enableDelete = false;
      }

      // 判断图片组是否可以删除
      const { goodsSkuVoList } = form.getFieldsValue();
      for (const sku of Object.values(goodsSkuVoList?.goodsSkuVoList || [])) {
        if (sku.imgGroupId === group.imgGroupId) {
          group.enableDelete = false;
        }
      }

      // 转换数据后，传入组件，会重新触发渲染
      group.goodsImgVoList = group.goodsImgVoList.map(img => img?.imgUrl || img);
    }

    return (
      <div>
        {imageGroups.map(group => (
          <Card
            styleName="card"
            key={group.imgGroupId}
            title={(
              disabled
                ? group.imgGroupName
                : (
                  <Input
                    defaultValue={group.imgGroupName}
                    style={{ width: 360 }}
                    onChange={this.handleImgGroupNameChange.bind(this, group)}
                    maxLength="6"
                  />
                )
            )}
            extra={
              !disabled
                ? group.enableDelete
                  ? <a><Icon type="delete" onClick={this.handleRemoveClick.bind(this, group)} /></a>
                  : (
                    <Popover placement="right" title="" content={group.isDefault === ISSTATUS.YES.value ? '无法删除默认图片组' : '有sku正在使用'} trigger="hover">
                      <Icon type="delete" />
                    </Popover>
                    )
                : ''
            }
          >
            {
              form.getFieldDecorator(`fileList_${group.imgGroupId}`, {
                initialValue: group.goodsImgVoList,
              })(
                <ImageUpload
                  multiple
                  exclude={['gif']}
                  maxSize={2048}
                  maxLength={5}
                  action="/api/upload/img"
                  customSort
                  listType="picture-card"
                  fileList={group.goodsImgVoList}
                  onChange={this.handleImageGroupsChange.bind(this, group)}
                  disabled={disabled}
                />
              )
            }
          </Card>
        ))}
        {
          this.state.imageGroups.length < 10
            ? (
              <Button
                type="dashed"
                disabled={disabled}
                onClick={this.handleAddClick}
              >
                <Icon type="plus" />添加图片组
              </Button>
            )
            : ''
        }
      </div>
    );
  }
}
