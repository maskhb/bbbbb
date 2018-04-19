import React, { createElement } from 'react';
import { Button } from 'antd';
import config from './typeConfig';
import './index.less';

export default ({ styleName, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404';
  // const clsString = styleNames(exception, styleName);

  return (
    <div styleName="exception" {...rest}>
      <div styleName="imgBlock">
        <div
          styleName="imgEle"
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div styleName="content">
        <h1>{title || config[pageType].title}</h1>
        <div styleName="desc">{desc || config[pageType].desc}</div>
        <div styleName="actions">
          {
            actions ||
              createElement(linkElement, {
                to: '/',
                href: '/',
              }, <Button type="primary">返回首页</Button>)
          }
        </div>
      </div>
    </div>
  );
};
