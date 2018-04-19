import React from 'react';
import cookie from 'cookies-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import request from '../../utils/request';
import './editor.less';

let EditorState;
let Editor;

function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      request('/api/upload/img', {
        method: 'POST',
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
        body: {
          token: cookie.get('x-manager-token'),
          loginType: 1,
          type: 2,
          watermark: 0,
          file,
        },
      }).then((response) => {
        if (response.data) {
          resolve({
            data: {
              link: response.data[0].url,
            },
          });
        } else {
          reject();
        }
      });
    }
  );
}

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    import('draft-js').then((raw) => {
      ({ EditorState } = raw);

      this.setState({
        editorState: EditorState.createEmpty(),
      });
    });

    import('react-draft-wysiwyg').then((raw) => {
      ({ Editor } = raw);
    });
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  }

  render() {
    const { disabled, ...props } = this.props;
    const { editorState } = this.state;

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
            toolbar={{
              image: {
                uploadCallback: uploadImageCallBack,
                alt: { present: true, mandatory: true },
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
