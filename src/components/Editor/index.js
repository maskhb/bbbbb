import React from 'react';
import UEditor from './ueditor';
// import DraftEditor from './draft.editor';

export default class extends React.Component {
  getCurrentContent() {
    return this.editor.getCurrentContent();
  }

  render() {
    const { type, ...other } = this.props;
    // eslint-disable-next-line
    return <UEditor ref={ ref => this.editor = ref } {...other} />;
    // if (type === 'ueditor') {
    //   // eslint-disable-next-line
    //   return <UEditor ref={ ref => this.editor = ref } {...other} />;
    // } else {
    //   // eslint-disable-next-line
    //   return <DraftEditor ref={ ref => this.editor = ref} {...other} />;
    // }
  }
}
