/* eslint-disable */
import React, { Component } from 'react';
import _ from 'lodash';
import './index.less';

let editorFetchPromise;

/**
 * 获取editor promise
 * @returns {*}
 */
function fetchEditor() {
  if (editorFetchPromise) {
    return editorFetchPromise;
  }
  let resolveFuc;
  // let rejectFuc;
  editorFetchPromise = new Promise(((resolve) => {
    resolveFuc = resolve;
    // rejectFuc = reject;
  }));
  require.ensure([
    '../../../public/js/ueditor/ueditor.config.js', '../../../public/js/ueditor/ueditor.all.js', '../../../public/js/ueditor/lang/zh-cn/zh-cn.js',
  ], (require) => {
    require('../../../public/js/ueditor/ueditor.config.js');
    require('../../../public/js/ueditor/ueditor.all.js');
    require('../../../public/js/ueditor/lang/zh-cn/zh-cn.js');
    resolveFuc(UE);
  });
  return editorFetchPromise;
}

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inited: false,
      value: props.value || props.defaultValue,
      setEditorStatus: false,
    };
    this._uniqueId = _.uniqueId('editor_');
  }


  componentDidMount() {
    fetchEditor().then((UE) => {
      if (this.props.toolbars && window.UEDITOR_CONFIG) {
        this._init_toolbars = window.UEDITOR_CONFIG.toolbars;
        window.UEDITOR_CONFIG.toolbars = this.props.toolbars;
      }
      window.UEDITOR_CONFIG.toolbars = [[
        'bold', 'underline', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify',
        'simpleupload', '|', 'paragraph', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', 'background',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow',
        'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells',
        'splittorows', 'splittocols',
      ]];
      if (this.props.diyButton && this.props.diyButton.length) {
        _.map(this.props.diyButton, (obj) => {
          UE.registerUI(obj.text, obj.btnConstructor);
        });
      }

      this.UE = UE;
      this.setState({ inited: true });
    });
    super.componentDidMount && super.componentDidMount();
  }

  componentDidMount() {
    // 设置只读状态
    if (this.props.readOnly) {
      const id = setInterval(() => {
        if (this._ue && this._ue.body) {
          this._ue.body.style.webkitUserModify = 'read-only';

          if (this.state.inited) {
            clearInterval(id);
          }
        }
      }, 100);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { disabled, value, unbind } = nextProps;
    const { inited } = this.state;
    if (!inited && nextState.inited) {
      const ue = this._ue = this.UE.getEditor(this._uniqueId, {
        initialFrameWidth: 'auto',
        minFrameHeight: '150',
      });
      if (!unbind) {
        const doChange = () => {
          clearTimeout(this.timer);
          this.timer = null;
          if(this._ue && this.changed) {
            this.changed = false;
            const _html = this._ue.getContent();
            // console.log(_html);
            this.state.value = _html;
            this.props.onChange && this.props.onChange(_html);
          }
        }
        ue.addListener('contentChange', () => {
          if (!this.timer) {
            doChange();
            this.timer = setTimeout(() => {
              doChange();
            }, 500);
          } else {
            this.changed = true;
          }
        });
      }
    } else if (inited && (value !== this.state.value && value !== this.lastPropsValue)) {
      // console.log(value, this.props.value, this.state.value, value === this.props.value);
      this.lastPropsValue = value;
      this._ue.ready(() => {
        if(value) {
          // console.log('inited', value,  this.state.value, this.props.value)
          this._ue.setContent(value);
        }
      });
      // eslint-disable-next-line
      // if (this._ue.getContent() !== value) {
      // eslint-disable-next-line
      // this._ue.setContent(value);
      // }
    }
    // eslint-disable-next-line
    if (this._ue && (disabled !== this.props.disabled || !this.state.setEditorStatus)) {
      this._ue.ready(() => {
        this.state.setEditorStatus = true;
        disabled ? this._ue.setDisabled() : this._ue.setEnabled();
        // const content = this._ue.getContent();
        // this._ue.setContent(value);
        // console.log(this._ue.getContent(), value);
        if(value) {
          setTimeout(() => {
            // console.log(this._ue.getContent());
            if(this && this._ue && this.living !== false && value) {
              // console.log('status content', value)
              this._ue.setContent(value);
            }
          }, 300);
        }
      });
      // setTimeout(() => {
      //   // eslint-disable-next-line
      //   disabled ? this._ue.setDisabled() : this._ue.setEnabled()
      // }, 1000);
    }
    return false;
  }

  componentWillUnmount() {
    // eslint-disable-next-line
    this._ue.destroy();
    this.living = false;
    // eslint-disable-next-line
    this._ue = null;
    this.UE = null;
    // window.UEDITOR_CONFIG.toolbars = this._init_toolbars;
    window.UEDITOR_CONFIG.toolbars = [
      [
        'bold',
        'underline',
        'justifyleft',
        'justifycenter',
        'justifyright',
        'justifyjustify',
        'simpleupload',
      ],
    ];
  }

  getCurrentContent() {
    return this._ue.getContent();
  }

  render() {
    let edHeight = this.props.Height;
    let edWidth = this.props.Width;
    if (!edHeight) {
      edHeight = 'auto';
    } else if (!edWidth) {
      edWidth = 'auto';
    }
    return (
      <div>
        <script
          // eslint-disable-next-line
          ref={ref => this.editorRef = ref}
          name="content"
          type="text/plain"
          // eslint-disable-next-line
          id={this._uniqueId}
          className="editor-wrapper"
          style={{
            minHeight: '300px',
            height: edHeight,
            width: edWidth,
          }}
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{
          __html: this.state.value || "",
        }}
        />
      </div>
    );
  }
}

// Editor.propTypes = {
//   defaultValue: React.PropTypes.any,
//   value: React.PropTypes.any,
//   onChange: React.PropTypes.func,
//   toolbars: React.PropTypes.array,
//   diyButton: React.PropTypes.array,
// };

export default Editor;
