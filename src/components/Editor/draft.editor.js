import React from 'react';
import cookie from 'cookies-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import request from '../../utils/request';
import { getToken } from '../../utils/request/utils';
import './editor.less';

function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      try {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('token', getToken());
        formData.append('loginType', 1);
        formData.append('type', 2);
        formData.append('watermark', 0);
        request('/api/upload/img', {
          headers: {
            'x-client-channel': 0,
            'x-client-hardware': 0,
            'x-client-id': cookie.get('x-client-id'),
            'x-client-os': 'web',
            'x-client-os-version': 0,
            'x-client-type': 'pc',
            'x-client-version-code': 0,
            'x-client-version-name': 0,
          },
          body: formData,
        }).then((data) => {
          if (data) {
            resolve({
              data: {
                link: data[0].url,
              },
            });
          } else {
            reject();
          }
        });
      } catch (e) {
        /* eslint no-console:0 */
        console.info(e);
      }
    }
  );
}

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.currentValue = null;
    this.timer = null;
  }

  componentDidMount() {
    const { value } = this.props;
    console.debug('editor did mount...', this.editorRef);
    this.setInitialEditorState(value);
  }

  componentWillReceiveProps(nextProps) {
    console.debug(nextProps, this.props === nextProps);
    const value = this.state.editorState ? draftToHtml(convertToRaw(this.state.editorState?.getCurrentContent())) : '';
    if (
      nextProps.value !== value && nextProps.value !== this.props.value &&
      nextProps.value !== this.currentValue && !this.hasUpdated
    ) {
      this.setInitialEditorState(nextProps.value);
    }
  }

  shouldComponentUpdate() {
    // return nextProps.value !== this.props.value;
    if (this.hasChanged) {
      return false;
    }
    return true;
  }


  onEditorStateChange = (editorState) => {
    console.debug('start value handle change .....');
    this.hasChanged = true;
    this.state.editorState = editorState;
    this.hasUpdated = true;
    if (!this.timer) {
      this.handleStateByChange(editorState);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        if (this.hasUpdated) {
          this.handleStateByChange(this.state.editorState);
        }
      }, 2000);
    }
  }

  getCurrentContent() {
    if (this.editorRef) {
      return draftToHtml(convertToRaw(this.editorRef.state.editorState?.getCurrentContent()));
    } else {
      return '';
    }
  }

  setInitialEditorState(value) {
    // let editorState;
    if (value) {
      const contentBlock = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      this.state.editorState = EditorState.createWithContent(contentState);
    }
    console.debug('editorRef .......', this.editorRef, value, this.state.editorState);
    if (this.editorRef) {
      this.editorRef.setState({
        editorState: this.state.editorState || EditorState.createEmpty(),
      });
    } else {
      setTimeout(() => {
        console.debug('setTimeout', this.editorRef);
        if (this.editorRef) {
          this.editorRef.setState({
            editorState: this.state.editorState || EditorState.createEmpty(),
          });
        }
      }, 2000);
    }
  }

  handleStateByChange = (editorState) => {
    console.debug('doing value handle change .....');
    this.hasUpdated = false;
    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (this.currentValue === value) {
      console.log('change value same');
      return;
    }
    this.currentValue = value;
    if (this.props.onChange instanceof Function) {
      this.props.onChange(this.currentValue);
    }
  }

  render() {
    const { disabled, onChange, unbind, ...props } = this.props;
    const { editorState } = this.state;
    let defaultProps = {};
    if (!unbind) {
      defaultProps = {
        onEditorStateChange: this.onEditorStateChange,
      };
    }
    // TODO： toolbar 暂时定这些，后续看看其他地方有哪些操作再继续有修改
    // if (editorState) {
    //   console.debug('return again', editorState?.toJS());
    // }
    console.debug('render editor');
    return (
      Editor
        ? (
          <Editor
            {...props}
            {...defaultProps}
            readOnly={disabled}
            toolbarHidden={disabled}
            defaultEditorState={editorState || EditorState.createEmpty()}
            toolbarClassName="components-toolbar"
            wrapperClassName="components-wrapper"
            editorClassName="components-editor"
            localization={{ locale: 'zh' }}
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
              // inline: { options: ['bold', 'underline'] },
              // textAlign: {
              //   options: ['left', 'center', 'right', 'justify'],
              // },
              image: {
                uploadCallback: uploadImageCallBack,
                previewImage: true,
                alt: { present: false, mandatory: false },
              },
            }}
            ref={(ref) => {
              this.editorRef = ref;
            }}

            // onEditorStateChange={this.onEditorStateChange}
          />
        )
        : ''
    );
  }
}
