import React, { Component } from 'react';
import { Button } from 'antd';
import Authorized from 'utils/Authorized';
import FooterToolbar from 'components/FooterToolbar';
import FormErrorPopover from 'components/Form/FormErrorPopover';

export default class DetailFooterToolbar extends Component {
  onPatternChange = () => {
    const { handlePatternChange } = this.props;
    if (handlePatternChange) {
      handlePatternChange();
    }
  }
  onSubmit = (e) => {
    const { handleSubmit } = this.props;
    if (handleSubmit) {
      handleSubmit(e);
    }
  }
  render() {
    const { form, fieldLabels = {}, submitBtnTitle = '提交', submitting, loading,
      pattern, patternShow = true, submittShow = true, permission, hide, children } = this.props;

    return (
      hide
        ? ''
        : (
          <Authorized authority={permission}>
            <FooterToolbar style={{ zIndex: '20' }}>
              <FormErrorPopover form={form} fieldLabels={fieldLabels} />
              {
                pattern !== 'detail' && submittShow
                  ? (
                    <Button type="primary" onClick={this.onSubmit} loading={submitting}>
                      {submitBtnTitle}
                    </Button>
                  )
                  : ''
              }
              {
                patternShow && (
                  pattern === 'edit'
                    ? (
                      <Button onClick={this.onPatternChange}>
                        取消
                      </Button>
                    )
                    : pattern === 'detail'
                      ? (
                        <Button type="primary" onClick={this.onPatternChange} disabled={loading}>
                          编辑
                        </Button>
                      )
                      : ''
                )
              }
              {
                children
              }
            </FooterToolbar>
          </Authorized>
        )
    );
  }
}
