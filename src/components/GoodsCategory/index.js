import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import goodsCategory from '../../services/goodsCategory';

class GoodsCategory extends Component {
  // eslint-disable-next-line
  static getCategoryList(categoryId, cb) {
    goodsCategory.list({
      parentId: categoryId,
    }).then((res) => {
      // console.log(res);
      const options = [];
      if (res && res.length > 0) {
        res.forEach((v) => {
          options.push({
            value: v.categoryId, label: v.categoryName, isLeaf: Boolean(!v.isHasChild),
          });
        });
      }
      if (cb && typeof cb === 'function') {
        cb(options);
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }
  componentWillMount() {
    const that = this;
    goodsCategory.list({
      parentId: 0,
    }).then((res) => {
      // console.log(res);
      if (res && res.length > 0) {
        const options = [];
        res.forEach((v) => {
          options.push({
            value: v.categoryId, label: v.categoryName, isLeaf: Boolean(!v.isHasChild),
          });
        });
        that.setState({ options });
      }
    });
  }
  onChange(value, selectedOptions) {
    const that = this;
    that.props.onChange({
      value, selectedOptions,
    });
  }

  loadData(selectedOptions) {
    const that = this;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    GoodsCategory.getCategoryList(targetOption.value, (res) => {
      targetOption.loading = false;
      targetOption.children = res;
      that.setState({
        options: [...that.state.options],
      });
    });
  }
  render() {
    // const {  } = this.props;
    const { options } = this.state;
    // console.log('state',this.state);
    return (
      <Cascader
        options={options}
        placeholder="请选择"
        loadData={this.loadData.bind(this)}
        onChange={this.onChange.bind(this)}
        changeOnSelect
      />
    );
  }
}
// GoodsCategory.propTypes = Object.assign({}, GoodsCategory.propTypes, {
//   initCategoryId: PropTypes.number,
// });
export default GoodsCategory;
