const sw2dts = require('sw2dts');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const axios = require('axios');

const outputPath = path.resolve(__dirname, '../src/viewmodels/st.ts');

axios.get('http://10.100.163.57:8850/v2/api-docs')
  .then((response) => {
    // handle success
    const { data } = response;
    sw2dts.convert(data, {}).then((dts) => {
      const newDts = dts
        .replace(/export interface/g, 'export class');

      const perLine = _.union(newDts.split('\n').filter(item => item.indexOf(': ') !== -1)
        .filter(item => item.indexOf('?: ') === -1).filter(item => item.indexOf('*') === -1));

      const reg = new RegExp(perLine.join('|'), 'g');

      fs.writeFileSync(outputPath, _.replace(newDts, reg, (item) => {
        return item.replace('number', 'number=0').replace('string', "string=''");
      }));
    });
  })
  .catch((error) => {
    console.log(error);
  });
