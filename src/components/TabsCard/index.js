/*
 * @Author: wuhao
 * @Date: 2018-06-14 17:45:34
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-20 14:09:51
 *
 * 封装Tabs Card组件
 */

import React, { PureComponent } from 'react';

import { Card, Tabs } from 'antd';

import childrenWithProps from '../../utils/childrenWithProps';

const { TabPane } = Tabs;

class TabsCard extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { className, cardProps = {}, tabsProps = {}, children } = this.props;

    return (
      <Card
        className={`${className || ''}`}
        {
          ...cardProps
        }
      >
        <Tabs
          {
            ...tabsProps
          }
        >
          {
            children && children.filter(l => !!l).sort(
              (a, b) => a.props.order - b.props.order
            ).map((item, index) => {
              const { tab, forceRender = false } = item?.props || {};
              const idx = index;
              return (
                <TabPane tab={tab} key={`${idx}`} forceRender={forceRender}>
                  {childrenWithProps(item, { ...this.props })}
                </TabPane>
              );
            })
          }

        </Tabs>
      </Card>
    );
  }
}

export default TabsCard;
