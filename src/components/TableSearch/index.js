import React, { PureComponent } from 'react';
import { Row, Form, Button, Icon, Col } from 'antd';
import emitter from '../../utils/events';
import childrenWithProps from '../../utils/childrenWithProps';
import SearchItem from './Item';
import './index.less';

export default class TableSearch extends PureComponent {
  static Item = SearchItem;

  state = {
    expand: false,
    lastValue: null,
  };

  componentWillMount() {
    const { searchDefault, setStateOfSearch, uuid } = this.props;
    setStateOfSearch(searchDefault);

    emitter.addListener(`panellist.search.${uuid}`, (e, params) => {
      this.handleSearch(e, params);
    });
  }

  componentWillUnmount() {
    const { uuid } = this.props;
    emitter.removeListener(`panellist.search.${uuid}`, () => {});
  }

  toggleOperate = () => {
    this.setState({
      expand: !this.state.expand,
    });
  }

  handleSearch = (e, params = {}) => {
    e?.preventDefault();
    const { form, stateOfSearch, setStateOfSearch,
      searchDefault, onSearch, setSelectedRows } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const pageInfo = {
        pageSize: searchDefault?.pageInfo?.pageSize || 10,
        ...stateOfSearch?.pageInfo,
        ...params.pageInfo,
      };
      const values = {
        ...searchDefault,
        ...stateOfSearch,
        ...fieldsValue,
        ...params,
        pageInfo,
      };

      let diff = false;
      if (this.state.lastValue) {
        for (const [key, value] of Object.entries(values)) {
          if (key !== 'currentPage' && key !== 'pageSize' && key !== 'pageInfo') {
            /* eslint eqeqeq: 0 */
            if (value != this.state.lastValue[key]) {
              diff = true;
            }
          }
        }
      }

      this.setState({
        lastValue: values,
      });

      // 不仅仅是改变了页码和每页数量，要重置页码，重置多选
      if (diff) {
        values.pageInfo.currPage = 1;
        setSelectedRows([]);
      }

      if (!values.pageInfo.currPage) {
        values.pageInfo.currPage = 1;
      }
      // console.log(999, values) //eslint-disable-line
      setStateOfSearch(values);
      onSearch?.(values);
    });
  }

  handleFormReset = (e) => {
    const { form, searchDefault } = this.props;
    form.resetFields();
    this.handleSearch(e, searchDefault);
  }

  render() {
    const { form, children } = this.props;
    const { expand } = this.state;

    // 不显示展开按钮：1、如果搜索控件数量小于等于1；2、如果没有simple配置的控件。
    let showExpand = children?.length > 1;
    if (showExpand) {
      let show = false;
      children.map((c) => {
        if (!c.props.simple) {
          show = true;
        }
        return null;
      });
      showExpand = show;
    }

    const operate = (
      children
        ? (
          <Col md={8} sm={24}>
            <span styleName="operate">
              <Button type="primary" onClick={this.handleSearch} styleName="btnSubmit">查询</Button>
              <Button onClick={this.handleFormReset}>重置</Button>
              {
                showExpand
                  ? (
                    expand
                      ? (
                        <a onClick={this.toggleOperate}>
                          收起 <Icon type="up" />
                        </a>
                      )
                      : (
                        <a onClick={this.toggleOperate}>
                          展开 <Icon type="down" />
                        </a>
                      )
                  )
                  : ''
              }
            </span>
          </Col>
        )
        : ''
    );

    return (
      <div styleName="search">
        <div styleName="form">
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              {childrenWithProps(children, { form, expand })}
              {operate}
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
