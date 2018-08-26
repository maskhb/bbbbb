import React, { Component } from 'react';
import { Card, Form, Row, Col } from 'antd';
import { d3Col0, d3Col1 } from 'components/Const';
import DynamicRadio from './DynamicRadio';
import DynamicCheckbox from './DynamicCheckbox';
import DynamicSelect from './DynamicSelect';
import dataDivide from './dataDivide';
import styles from './Detail.less';

export default class BasePropsCard extends Component {
  constructor(props) {
    super(props);

    const { value = [] } = this.props;
    this.state = {
      list: value.list,
      choiceList: value.choiceList,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({
        list: value.list,
        choiceList: value.choiceList,
      });
    }
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { disabled, form, loading, pattern } = this.props;
    const { choiceList, list } = this.state;

    // const detailIds = list?.map(v => v.propertyKeyId); // 详情里包含的基本属性
    const data = dataDivide(choiceList);

    return (
      <Card title="基本属性" className={styles.card} bordered={false} loading={loading.effects['propertyKey/list']}>
        <Form layout="vertical">
          {data.map((group, i) => {
            return (
              <Row gutter={16} key={`${i + 1}`}>
                {group.map((item, index) => {
                  const col = index % 3 === 0 ? d3Col0 : d3Col1;
                  const propertyValueIdArray = list?.find(
                    v => v.propertyKeyId === item.propertyKeyId)
                      ?.propertyValueId?.split(',').map(v => Number(v));
                  const dynamicInputProps = {
                    form,
                    filedId: `baseProp_${item.propertyKeyId}`,
                    label: item.propertyName,
                    filters: item.propertyValuesIds?.split(',')?.map((value, valIndex) => {
                      return {
                        value: Number(value),
                        label: item.propertyValuesAll?.split(',')?.[valIndex],
                      };
                    }),
                    required: item.isRequired === 1,
                    disabled,
                    pattern,
                    value: (propertyValueIdArray?.[0] === 0) ? '' : propertyValueIdArray,
                  };

                  // const has = detailIds.includes(item.propertyKeyId);

                  const content = (
                    <Col {...col} key={item.propertyKeyId}>
                      <Row>
                        {
                          item.inputType === 1
                            ? <DynamicRadio {...dynamicInputProps} />
                            : item.inputType === 2
                              ? <DynamicCheckbox {...dynamicInputProps} />
                                : item.inputType === 3
                                  ? <DynamicSelect {...dynamicInputProps} />
                                    : item.inputType === 4
                                      ? <DynamicSelect {...dynamicInputProps} showSearch />
                                      : ''
                        }
                      </Row>
                    </Col>
                  );

                  return content;
                })}
              </Row>
            );
          })}
        </Form>
      </Card>
    );
  }
}
