import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check, { checkPermissions } from './CheckPermissions.js';


/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';

Authorized.Secured = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;
Authorized.checkPermissions = checkPermissions;

/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = (currentAuthority) => {
  if (currentAuthority) {
    if (currentAuthority.constructor.name === 'Function') {
      CURRENT = currentAuthority();
    } else if (currentAuthority.constructor.name === 'Array') {
      CURRENT = currentAuthority;
    } else if (currentAuthority.constructor.name === 'String') {
      CURRENT = [currentAuthority];
    }
  } else {
    CURRENT = 'NULL';
  }
  return Authorized;
};

// export { CURRENT };
export const getCurrentPermissions = () => {
  return CURRENT;
};
export default renderAuthorize;
