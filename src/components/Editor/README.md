# 富文本编辑器

对[react-draft-wysiwyg](https://www.npmjs.com/package/react-draft-wysiwyg)的封装。

## 使用

```html
<Editor ref={(inst) => { this.editor = inst; }} />
```

```js
import draftToHtml from 'draftjs-to-html';

import('draft-js').then((raw) => {
  const { convertToRaw } = raw;
  
  draftToHtml(
    convertToRaw(this.editor.state.editorState.getCurrentContent())
  )
})
```
