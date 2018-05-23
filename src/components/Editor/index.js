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
  }

  componentDidMount() {
    const { value } = this.props;
    this.setInitialEditorState(value);
  }

  componentWillReceiveProps(nextProps) {
    const value = this.state.editorState ? draftToHtml(convertToRaw(this.state.editorState?.getCurrentContent())) : '';

    if (nextProps.value !== value && nextProps !== this.props.value) {
      this.setInitialEditorState(nextProps.value);
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState }, () => {
      if (this.props.onChange instanceof Function) {
        const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.props.onChange(value);
      }
    });
  }

  setInitialEditorState(value) {
    let editorState;
    if (value) {
      const contentBlock = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorState = EditorState.createWithContent(contentState);
    }
    this.setState({
      editorState: editorState || EditorState.createEmpty(),
    });
  }

  render() {
    const { disabled, onChange, ...props } = this.props;
    const { editorState } = this.state;

    // TODO： toolbar 暂时定这些，后续看看其他地方有哪些操作再继续有修改

    return (
      editorState && Editor
        ? (
          <Editor
            {...props}
            readOnly={disabled}
            toolbarHidden={disabled}
            editorState={editorState}
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
            // localization={{
            //   locale: 'ko',
            // }}

            onEditorStateChange={this.onEditorStateChange}
          />
        )
        : ''
    );
  }
}
