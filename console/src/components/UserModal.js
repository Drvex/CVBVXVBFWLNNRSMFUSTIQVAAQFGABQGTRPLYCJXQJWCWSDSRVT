import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const { Option } = Select;

const UserModal = ({ visible, onCancel, onOk, editingUser, loading }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && editingUser) {
      form.setFieldsValue(editingUser);
    } else {
      form.resetFields();
    }
  }, [visible, editingUser, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Değişiklik
      onOk(values);
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  return (
    <Modal
      title={editingUser ? "Edit User" : "Add User"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role: "user",
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="surname"
          label="Surname"
          rules={[{ required: true, message: "Please input surname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please input valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        {!editingUser && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>

        <Form.Item name="age" label="Age">
          <InputNumber min={0} max={150} />
        </Form.Item>

        <Form.Item name="country" label="Country">
          <Input />
        </Form.Item>

        <Form.Item name="district" label="District">
          <Input />
        </Form.Item>

        <Form.Item name="role" label="Role">
          <Select>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
