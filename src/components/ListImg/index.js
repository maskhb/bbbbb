import React, { PureComponent } from 'react';
import { Popover } from 'antd';

export default class ListImg extends PureComponent {
  render() {
    const { url, width = 80, height = 50 } = this.props;

    const imgdiv = (val, multi = 1, size) => {
      let src = val;
      const isBmp = src.toLowerCase().indexOf('.bmp') > -1;
      if (val) {
        const ims = val.split('.');
        if (ims.length > 1 && !isBmp) {
          ims[ims.length - 2] = `${ims[ims.length - 2]}_${width * multi}X${height * multi}`;
          src = ims.join('.');
        }
      }
      return (
        <div style={{
        width: width * multi,
        height: height * multi,
        backgroundImage: `url(${src})`,
        backgroundSize: size ? 'contain' : 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        }}
        />
      );
    };

    return (
      url
        ? (
          <Popover placement="right" title="" content={imgdiv(url, 4, 1)} trigger="hover">
            <a target="_blank" rel="noopener noreferrer" href={url}>
              {imgdiv(url)}
            </a>
          </Popover>
        )
        : <div style={{ width, height }} />
    );
  }
}
