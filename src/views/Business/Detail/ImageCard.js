import React, { Component } from 'react';
import { Card, Button, Icon, Table, Select, Popover } from 'antd';
import _ from 'lodash';
import emitter from '../../../utils/events';
import ImageUpload from '../../../components/Upload/Image/ImageUpload';
import styles from './Detail.less';

let uuid = 0;
export default class ImageCard extends Component {
  constructor(props) {
    super(props);

    const { value = {} } = this.props;
    this.state = {
      imageGroups: value.imageGroups || [],
      skuImages: value.skuImages || [],
    };
    this.triggerChange();
  }

  componentWillMount() {
    const me = this;

    emitter.addListener('goods.detail.imageCard', (e, params) => {
      const skuImages = [...me.state.skuImages];
      if (params.operate === 'add') {
        skuImages.push({
          key: params.skuId,
          imageGroupId: uuid ? 1 : 0,
          ...params,
        });
      } else if (params.operate === 'remove') {
        _.remove(skuImages, skuImage => skuImage.skuId === params.skuId);
      }
      me.setState({ skuImages });
      me.triggerChange({ skuImages });
    });
  }

  handleAddClick = () => {
    const imageGroups = this.state.imageGroups.concat({
      id: uuid += 1,
      fileList: [],
    });

    if (imageGroups.length === 1) {
      // 先添加sku，再添加图片组，sku没有对应的imageGroupId，造成使用中的图片组可删除

      const skuImages = this.state.skuImages.map((skuImage) => {
        return {
          ...skuImage,
          imageGroupId: uuid,
        };
      });
      this.setState({ imageGroups, skuImages });
      this.triggerChange({ imageGroups, skuImages });
    } else {
      this.setState({ imageGroups });
      this.triggerChange({ imageGroups });
    }
  }

  handleRemoveClick = (group) => {
    const { imageGroups } = this.state;
    _.remove(imageGroups, g => g.id === group.id);
    this.setState(imageGroups);
    this.triggerChange({ imageGroups });
  }

  handleImageGroupsChange = (group, fileList) => {
    const imageGroups = this.state.imageGroups.map((g) => {
      const newGroup = { ...g };
      if (newGroup.id === group.id) {
        newGroup.fileList = fileList;
      }
      return newGroup;
    });
    this.setState({ imageGroups });
    this.triggerChange({ imageGroups });
  }

  handleSkuImagesChange = (record, value) => {
    const skuImages = this.state.skuImages.map((skuImg) => {
      const newSkuImg = { ...skuImg };
      if (newSkuImg.skuId === record.skuId) {
        newSkuImg.imageGroupId = value;
      }
      return newSkuImg;
    });

    this.setState({ skuImages });
    this.triggerChange({ skuImages });
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { disabled } = this.props;
    const { skuImages, imageGroups } = this.state;
    const me = this;
    for (const imageGroup of Object.values(imageGroups)) {
      imageGroup.enableDelete = true;

      for (const skuImage of Object.values(skuImages)) {
        if (imageGroup.id === skuImage.imageGroupId) {
          imageGroup.enableDelete = false;
        }
      }
    }

    return (
      <Card title="图片" className={styles.card} bordered={false}>
        {imageGroups.map(group => (
          <Card
            key={group.id}
            title={`图片组${group.id}`}
            style={{ marginBottom: '16px' }}
            extra={group.enableDelete
                ? <a><Icon type="delete" onClick={this.handleRemoveClick.bind(this, group)} /></a>
                : (
                  <Popover placement="right" title="" content="有sku使用" trigger="hover">
                    <Icon type="delete" />
                  </Popover>)}
          >
            <ImageUpload
              exclude={['gif']}
              maxSize={1024}
              maxLength={9}
              action="/api/upload/img"
              listType="picture-card"
              fileList={group.fileList}
              onChange={this.handleImageGroupsChange.bind(this, group)}
            />
          </Card>
        ))}
        <Button disabled={disabled} type="dashed" style={{ marginBottom: '16px' }} onClick={this.handleAddClick}><Icon type="plus" />添加图片组</Button>
        <Table
          columns={[
            {
              title: '规格',
              dataIndex: 'skuText',
            },
            {
              title: '图片组',
              dataIndex: 'imageGroupId',
              render(val, record) {
                return (
                  imageGroups.length > 0
                    ? (
                      <Select
                        defaultValue={val || imageGroups[0].id}
                        onChange={me.handleSkuImagesChange.bind(this, record)}
                      >
                        {imageGroups.map(group => (
                          <Select.Option key={group.id} value={group.id}>{`图片组${group.id}`}</Select.Option>
                        ))}
                      </Select>)
                    : <span>请添加图片组</span>
                );
              },
              width: 240,
            },
          ]}
          dataSource={skuImages}
          pagination={false}
          bordered
        />
      </Card>
    );
  }
}
