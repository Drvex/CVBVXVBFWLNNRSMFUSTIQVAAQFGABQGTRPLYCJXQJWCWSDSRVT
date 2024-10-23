import React, { useState } from "react";
import "antd/dist/antd";
import { Table, Input, Button, Modal, Form } from "antd";
import "./scss/app.scss";

const initialData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", age: 28 },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", age: 22 },
  { id: 3, name: "Michael Brown", email: "michael.brown@example.com", age: 35 },
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setData(data.filter((user) => user.id !== id));
  };

  const handleModalOk = (values) => {
    if (editingUser) {
      const updatedData = data.map((user) =>
        user.id === editingUser.id ? { ...user, ...values } : user
      );
      setData(updatedData);
    } else {
      const newUser = { id: data.length + 1, ...values };
      setData([...data, newUser]);
    }
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>User Management</h1>
      <Input.Search
        placeholder="Search by name"
        onSearch={handleSearch}
        style={{ marginBottom: 20 }}
      />
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add User
      </Button>
      <Table dataSource={filteredData} columns={columns} rowKey="id" />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingUser}
          onFinish={handleModalOk}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please input the age!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
