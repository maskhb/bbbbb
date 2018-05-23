import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import requireGlob from 'require-glob';
import { delay } from 'roadhog-api-doc';
// import List from 'prompt-list';

const noProxy = process.env.NO_PROXY === 'true'; // 是否禁用代理

let proxy = {}; // 代理
let mockAlways = {}; // 始终mock
let proxyAlways = {}; // 始终代理

// 获取代理和强制mock配置
const getAllProxyConfigs = () => {
  let configs = [];
  try {
    configs = fs.readFileSync('./.roadhogrc.mock.config').toString()
      .match(/(.*)/g).join(',').replace(/[,]+/g, ',').replace(/(^,|,$)/, '').split(',');
  } catch(e) {
  }
  return configs;
}

// 获取强制mock的接口
const getForceMocks = (configs) => {
  let result = [];
  try {
    result = configs.map(c => {
      if (!c.match(':')) {
        return c;
      }

      return '';
    }).join(',').replace(/[,]+/g, ',').replace(/(^,|,$)/, '').split(',');
  } catch(e) {
  }
  return result;
}

// 获取代理配置
const getProxyConfigs = (configs) => {
  let result = [];
  try {
    result = configs.map(c => {
      if (c.match(':')) {
        return c;
      }

      return '';
    }).join(',').replace(/[,]+/g, ',').replace(/(^,|,$)/, '').split(',');
  } catch(e) {
  }
  return result;
}

// 获取要代理到的域名
const getApiHost = (api_env) => {
  const config = require('./src/config/apihost.json');
  const env = process.env.NODE_ENV;
  const apiEnv = api_env || process.env.API_ENV;

  const isBrowser = typeof location !== 'undefined'; // 是浏览器

  const apiDomain = (() => {
    for (const [host, envs] of Object.entries(config)) {
      if ((env === 'production' && (isBrowser && envs.includes(location.hostname))) ||
        (env === 'development' && envs.includes(apiEnv || 'dev'))) {
        return host;
      }
    }
  })();

  if (apiDomain) {
    return `${isBrowser ? location.protocol : 'http:'}//${apiDomain}`;
  }

  return '';
}

// 获取指定文件里的所有{文件名、方法名、apiurl}
const getServiceFilesApiUrls = (serviceFileNameExtension) => {
  let result = [];

  try {
    const serviceFilePath = path.join('./src/services', serviceFileNameExtension); // 文件路径
    const serviceFilecontent = fs.readFileSync(serviceFilePath); // 文件内容

    const serviceContentMatchs = serviceFilecontent.toString().match(/async.*[\r\n\r\n].*/g); // async两行内容
    const serviceFileName = serviceFileNameExtension.replace('.js', ''); // service文件名称

    if (serviceContentMatchs) {
      for (const mI in serviceContentMatchs) {
        const methodName = serviceContentMatchs[mI].match(/async function (\w+)(\s+)?\(/)?.[1]; // 第一行，匹配async
        const apiurl = serviceContentMatchs[mI].match(/return request\([`']([\/\w\.\-]+)/)?.[1]; // 第二行，匹配return
        result.push({
          file: serviceFileName,
          method: methodName,
          apiurl,
        });
      }
    }
  } catch(e) {

  }

  return result;
}

// 空响应
const emptyRes = (r) => {
  return (req, res) => {
    const result = r || {};

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  };
}

const mockFiles = requireGlob.sync('./mock/*'); // 获取所有的mock方法
const serviceDir = fs.readdirSync('./src/services'); // 需要匹配到接口地址
const allProxyConfigs = getAllProxyConfigs();
const mocks = getForceMocks(allProxyConfigs);
const proxyConfigs = getProxyConfigs(allProxyConfigs);

for (const i in serviceDir) {
  const serviceFileNameExtension = serviceDir[i]; // 文件名+扩展名

  for (const { file, method, apiurl} of Object.values(getServiceFilesApiUrls(serviceFileNameExtension))) {
    let proxyMethod = emptyRes();
    const mockMethod = mockFiles[file]?.[method];
    if (mockMethod && typeof mockMethod === 'function') {
      proxyMethod = mockMethod; // mock是个方法
    } else {
      proxyMethod = emptyRes(mockMethod); // mock是数据
    }

    // 匹配接口地址到mock方法
    proxy[`GET ${apiurl}`] = proxy[`POST ${apiurl}`] = proxyMethod;

    // 强制mock指定地址
    if (mocks.includes(apiurl)) {
      mockAlways[`GET ${apiurl}`] = mockAlways[`POST ${apiurl}`] = proxyMethod;
    }

    // 强制mock整个文件
    for (const mock of Object.values(mocks)) {
      if (mock === serviceFileNameExtension) {
        mockAlways[`GET ${apiurl}`] = mockAlways[`POST ${apiurl}`] = proxyMethod;
      }
    }

  }
}

// 自定义代理覆写
try {
  for (const config of Object.values(proxyConfigs)) {
    let [key, ...value] = config.split(':');
    value = value.join(':');

    if (!value.match(/http/)) {
      value = getApiHost(value);
    }

    if (key.match(/\.js/)) {
      // 代理覆写整个文件
      for (const { file, method, apiurl} of Object.values(getServiceFilesApiUrls(key))) {
        proxyAlways[`GET ${apiurl}`] = proxyAlways[`POST ${apiurl}`] = value;
      }
    } else {
      // 代理覆写指定地址
      proxyAlways[`GET ${key}`] = proxyAlways[`POST ${key}`] = value;
    }
  }
} catch(e) {

}

// API_ENV环境覆写
if (process.env.API_ENV) {
  proxy = {
    // '/api': getApiHost(),
    'POST /mj': getApiHost(),
    'POST /json': getApiHost(),
    ...mockAlways,
  };

  console.log(chalk.magenta(`API_ENV: ${process.env.API_ENV} 全部走真实接口：`));
  for (const key of Object.keys(mockAlways)) {
    console.log('强制mock：', chalk.green(`${key}`));
  }
} else {
  proxy = {
    ...proxyAlways,
    ...proxy,
    ...proxyAlways,
  };

  console.log(chalk.magenta(`API_ENV: ${process.env.API_ENV} 全部走mock`));
  for (const [key, value] of Object.entries(proxyAlways)) {
    console.log('强制代理：', chalk.green(`${key}:${value}`));
  }
}

for (const [key, value] of Object.entries(proxy)) {
  if (typeof value === 'function') {
    proxy[key] = (req, res) => {
      const params = req.method === 'GET' ? req.params : req.body;
      console.log(chalk.bgYellow(`[MOCK]`), chalk.yellow(`${req.method} ${req.url}`), '\r');
      console.log('参数:', params, '\r\n');
      value(req, res);
    };
  }
}

export default noProxy ? {} : delay(proxy, 1000);

// const list = new List({
//   name: 'api_env',
//   message: chalk.green('设置API_ENV?'),
//   choices: [
//     '空',
//     'dev',
//     'stg',
//     'sit',
//     'production',
//   ]
// });
//
// list.ask(function(answer) {
//   process.env.API_ENV = answer;
//   fs.writeFile('./roadhogrc.mock.js');
// });
