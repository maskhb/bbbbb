import React, { Component } from 'react';
import { Button } from 'antd';
import Authorized from 'utils/Authorized';
import FooterToolbar from 'components/FooterToolbar';
import FormErrorPopover from 'components/Form/FormErrorPopover';

export default class DetailFooterToolbar extends Component {
  render() {
    const { form, fieldLabels = {}, submitting, handleSubmit,
      pattern, handlePatternChange, permission } = this.props;

    return (
      <Authorized authority={permission}>
        <FooterToolbar style={{ zIndex: '20' }}>
          <FormErrorPopover form={form} fieldLabels={fieldLabels} />
          {
            pattern !== 'detail'
              ? (
                <Button type="primary" onClick={handleSubmit.bind(this)} loading={submitting}>
                  提交
                </Button>
              )
              : ''
          }
          {
            pattern === 'edit'
              ? (
                <Button onClick={handlePatternChange.bind(this)}>
                  取消
                </Button>
              )
              : pattern === 'detail'
                ? (
                  <Button type="primary" onClick={handlePatternChange.bind(this)}>
                    编辑
                  </Button>
                )
                : ''
          }
        </FooterToolbar>
      </Authorized>
    );
  }
}
