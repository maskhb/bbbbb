import React from 'react';
import { Table, Select, Input, Form, Modal } from 'antd';
import { rules } from 'components/input';
import '../../../CheckIn/index.less';

const { Item: FormItem } = Form;
const { Option: SelectOption } = Select;

@Form.create()
export default class LinkRoom extends React.Component {
  static props = {}

  state = {
    tableData: [],
  }

  componentDidMount() {
    const { room: { details } } = this.props;

    if (!details?.roomOwners || details?.roomOwners?.length < 1) {
      this.handleAddItem();
    } else {
      // eslint-disable-next-line
      this.setState({
        tableData: [
          ...details?.roomOwners,
        ],
      });
    }
  }

  reqAdd = async (values, index) => {
    const { dispatch, form } = this.props;
    const { tableData } = this.state;
    const { getFieldValue, setFieldsValue } = form || {};
    const { docNo, docType } = values;

    const res = await dispatch({
      type: 'room/saveOwner',
      payload: {
        docNo,
        docType,
      },
    });
    if (res) {
      let isMore = true;
      let moreDoc;
      const { saveOwner } = this.props?.room;
      // const moreDocNo = moreOwners.forEach(m => );
      if (saveOwner.length && saveOwner.length > 0) {
        const moreNo = tableData.map((t) => { const { isAdd, isEdit, name, saveOwners, docType, phone, ...other } = t; return other; });
        moreDoc = moreNo.map((m) => { return m?.docNo; });
        saveOwner.map((o) => {
          if (tableData?.length > 1 && moreDoc.some(x => x === docNo)) {
            Modal.warning({
              title: `已有${o.name}(${o.docNo})业主信息, 请重新添加`,
              onOk: () => {
              },
            });
            isMore = false;
          } else {
            Modal.success({
              title: `已有${o.name}(${o.docNo})业主信息`,
              onOk: () => {
              },
            });
          }
          // if (o.docNo === docNo) {
          //   Modal.success({
          //     title: `已有${o.name}(${o.docNo})业主信息`,
          //     onOk: () => {
          //     },
          //   });
          // } else {
          //   Modal.warning({
          //     title: `已有${o.name}(${o.docNo})业主信息, 请重新添加`,
          //     onOk: () => {
          //     },
          //   });
          //   isMore = false;
          // }
        });
      }

      if (!isMore) {
        return;
      }
      const newTableData = tableData?.map((item, idx) => {
        const newItem = item;
        if (idx === index) {
          newItem.isEdit = false;
          newItem.isAdd = false;
          newItem.name = saveOwner?.length > 0 ? saveOwner[0]?.name : (getFieldValue(`name_${index}`));
          newItem.phone = saveOwner?.length > 0 ? saveOwner[0]?.phone : (getFieldValue(`phone_${index}`));
          newItem.docType = getFieldValue(`docType_${index}`);
          newItem.docNo = getFieldValue(`docNo_${index}`);
          newItem.saveOwners = saveOwner;
          // newItem.gender = getFieldValue(`gender_${index}`);
        // TODO: 补充相应字段
        }
        return newItem;
      });

      this.setState({
        tableData: [
          ...newTableData,
        ],
      });

      setFieldsValue({
        tableData: [
          ...newTableData,
        ] });

      return true;
    }

    return false;
  }

  handleAddItem = async () => {
    const { form } = this.props;
    const { tableData } = this.state;
    const { setFieldsValue } = form || {};

    this.setState({
      tableData: [
        ...tableData,
        { isAdd: true },
      ],
    });

    setFieldsValue({
      tableData: [
        ...tableData,
      ] });
  }

  handleRemove = (removeIndex) => {
    const { form } = this.props;
    const { tableData } = this.state;
    const { setFieldsValue } = form || {};
    const newTableData = [
      ...(tableData.filter((item, idx) => idx !== removeIndex)),
    ];
    this.setState({
      tableData: newTableData && newTableData.length > 0 ? newTableData : [{ isAdd: true }],
    });
    setFieldsValue({
      tableData: newTableData && newTableData.length > 0 ? newTableData : [{ isAdd: true }],
    });
  }

