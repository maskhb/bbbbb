import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Row, Input, message } from 'antd';
import draftToHtml from 'draftjs-to-html';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { d3Col0, d3Col1 } from 'components/Const';
import { MonitorInput, MonitorTextArea, rules } from 'components/input';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import fieldLabels from './fieldLabels';

@connect(({ model, loading }) => ({
  model,
  submitting: loading.effects['model/add'],
}))
@Form.create()
export default class View extends Component {
  state = {
    pattern: Number(this.props.match?.params?.id) === 0 ? 'add' : 'detail',
  };

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (Number(id) !== 0) {
      dispatch({
        type: 'model/detail',
        payload: { id },
      });
    }
  }


  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;

    import('draft-js').then((raw) => {
      const { convertToRaw } = raw;

      const description = draftToHtml(
        convertToRaw(this.editor.state.editorState.getCurrentContent())
      );

      validateFieldsAndScroll((error, values) => {
        // 对参数进行处理
        if (!error) {
          dispatch({
            type: 'goods/add',
            payload: {
              description,
              ...values,
            },
          }).then(() => {
            const { goods: { result, msg } = {} } = this.props;
            if (result === 1) {
              message.error(`提交失败！${msg}`);
            } else if (result === 0) {
              message.success('提交成功。', 1, () => {
                history.back();
              });
            }
          });
        }
      });
    });
  }

  render() {
    const { form, submitting } = this.props;
    const { pattern } = this.state;
    const disabled = pattern === 'detail';

    return (
      <PageHeaderLayout>
        <Card title="卡片标题" bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="Input - 异步验证">
                  {form.getFieldDecorator('field1', {
                    rules: [{
                      required: true, message: '请输入field1',
                    }, {
                      validator: (rule, value, callback) => {
                        const { dispatch } = this.props;
                        dispatch({
                          type: 'model/xxx',
                          payload: { name: value },
                        }).then(() => {
                          const { model: { exsit = {} } = {} } = this.props;
                          if (exsit.result === 1) {
                            callback();
                          } else {
                            callback(exsit.msg || 'xxx！');
                          }
                        });
                      },
                    }],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="Input - 限定长度">
                  {form.getFieldDecorator('field2', {
                    rules: rules([{
                      required: true, message: '请输入field2',
                    }, {
                      max: 60,
                    }]),
                  })(
                    <MonitorInput maxLength={60} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="TextArea - 限定长度">
                  {form.getFieldDecorator('field3', {
                    rules: rules([{
                      required: true, message: '请输入field2',
                    }, {
                      max: 60,
                    }]),
                  })(
                    <MonitorTextArea datakey="seoTitle" rows={5} maxLength={200} form={form} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <DetailFooterToolbar
          form={form}
          fieldLabels={fieldLabels}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}
