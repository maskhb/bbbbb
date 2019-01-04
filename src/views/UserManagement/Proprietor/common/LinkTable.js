import { Table, Input, InputNumber, Popconfirm, Form, Select } from "antd";
import _ from "lodash";
import * as http from "./http";
import { getColumns } from "./columns";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider
      value={{
        form,
        index
      }}
    >
      <tr {...props} />
    </EditableContext.Provider>
  );
};

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  render() {
    const {
      editingIndex,
      dataIndex,
      title,
      index,
      record,
      onChange,
      options,
      roomOwnerDetail,
      rules,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {({ form, index }) => {
          let editing = editingIndex === index;
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem
                  style={{
                    margin: 0
                  }}
                >
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      { required: true, message: `请选择${title}!` },
                      ...rules
                    ],
                    initialValue: record[dataIndex]
                  })(
                    <Select
                      onChange={value => onChange(value, form)}
                      style={{
                        minWidth: 100
                      }}
                      placeholder="请选择"
                    >
                      {options?.map(item => (
                        <Select.Option
                          value={item.value}
                          key={item.value}
                          title={item.text}
                          disabled={item.status == 2}
                        >
                          {item.text}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default class LinkTable extends React.Component {
  constructor(props) {
    super(props);
    const self = this;

    this.key = 0;
  }

  state = {
    // roomVO: [],
    options: {
      regionId: null,
      orgId: null,
      buildingId: null,
      floorId: null,
      roomId: null
    },
    optionsStore: {
      regionId: [],
      orgId: {},
      buildingId: {},
      floorId: {},
      roomId: {}
    },
    editingIndex: ""
  };

  componentDidMount() {
    const {
      editting,
      proprietor: { roomOwnerDetail }
    } = this.props;
    if (roomOwnerDetail?.roomVO?.length == 0) {
      this.addRow();
    }
    http.fetchRegion.call(this);
  }

  initRoomItem = roomVO =>
    Object.assign(
      {
        regionId: undefined,
        orgId: undefined,
        buildingId: undefined,
        floorId: undefined,
        roomId: undefined,

        regionNamePath: "",
        orgName: "",
        buildingName: "",
        floorName: "",
        roomNo: ""
      },
      roomVO
    );

  isEditing = index => {
    return index === this.state.editingIndex;
  };

  isOnlyRow = () => this.props.proprietor.roomOwnerDetail.roomVO.length <= 1;

  isEmpty = () => this.props.proprietor.roomOwnerDetail.roomVO.length == 0;

  // 编辑行
  edit = index => {
    const {
      proprietor: { roomOwnerDetail }
    } = this.props;
    this.clearOptions();
    this.setState({ editingIndex: index });
    this.fetchOptions(roomOwnerDetail.roomVO[index]);
  };

  clearEmptyRoomData = async () => {
    const { dispatch } = this.props;
    return await dispatch({
      type: "proprietor/clearEmptyRoomData",
      payload: ""
    });
  };

  // 清空联房数据
  clearOptions = () => {
    this.setState({
      options: {
        regionId: null,
        orgId: null,
        buildingId: null,
        floorId: null,
        roomId: null
      }
    });
  };

  // 拉取options
  fetchOptions = ({ regionId, orgId, buildingId, floorId, roomId }) => {
    http.fetchRegion.call(this);
    if (!roomId) {
      return;
    }
    http.fetchOrg.call(this, regionId);
    http.fetchBuilding.call(this, orgId);
    http.fetchFloor.call(this, orgId);
    http.fetchRoom.call(this, buildingId, floorId);
  };

  // 添加一行
  addRow = async () => {
    const { dispatch } = this.props;
    const newItem = this.initRoomItem();
    await dispatch({
      type: "proprietor/addRow",
      payload: {
        newItem
      }
    });
    const {
      proprietor: { roomOwnerDetail }
    } = this.props;
    this.edit(roomOwnerDetail?.roomVO?.length - 1);
  };

  // 删除一行
  deleteRow = async index => {
    const { dispatch } = this.props;
    await dispatch({
      type: "proprietor/deleteRow",
      payload: {
        index
      }
    });

    if (this.isEmpty()) {
      this.addRow();
    }
  };

  // 获取对应行的options
  getOptionText = values => {
    let o = _.map(
      values,
      (item, key) =>
        _.find(this.state.options[key], it => it.value == item)?.text || ""
    );
    return {
      regionNamePath: o[0],
      orgName: o[1],
      buildingName: o[2],
      floorName: o[3],
      roomNo: o[4]
    };
  };

  // 保存一行
  saveRow = (record, rowIndex, form) => {
    const { dispatch } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      let optionTexts = this.getOptionText(values);
      dispatch({
        type: "proprietor/saveRow",
        payload: {
          ...values,
          ...optionTexts,
          rowIndex
        }
      });
      this.setState({ editingIndex: "" });
    });
  };

  // 取消编辑
  cancel = (record, rowIndex, form) => {
    if (this.isOnlyRow() && !record.roomId) {
      return form.resetFields();
    }
    this.setState({ editingIndex: "" });
    // debugger
    if (!record.roomId) {
      this.deleteRow(rowIndex);
    }
  };

  render() {
    const {
      proprietor: { roomOwnerDetail }
    } = this.props;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    return (
      <Table
        components={components}
        bordered={true}
        dataSource={roomOwnerDetail.roomVO}
        columns={getColumns.call(this, EditableContext)}
        onRow={function(record, index) {
          return { index };
        }}
        rowClassName="editable-row"
        pagination={false}
      />
    );
  }
}