  handleEdit = (index) => {
    const { form } = this.props;
    const { tableData } = this.state;
    const { setFieldsValue } = form || {};
    const newTableData = tableData?.map((item, idx) => {
      const newItem = item;
      if (idx === index) {
        newItem.isEdit = true;
      }
      return newItem;
    });

    this.setState({
      tableData: [
        ...newTableData,
      ],
    });

    setFieldsValue({
      tableData: [
        ...newTableData,
      ] });
  }

  handleSave = (record, index) => {
    const { form } = this.props;
    const { validateFieldsAndScroll, getFieldValue } = form || {};

    // TODO: 补充相应要校验的字段
    // const vls = [`name_${index}`, `phone_${index}`, `docType_${index}`, `docNo_${index}`];

    validateFieldsAndScroll((error, values) => {
      const vls = {
        docNo: getFieldValue(`docNo_${index}`),
        docType: getFieldValue(`docType_${index}`),
        name: getFieldValue(`name_${index}`),
        phone: getFieldValue(`phone_${index}`),
        // gender: getFieldValue(`gender_${index}`),
      };

      // 对参数进行处理
      if (error) {
        return;
      }

      this.reqAdd(vls, index);
    });
    // validateFields([`name_${index}`], (error) => {
    //   if (!error) {
    //     const newTableData = tableData?.map((item, idx) => {
    //       const newItem = item;
    //       if (idx === index) {
    //         newItem.isEdit = false;
    //         newItem.isAdd = false;
    //         newItem.name = getFieldValue(`name_${index}`);
    //         // TODO: 补充相应字段
    //       }
    //       return newItem;
    //     });
    //     this.setState({
    //       tableData: [
    //         ...newTableData,
    //       ],
    //     });
    //   }
    // });
  }


  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (options = [], isMore = false, placeholder = '全部') => {
    const params = isMore ? {
      mode: 'multiple',
    } : {};

    return (
      <Select allowClear style={{ width: 150 }} placeholder={placeholder} {...params}>
        {
        options.map((item) => {
          return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
        })
      }
      </Select>
    );
  };

getOptionItemForLabelOrValue = (options, keyName, keyValue) => {
  return (options || []).find((item) => {
    return `${item[keyName]}` === `${keyValue}`;
  });
};
getOptionLabelForValue = (options) => {
  return (value) => {
    const optionItem = this.getOptionItemForLabelOrValue(options, 'value', value);
    return optionItem ? optionItem.label : null;
  };
};


