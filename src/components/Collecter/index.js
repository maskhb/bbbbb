/*  树形展示所有省和省下的小区，并勾选  */
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Icon, Popover, Divider, List, Button } from "antd";
import styles from "./index.less";
// import Authorized from "utils/Authorized";

import { getAuthority } from "utils/authority";

// 收集器
export default class Collecter extends Component {
  static propTypes = {
    list: PropTypes.array,
    rest: PropTypes.number
  };

  static defaultProps = {
    list: [],
    rest: 3
  };

  state = {
    visible: false
  };

  eventListener = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.eventListener = this.setVisible.bind(this, false);
    document.body.addEventListener("click", this.eventListener, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.eventListener, false);
  }

  setVisible(visible) {
    this.setState({
      visible
    });
  }

  renderPopoverList(items) {
    return (
      <List
        size="small"
        dataSource={items}
        renderItem={item => (
          <List.Item onClick={this.setVisible.bind(this, false)}>
            {item.node}
          </List.Item>
        )}
      />
    );
  }

  renderList = items =>
    items?.map((item, i) => {
      return (
        <span key={i}>
          {i ? <Divider type="vertical" /> : ""}
          {item.node}
        </span>
      );
    });

  render() {
    const { list, rest } = this.props;
    const { visible } = this.state;
    const auths = getAuthority();

    const ll = _.filter(
      list.slice(),
      item => auths.indexOf(item.authority) > -1
    );

    const listShow = ll.slice(0, rest);
    const listRest = ll.slice(rest);

    return (
      <div>
        {this.renderList(listShow)}
        {listRest.length ? <Divider type="vertical" /> : ""}
        {listRest.length > 1 ? (
          <Popover
            placement="bottomRight"
            trigger="click"
            visible={visible}
            content={this.renderPopoverList(listRest)}
            onClick={this.setVisible.bind(this, true)}
            overlayClassName="collecter"
          >
            {visible ? (
              <Button size="small">
                更多
                <Icon type="up" />
              </Button>
            ) : (
              <a href="javascript:;" className={styles.more}>
                <span>更多</span>
                <Icon type="down" />
              </a>
            )}
          </Popover>
        ) : listRest.length ? (
          listRest[0].node
        ) : (
          ""
        )}
      </div>
    );
  }
}
