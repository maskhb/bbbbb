import React from "react";
import moment from "moment";
import { Link } from "dva/router";
import _ from "lodash";
import Authorized from "utils/Authorized";
import * as permission from "config/permission";
import { Popover } from "antd";

export default (me, searchDefault) => {
  const arrOperate = [
    {
      title: "编号",
      dataIndex: "roomOwnerId",
      key: "roomOwnerId"
    },
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "手机号码",
      dataIndex: "phone"
    },
    {
      title: "证件号码",
      dataIndex: "docNo"
    },
    {
      title: "关联房屋",
      dataIndex: "roomId",
      render: (text, record, index) => {
        const arr =
          record?.roomVO?.map(
            item =>
              `${item.regionNamePath.replace(/\//g, "")} ${item.orgName ||
                ""} ${item.buildingName || ""} ${item.roomNo || ""}`
          ) || [];
        const more = arr.length > 1;

        const addBr = arr => {
          return _.map(arr, (item, i) => (
            <div>
              {item}
              {arr.length - 1 == i ? "" : ","}
            </div>
          ));
        };

        return more ? (
          <Popover content={addBr(arr)} overlayStyle={{ maxWidth: 500 }}>
            {arr[0] + ", ..."}
          </Popover>
        ) : (
          arr
        );
      }
    },
    {
      title: "操作",
      render: (val, record) => (
        <Authorized authority={[permission.PMS_USERMANAGEMENT_PROPRIETOR_EDIT]}>
          <Link to={`/usermanagement/proprietor/edit/${record.roomOwnerId}`}>
            编辑
          </Link>
        </Authorized>
      )
    }
  ];

  return arrOperate;
};