  columns = () => {
    const { room: { details }, tag: { tagDocType }, form } = this.props;


    const docTypeDataSource = Object.keys(tagDocType || {}).map((item) => {
      return { label: tagDocType[item], value: item };
    });
    console.log(docTypeDataSource);


    return [{
      title: '姓名',
      dataIndex: 'name',
      render(val, record, index) {
        return record?.isAdd || record?.isEdit ? (
          <FormItem
            form={form}
            detailDefault={details}
            rules={rules([{
              max: 10,
            }])}
          >
            {
              form.getFieldDecorator(`name_${index}`, {
                initialValue: val || '',
                rules: [{
                  required: true,
                  message: '请输入姓名',
                }, {
                  max: 10,
                  message: '最多10个字',
                }],
              })(
                <Input placeholder="最多10个字" />
              )
            }

          </FormItem>
        ) : val;
      },
    }, {
      title: '手机号',
      dataIndex: 'phone',
      render(val, record, index) {
        return record?.isAdd || record?.isEdit ? (
          <FormItem
            form={form}
            detailDefault={details}
          >
            {
              form.getFieldDecorator(`phone_${index}`, {
                initialValue: val || '',
                rules: [{
                  required: true,
                  message: '请输入手机号',
                }, {
                  max: 11,
                  message: '最多11字',
                }],
              })(
                <Input placeholder="最多11个字" />
              )
            }
          </FormItem>
        ) : val;
      },
    }, {
      title: '证件类型',
      dataIndex: 'docType',
      render: (val, record, index) => {
        return record?.isAdd || record?.isEdit ? (
          <FormItem
            form={form}
            detailDefault={details}
          >
            {
              form.getFieldDecorator(`docType_${index}`, {
                initialValue: (record?.isAdd || record?.isEdit) ? '1' : '',
                rules: [{
                  required: true,
                  message: '请选择证件类型',
                }],
              })(
                this.getSearchOptionsElm(docTypeDataSource)
              )
            }
          </FormItem>
        ) : this.getOptionLabelForValue(docTypeDataSource)(val);
      },
    }, {
      title: '证件号码',
      dataIndex: 'docNo',
      render(val, record, index) {
        return record?.isAdd || record?.isEdit ? (
          <FormItem
            form={form}
            detailDefault={details}
            rules={[{
              pattern: /^[0-9A-Za-z]+$/,
              max: 18,
              message: '最多18个字',
            }, {
              max: 18,
              message: '最多18个字',
            }]}
          >
            {
              form.getFieldDecorator(`docNo_${index}`, {
                initialValue: val || '',
                rules: [{
                  required: true,
                  message: '请输入证件号',
                }, {
                  pattern: /^[0-9A-Za-z]+$/,
                  message: '请输入数字或英文',
                }, {
                  max: 18,
                  message: '最多18个字',
                }],
              })(
                <Input style={{ width: 250 }} placeholder="最多18个字" />
              )
            }

          </FormItem>
        ) : val;
      },
    }, {
      // title: '性别',
      // dataIndex: 'gender',
      // render(val, record, index) {
      //   return record?.isAdd || record?.isEdit ? (
      //     <FormItem
      //       form={form}
      //       detailDefault={details}
      //     >
      //       {
      //         form.getFieldDecorator(`gender_${index}`, {
      //         })(
      //           <Select style={{ width: 100 }} placeholder="性别">
      //             <Select.Option value="F">女</Select.Option>
      //             <Select.Option value="M">男</Select.Option>
      //           </Select>
      //         )
      //       }

      //     </FormItem>
      //   ) : val;
      // },
      title: '操作',
      dataIndex: 'oper',
      render: (val, record, index) => {
        const { tableData } = this.state;
        const len = tableData?.length;
        // console.log(record);
        return (
          <div>
            {
              !record?.isAdd && !record?.isEdit && !record?.saveOwners?.length > 0 ? (
                <a
                  style={{ marginRight: 10 }}
                  onClick={
                  () => { this.handleEdit(index); }
                }
                >编辑
                </a>
              ) :
              null
            }
            {
              record?.isAdd || record?.isEdit ? (
                <a
                  style={{ marginRight: 10 }}
                  onClick={
                  () => { this.handleSave(record, index); }
                  }
                >保存
                </a>
              ) :
              null
            }

            {
              !record?.isAdd || index > 0 ? (
                <a
                  style={{ marginRight: 10 }}
                  onClick={
                  () => { this.handleRemove(index); }
                  }
                >删除
                </a>
              ) :
              null
            }

            {
              !record?.isAdd && !record?.isEdit ? (
                <a
                  style={{ marginRight: 10 }}
                  onClick={
                  () => { this.handleAddItem(index); }
                  }
                >添加
                </a>
              ) :
              null
            }


          </div>
        );
      },
    }];
  }

  render() {
    const { tableData } = this.state;

    this.props?.form.getFieldDecorator('tableData');

    return (
      <Table
        columns={this.columns()}
        dataSource={tableData}
        rowKey="id"
        pagination={false}
      />
    );
  }
}
