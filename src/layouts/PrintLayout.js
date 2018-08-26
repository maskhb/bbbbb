import React from 'react';
import { Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { getRoutes } from '../utils/utils';

class PrintLayout extends React.PureComponent {
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle>
        <div>
          <Switch>
            {getRoutes(match.path, routerData).map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )}
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default PrintLayout;
