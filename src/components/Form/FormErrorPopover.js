import React, { PureComponent } from 'react';
import { Icon, Popover } from 'antd';
import styles from './FormError.less';

export default class FormError extends PureComponent {
  render() {
    const { form, fieldLabels } = this.props;
    const { getFieldsError } = form;
    const errors = getFieldsError();
    // console.log('errors', errors, fieldLabels);
    const getErrorInfo = () => {
      // const getErrorCount = (error, count = 0) => {

      // }
      // const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      // if (!errors || errorCount === 0) {
      //   return null;
      // }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          // 判断是否是的tab
          const tabParent = labelNode.closest('.ant-tabs-tabpane-inactive');
          if (tabParent) {
            tabParent.closest('.ant-tabs')?.scrollIntoView(true);
            tabParent.parentNode.childNodes.forEach((node, i) => {
              if (tabParent === node) {
                tabParent.closest('.ant-tabs').querySelectorAll('.ant-tabs-tab')[i].click();
              }
            });
          } else {
            labelNode.scrollIntoView(true);
          }
        }
      };

      const genErrorList = (error, key = '', result = []) => {
        if (!error) {
          return result;
        }
        // console.log('genErrorList', error);
        if (Array.isArray(error) && error[0]) {
          result.push(
            <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
              <Icon type="cross-circle-o" className={styles.errorIcon} />
              <div className={styles.errorMessage}>{error[0]}</div>
              <div className={styles.errorField}>{fieldLabels[key]}</div>
            </li>
          );
        } else if (typeof error === 'object') {
          Object.keys(error).forEach((k) => {
            const newKey = key ? `${key}.${k}` : k;
            genErrorList(error[k], newKey, result);
          });
        }
        return result;
      };
      const errorList = genErrorList(errors);
      if (errorList.length) {
        return (
          <span className={styles.errorIcon}>
            <Popover
              title="表单校验信息"
              content={errorList}
              overlayClassName={styles.errorPopover}
              trigger="click"
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Icon type="exclamation-circle" />
            </Popover>
            {errorList.length}
          </span>
        );
      } else {
        return null;
      }
    };

    return getErrorInfo();
  }
}
