# SelectSearch

```js
form.getFieldDecorator('merchantName', {
})(
  <SelectSearch
  onSearch={this.handleSearchMerchant} />
)
```

```js
handleSearchMerchant = (value) => {
  const { dispatch } = this.props;

  return dispatch({
    type: 'business/list',
    payload: value,
  }).then((res) => {
    const data = res?.list?.map(item => ({
      text: item.merchantName,
      value: item.merchantName,
    }));

    return data;
  });
}
```
