import React, { Component } from 'react';
import { Form } from 'antd';
import { withState } from 'recompose';
import childrenWithProps from '../../utils/childrenWithProps';

function childrenToJSON(children) {
  return Object.assign(...children.map((c, i) => {
    if (!c.type) {
      throw new Error(`Panelist第${i + 1}个子元素类型未知`);
    }

    if (!['Search', 'Batch', 'TableStandard'].includes(c.type.name)) {
      throw new Error(`Panelist第${i + 1}个子元素类型未知, ${c.type.name}`);
    }

    return { [c.type?.name]: c };
  }));
}

@withState('stateOfSearch', 'setStateOfSearch', {})
@withState('stateOfHideColumns', 'setStateOfHideColumns', [])
@withState('stateOfHideColumnsTemp', 'setStateOfHideColumnsTemp', {})
@Form.create()
export default class PanelDetail extends Component {
  render() {
    const { children, form, stateOfSearch, setStateOfSearch } = this.props;
    const { Search, Batch, TableStandard } = childrenToJSON(children);
    const passProps = { form, stateOfSearch, setStateOfSearch };

    return (
      <div>
        {childrenWithProps(Search, { ...passProps })}
        {childrenWithProps(Batch, { ...passProps })}
        {childrenWithProps(TableStandard, { ...passProps })}
      </div>
    );
  }
}
