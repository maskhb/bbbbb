import React, { PureComponent } from 'react';
import { Button, Dropdown, Icon } from 'antd';

export default class BatchDropdown extends PureComponent {
  render() {
    const { rows, children } = this.props;

    return (
      rows.length > 0 && (
        <span>
          <Dropdown overlay={children({ rows })}>
            <Button>
              更多操作 <Icon type="down" />
            </Button>
          </Dropdown>
        </span>
      )
    );
  }
}
