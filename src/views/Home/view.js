import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Avatar, List, Badge } from 'antd';
import _ from 'lodash';
import { goTo } from 'utils/utils';
import { OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE, OPERPORT_JIAJU_TOAPPRPACKLIST_APPROVE } from 'config/permission';
import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import AUDITSTATUS from 'components/AuditStatus';
import './view.less';

@connect(({ global, loading, user }) => ({
  global,
  user,
  loading,
}))
export default class Home extends PureComponent {
  handleClick = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${item.modelName}/addLinkAuditStatus`,
      payload: item.linkState,
    });

    goTo(item.href);
  }

  render() {
    const { global, loading, user } = this.props;
    let sayHello = '';
    const currentHours = new Date().getHours();
    if (currentHours >= 6 && currentHours < 12) {
      sayHello = '早上好';
    } else if (currentHours >= 12 && currentHours < 18) {
      sayHello = '下午好';
    } else if (currentHours >= 18 || currentHours < 6) {
      sayHello = '晚上好';
    }

    const pageHeaderContent = (
      <div styleName="pageHeaderContent">
        <div styleName="avatar">
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div styleName="content">
          <div styleName="contentTitle">{`${sayHello}，${(user.current.loginName || '')}，祝你开心每一天`}！</div>
          <div>运营专家 | 恒腾网络－运营部</div>
        </div>
      </div>
    );

    const color = {
      default: '#d9d9d9',
      warn: '#faad14',
    };

    const content = (count, bgColor) => (
      count
        ? (
          <Badge
            count={count}
            showZero
            style={{ backgroundColor: bgColor }}
          />
        )
        : count
    );

    const notice = [{
      id: 1,
      logo: 'a',
      href: '/goods/listwaitaudit',
      linkState: {
        auditStatus: AUDITSTATUS.WAIT.value,
      },
      title: '商品列表 - 待审核',
      content: content(global?.notices?.[0], color.warn),
      description: '还有xxx条数据需要处理',
      memberLink: '',
      member: '',
      updatedAt: '',
      modelName: 'goods',
      authority: [OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE],
    }, {
      id: 2,
      logo: 'a',
      href: '/goods/listfailaudit',
      linkState: {
        auditStatus: AUDITSTATUS.FAIL.value,
      },
      title: '商品列表 - 审核不通过',
      content: content(global?.notices?.[1], color.default),
      description: 'x2',
      memberLink: 'a',
      member: 'a',
      updatedAt: 1526263562560,
      modelName: 'goods',
      authority: [OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE],
    }, {
      id: 3,
      logo: 'a',
      href: '/goods/packagewaitaudit',
      linkState: {
        auditStatus: AUDITSTATUS.WAIT.value - 1,
      },
      title: '套餐列表 - 待审核',
      content: content(global?.notices?.[2], color.warn),
      description: 'x2',
      memberLink: 'a',
      member: 'a',
      updatedAt: 1526263562560,
      modelName: 'goodsPackage',
      authority: [OPERPORT_JIAJU_TOAPPRPACKLIST_APPROVE],
    }, {
      id: 4,
      logo: 'a',
      href: '/goods/packagefailaudit',
      linkState: {
        auditStatus: AUDITSTATUS.FAIL.value - 1,
      },
      title: '套餐列表 - 审核不通过',
      content: content(global?.notices?.[3], color.default),
      description: 'x2',
      memberLink: 'a',
      member: 'a',
      updatedAt: 1526263562560,
      modelName: 'goodsPackage',
      authority: [OPERPORT_JIAJU_TOAPPRPACKLIST_APPROVE],
    }];

    return (
      <PageHeaderLayout content={pageHeaderContent} >
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Authorized authority={_.uniq(_.flatten(notice.map(n => n.authority)))}>
              <Card
                styleName="projectList"
                style={{ marginBottom: 24 }}
                title="待办事项"
                bordered={false}
                extra=""
                bodyStyle={{ padding: 0 }}
              >
                <List
                  loading={loading.effects['goods/listByAuditStatus']}
                  size="small"
                  itemLayout="horizontal"
                  dataSource={notice}
                  renderItem={item => (
                    <Authorized authority={item.authority}>
                      <List.Item style={{ paddingLeft: 32, paddingRight: 32 }}>
                        <List.Item.Meta
                          title={(
                            <a onClick={this.handleClick.bind(this, item)}>{item.title}</a>
                          )}
                        />
                        <div>{item.content}</div>
                      </List.Item>
                    </Authorized>
                  )}
                />
              </Card>
            </Authorized>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
