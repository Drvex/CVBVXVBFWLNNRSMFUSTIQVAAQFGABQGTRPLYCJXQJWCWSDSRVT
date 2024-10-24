import React from "react";
import { Table, Space, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";

const UserTable = ({
  data,
  onEdit,
  onDelete,
  pagination,
  onSort,
  sortedColumn,
  sortOrder,
}) => {
  const columns = [
    {
      title: (
        <span onClick={() => onSort("id")}>
          ID
          {sortedColumn === "id" && sortOrder === "asc" && (
            <CaretUpOutlined style={{ marginLeft: 8 }} />
          )}
          {sortedColumn === "id" && sortOrder === "desc" && (
            <CaretDownOutlined style={{ marginLeft: 8 }} />
          )}
          {!sortedColumn && <CaretDownOutlined style={{ marginLeft: 8 }} />}
        </span>
      ),
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: (
        <span onClick={() => onSort("name")}>
          Name
          {sortedColumn === "name" && sortOrder === "asc" && (
            <CaretUpOutlined style={{ marginLeft: 8 }} />
          )}
          {sortedColumn === "name" && sortOrder === "desc" && (
            <CaretDownOutlined style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => `${text} ${record.surname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <span>
          {record.district}, {record.country}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <span className={`role-badge ${text.toLowerCase()}`}>{text}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      scroll={{ x: 1000 }}
    />
  );
};

export default UserTable;
