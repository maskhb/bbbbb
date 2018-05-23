import _ from 'lodash';
import { configs } from '../collectConfigs';
import { getRealAuthority } from '../utils';

const getLevel = key => key.match(/(\$|\/)/g)?.length || 0;
const getPath = key => key.replace(/\$/g, '/').toLowerCase();
const maxLevel = Math.max(...Object.keys(configs).map(key => getLevel(key)));
let menus = [];
let done = false;

function getChildren(items, level = 1) {
  if (level === 1) {
    return items;
  } else if (level === 2) {
    return _.flatten(items.map(i => i.children), true);
  } else if (level === 3) {
    return _.flatten(items.map(i => _.flatten(i.children.map(c => c.children), true)), true);
  }
}

function loop(level = 0) {
  if (level > maxLevel) {
    done = true;
    return;
  }

  if (level === 0) {
    for (const [key, { menu, route }] of Object.entries(configs)) {
      if (getLevel(key) === level) {
        const path = getPath(key);
        menus.push({
          ...menu,
          authority: getRealAuthority(menu.authority || route?.authority),
          level,
          path,
          children: [],
        });
      }
    }
    menus = _.sortBy(menus, 'order');
  } else {
    for (const pMenu of getChildren(menus, level)) {
      for (const [key, { menu = {}, route }] of Object.entries(configs)) {
        if (getLevel(key) === level) {
          const path = getPath(key);
          if (path.substr(0, path.lastIndexOf('/')) === pMenu.path) {
            pMenu.children.push({
              ...menu,
              authority: getRealAuthority(menu.authority || route?.authority),
              name: menu.name,
              level,
              path,
              children: [],
            });
          }
        }
      }
      pMenu.children = _.sortBy(pMenu.children, 'order');
      // 把下级菜单的权限纳入上级菜单
      if (pMenu.authority) {
        if (Array.isArray(pMenu.authority)) {
          pMenu.authority = _.uniq(
            pMenu.authority.concat(_.flatten(
              pMenu.children.map(menu => menu.authority
              )))
          );
        } else if (typeof pMenu.authority === 'string') {
          pMenu.authority = _.uniq(
            [pMenu.authority].concat(_.flatten(
              pMenu.children.map(menu => menu.authority
              )))
          );
        }
      } else {
        const auths = _.uniq(_.flatten(pMenu.children.map(
          menu => menu.authority
        )));
        if (auths.length > 1) {
          pMenu.authority = auths;
        } else if (auths.length === 1) {
          [pMenu.authority] = auths;
        }
      }
    }
  }

  return loop(level + 1);
}

function centra() {
  if (done) {
    return menus;
  }

  if (!menus.length) {
    loop();
  }

  return menus;
}

export default centra;
