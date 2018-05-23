const path = require('path');
const Builder = require('htlib/src/builder/config-builder');
const _ = require('lodash');


const builder = new Builder();
builder.willCreateConfigJsonFile = true;

builder
  .output(path.resolve(__dirname, './proxy-configs'))
  .envMap({
    release: {
      server_name: 'ht-jj-platform.htmimi.com jj-platform.htmimi.cn',
      locationRoot: '/htdata/www/jj-platform',
      access_log: '/var/log/nginx/log/jj-platform.log logstash buffer=32k flush=5m',
      error_log: '/var/log/nginx/log/err-jjpatform.log',
    },
    stg: {
      server_name: 'ht-jj-platform-stg.htmimi.com stg.jj-platform.htmimi.cn',
      locationRoot: '/htdata/www/jj-platform',
      access_log: '/var/log/nginx/log/stg.jj-platform.log',
      error_log: '/var/log/nginx/log/stg.err-jjpatform.log',
    },
    fix: {
      server_name: 'ht-jj-platform-fix.hd fix.jj-platform.hd',
      locationRoot: '/htdata/www/jj-platform',
      access_log: '/var/log/nginx/log/beta.jj-platform.log',
      error_log: '/var/log/nginx/log/beta.err-jjpatform.log',
    },
    beta: {
      server_name: 'ht-jj-platform-test.htmimi.com ht-jj-platform-test.hd test.jj-platform.hd',
      locationRoot: '/htdata/www2/jj-platform',
      access_log: '/var/log/nginx/log/beta.jj-platform.log',
      error_log: '/var/log/nginx/log/beta.err-jjpatform.log',
    },
    sit: {
      server_name: 'ht-jj-platform-sit.htmimi.com ht-jj-platform-sit.hd sit.jj-platform.hd',
      locationRoot: '/htdata/www2/jj-platform',
      access_log: '/var/log/nginx/log/sit.jj-platform.log',
      error_log: '/var/log/nginx/log/sit.err-jjpatform.log',
    },
    development: {
      server_name: 'ht-jj-platform-dev.hd dev.jj-platform.hd',
      locationRoot: '/htdata/www/jj-platform',
      access_log: '/var/log/nginx/log/beta.jj-platform.log',
      error_log: '/var/log/nginx/log/beta.err-jjpatform.log',
    },
    dev: {
      server_name: 'ht-jj-platform-dev.hd dev.jj-platform.hd',
      locationRoot: '/htdata/www/jj-platform',
      access_log: '/var/log/nginx/log/beta.jj-platform.log',
      error_log: '/var/log/nginx/log/beta.err-jjpatform.log',
    },
    stress: {
      server_name: 'ht-jj-platform-stress.hd stress.jj-platform.hd',
      locationRoot: '/htdata/www/jj-platform',
      access_log: '/var/log/nginx/log/stress.jj-platform.log',
      error_log: '/var/log/nginx/log/stress.err-jjpatform.log',
    },
  })
  .setCustomProxy((config) => {
    // 为了nginx能访问到img
    const img = _.template(builder.envTemplates.preImgDomainMap[config.env || 'dev'])({ preDomain: 'img1' });
    const imgHost = img.replace('http://', '');
    const mj = builder.envTemplates.mjPreDomainMap[config.env || 'dev'];

    // console.log(mj);

    return `location ~* /api/img/(.*) {
        proxy_pass ${img}/$1;
        proxy_set_header Host ${imgHost};
      }

      location / {
        root ${config.locationRoot};
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control no-store;
      }

      location /download/ {
        proxy_pass http://${mj}/;
        proxy_set_header Host ${mj};
      }

      location ~* .(js|css|png|jpg)$ {
        root ${config.locationRoot};
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        expires 5d;
      }`;
  })
  .setProxy((pre) => {
    return {
      '/api/system': `${pre('sys-sso-api')}`,
      '/api/system/private': `${pre('sys-privilege-api')}`,
      '/api/system/user': `${pre('sys-user-api')}`,
      '/api/pay': `${pre('payment-api')}`,
      '/api/upload': `${pre('upload-api')}/upload`,
      '/api/captcha': `${pre('verify-api')}/captcha`,
      '/api/excel/export/getFileWithToken': `${pre('pub-export-api')}/export/getFileWithToken`,
      '/api/encode-get': `${pre('web-proxy')}/encode-get`,
      '/mj': `${pre('web-proxy')}/mj`,
      '/json': `${pre('web-proxy')}/json`,
    };
  });

builder.run();
