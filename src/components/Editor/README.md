# 富文本编辑器

对[react-draft-wysiwyg](https://www.npmjs.com/package/react-draft-wysiwyg)的封装。

## 使用

```jsx
<Editor ref={(inst) => { this.editor = inst; }} />
<Editor unbind ref={(inst) => { this.editor = inst; }} />
// 兼容 form.getFieldDecorator. 可使用form.getFieldDecorator 进行双项绑定
//    => 已做优化
// props:
//   unbind (最快)
//     => 取消双项绑定/onChange绑定
//     => 如果使用此参数,只能通过 this.editor.getCurrentContent() 获取
```

```js
this.editor.getCurrentContent()

// or 
import draftToHtml from 'draftjs-to-html';

import('draft-js').then((raw) => {
  const { convertToRaw } = raw;
  
  draftToHtml(
    convertToRaw(this.editor.state.editorState.getCurrentContent())
  )
})
```
