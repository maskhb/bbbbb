import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Avatar, List, Badge } from 'antd';
import { goTo } from 'utils/utils';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import AUDITSTATUS from 'components/AuditStatus';
import './view.less';

@connect(({ goods, goodsPackage, loading, user }) => ({
  goods,
  goodsPackage,
  user,
  loading,
}))
export default class Home extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const pageInfo = {
      pageSize: 1,
      currPage: 1,
    };

    dispatch({
      type: 'goods/listByAuditStatus',
      payload: {
        auditStatus: [AUDITSTATUS.WAIT.value],
        pageInfo,
      },
    });

    dispatch({
      type: 'goods/listByAuditStatus',
      payload: {
        auditStatus: [AUDITSTATUS.FAIL.value],
        pageInfo,
      },
    });

    dispatch({
      type: 'goodsPackage/listByAuditStatus',
      payload: {
        auditStatus: AUDITSTATUS.WAIT.value - 1,
        pageInfo,
      },
    });

    dispatch({
      type: 'goodsPackage/listByAuditStatus',
      payload: {
        auditStatus: AUDITSTATUS.FAIL.value - 1,
        pageInfo,
      },
    });
  }

  handleClick = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${item.modelName}/addLinkAuditStatus`,
      payload: item.linkState,
    });

    goTo(item.href);
  }

  render() {
    const { goods, goodsPackage, loading, user } = this.props;
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

    const goodsListAuditWait = goods?.[`listAudit${AUDITSTATUS.WAIT.value}`] || {};
    const goodsListAuditFail = goods?.[`listAudit${AUDITSTATUS.FAIL.value}`] || {};

    const goodsListAuditWaitTotal = goodsListAuditWait.pagination?.total || 0;
    const goodsListAuditFailTotal = goodsListAuditFail.pagination?.total || 0;

    const goodsPackageListAuditWait = goodsPackage?.[`listAudit${AUDITSTATUS.WAIT.value}`] || {};
    const goodsPackageListAuditFail = goodsPackage?.[`listAudit${AUDITSTATUS.FAIL.value}`] || {};

    const goodsPackageListAuditWaitTotal = goodsPackageListAuditWait.pagination?.total || 0;
    const goodsPackageListAuditFailTotal = goodsPackageListAuditFail.pagination?.total || 0;

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
      href: '/goods/list',
      linkState: {
        auditStatus: AUDITSTATUS.WAIT.value,
      },
      title: '商品列表 - 待审核',
      content: content(goodsListAuditWaitTotal, color.warn),
      description: '还有xxx条数据需要处理',
      memberLink: '',
      member: '',
      updatedAt: '',
      modelName: 'goods',
    }, {
      id: 2,
      logo: 'a',
      href: '/goods/list',
      linkState: {
        auditStatus: AUDITSTATUS.FAIL.value,
      },
      title: '商品列表 - 审核不通过',
      content: content(goodsListAuditFailTotal, color.default),
      description: 'x2',
      memberLink: 'a',
      member: 'a',
      updatedAt: 1526263562560,
      modelName: 'goods',
    }, {
      id: 3,
      logo: 'a',
      href: '/goods/package',
      linkState: {
        auditStatus: AUDITSTATUS.WAIT.value - 1,
      },
      title: '套餐列表 - 待审核',
      content: content(goodsPackageListAuditWaitTotal, color.warn),
      description: 'x2',
      memberLink: 'a',
      member: 'a',
      updatedAt: 1526263562560,
      modelName: 'goodsPackage',
    }, {
      id: 4,
      logo: 'a',
      href: '/goods/package',
      linkState: {
        auditStatus: AUDITSTATUS.FAIL.value - 1,
      },
      title: '套餐列表 - 审核不通过',
      content: content(goodsPackageListAuditFailTotal, color.default),
      description: 'x2',
      memberLink: 'a',
      member: 'a',
      updatedAt: 1526263562560,
      modelName: 'goodsPackage',
    }];

    return (
      <PageHeaderLayout content={pageHeaderContent} >
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
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
                  <List.Item style={{ paddingLeft: 32, paddingRight: 32 }}>
                    <List.Item.Meta
                      title={(
                        <a onClick={this.handleClick.bind(this, item)}>{item.title}</a>
                      )}
                    />
                    <div>{item.content}</div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
