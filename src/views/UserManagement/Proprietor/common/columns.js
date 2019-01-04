import { Popconfirm } from "antd";
import _ from "lodash";
import * as http from "./http";

export const getColumns = function(EditableContext) {
  const self = this;
  return [
    {
      title: "城市",
      dataIndex: "regionId",
      editable: true,
      onChange: (value, form) => {
        form.setFieldsValue({
          orgId: undefined,
          buildingId: undefined,
          floorId: undefined,
          roomId: undefined
        });
        http.fetchOrg.call(self, value);
      },
      options: self.state.options.regionId,
      render: (text, record, index) => {
        return <span>{record.regionNamePath}</span>;
      }
    },
    {
      title: "分店",
      dataIndex: "orgId",
      editable: true,
      onChange: (value, form) => {
        form.setFieldsValue({
          buildingId: undefined,
          floorId: undefined,
          roomId: undefined
        });
        http.fetchBuilding.call(self, value);
        http.fetchFloor.call(self, value);
      },
      options: self.state.options.orgId,
      render: (text, record, index) => {
        return <span>{record.orgName}</span>;
      }
    },
    {
      title: "楼栋",
      dataIndex: "buildingId",
      editable: true,
      options: self.state.options.buildingId,
      onChange: (value, form) => {
        form.setFieldsValue({ roomId: undefined });
        let floorId = form.getFieldValue("floorId");
        if (floorId) {
          http.fetchRoom.call(self, value, floorId);
        }
      },
      render: (text, record, index) => {
        return <span>{record.buildingName}</span>;
      }
    },
    {
      title: "楼层",
      dataIndex: "floorId",
      editable: true,
      options: self.state.options.floorId,
      onChange: (value, form) => {
        form.setFieldsValue({ roomId: undefined });
        let buildingId = form.getFieldValue("buildingId");
        if (buildingId) {
          http.fetchRoom.call(self, buildingId, value);
        }
      },
      render: (text, record, index) => {
        return <span>{record.floorName}</span>;
      }
    },
    {
      title: "房号",
      dataIndex: "roomId",
      editable: true,
      options: self.state.options.roomId,
      render: (text, record, index) => {
        return <span>{record.roomNo}</span>;
      },
      rules: [
        {
          validator: (rule, value, callback) => {
            const {
              proprietor: { roomOwnerDetail }
            } = self.props;

            const found = !!_.find(roomOwnerDetail.roomVO, (item, i) => {
              return self.state.editingIndex !== i && item.roomId == value;
            });

            if (found) {
              return callback("关联房间不能重复");
            }
            callback();
          }
        }
      ]
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (text, record, index) => {
        // const editable = self.isEditing(index);
        const {
          proprietor: { roomOwnerDetail }
        } = this.props;
        return (
          <div>
            {self.isEditing(index) ? (
              <EditableContext.Consumer>
                {({ form, index: rowIndex }) => (
                  <span>
                    <a
                      href="javascript:;"
                      onClick={() => self.saveRow(record, rowIndex, form)}
                      style={{
                        marginRight: 8
                      }}
                    >
                      保存
                    </a>
                    <a onClick={() => self.cancel(record, rowIndex, form)}>
                      取消
                    </a>
                  </span>
                )}
              </EditableContext.Consumer>
            ) : (
              <EditableContext.Consumer>
                {({ form, index: rowIndex }) => (
                  <span>
                    <a
                      onClick={() => {
                        self.clearEmptyRoomData();
                        self.edit(index);
                      }}
                    >
                      编辑
                    </a>
                    <Popconfirm
                      title="确定删除关联房间？"
                      onConfirm={() => {
                        self.clearEmptyRoomData();
                        self.deleteRow(rowIndex);
                      }}
                    >
                      <a
                        style={{
                          marginLeft: 8
                        }}
                      >
                        删除
                      </a>
                    </Popconfirm>
                    {index === roomOwnerDetail?.roomVO?.length - 1 ? (
                      <a
                        onClick={() => self.addRow()}
                        style={{
                          marginLeft: 8
                        }}
                      >
                        添加
                      </a>
                    ) : (
                      ""
                    )}
                  </span>
                )}
              </EditableContext.Consumer>
            )}
          </div>
        );
      }
    }
  ].map((col, i) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editingIndex: self.state.editingIndex,
        onChange: col.onChange ? col.onChange : f => f,
        options: self.state.options[col.dataIndex],
        roomOwnerDetail: self.props.proprietor?.roomOwnerDetail,
        rules: col.rules || []
      })
    };
  });
};
