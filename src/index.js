import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './index.less';
import history from './utils/history';

window.APP_PREFIX = window.location.pathname.replace(/\/$/, '');
// 1. Initialize
const app = dva({
  history,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

FastClick.attach(document.body);

export default app._store;  // eslint-disable-line
