import React, { Component } from 'react';
import { Form } from 'antd';
import { withState } from 'recompose';
import uuidv4 from 'uuid/v4';
import childrenWithProps from '../../utils/childrenWithProps';
import Search from '../TableSearch';
import Batch from '../TableBatch';
import Table from '../TableStandard';

@withState('selectedRows', 'setSelectedRows', [])
@withState('stateOfSearch', 'setStateOfSearch', {})
@Form.create()
export default class PanelList extends Component {
  constructor(props) {
    super(props);
    this.uuid = uuidv4();
  }

  render() {
    const {
      children,
      form,
      stateOfSearch,
      setStateOfSearch,
      selectedRows,
      setSelectedRows,
    } = this.props;
    const passProps = {
      form,
      stateOfSearch,
      setStateOfSearch,
      selectedRows,
      setSelectedRows,
    };

    return (
      <div>
        {childrenWithProps(children[0], { ...passProps, uuid: this.uuid })}
        {childrenWithProps(children[1], { ...passProps, uuid: this.uuid })}
        {childrenWithProps(children[2], { ...passProps, uuid: this.uuid })}
      </div>
    );
  }
}

export {
  Search,
  Batch,
  Table,
};
