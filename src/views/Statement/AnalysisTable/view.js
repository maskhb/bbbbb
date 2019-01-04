
import React, { PureComponent } from 'react';

import { Card } from 'antd';
import { connect } from 'dva';

import PanelList from 'components/PanelList';
import Table from 'components/TableStandard';

import SearchHeader from './components/SearchHeader';

import getColumns from './column';


@connect(({ analysisTable }) => ({
  analysisTable,
}))

class View extends PureComponent {
   static defaultProps = {};

   state = {}

   render() {
     const { loading, analysisTable } = this.props;
     const { queryList } = analysisTable || {};

     return (
       <Card>
         <PanelList>
           <SearchHeader {...this.props} />
           <Table
             ref={(inst) => { this.searchTable = inst; }}
             loading={loading}
             columns={getColumns(this)}
             disableRowSelection
             rowKey="infoId"
             dataSource={queryList?.list}
             pagination={queryList?.pagination}
           />
         </PanelList>
       </Card>
     );
   }
}

export default View;
