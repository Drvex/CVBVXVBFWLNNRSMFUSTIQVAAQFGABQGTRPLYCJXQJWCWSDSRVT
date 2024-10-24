import React from "react";
import { Button, Card, Row, Col, Typography, Space, Radio } from "antd";
import { UserAddOutlined, ReloadOutlined } from "@ant-design/icons";
import "antd/dist/antd";
import "./scss/app.scss";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import SearchBar from "./components/SearchBar";
import Loader from "./components/Loader";
import { UserService } from "./utils/api";
import { showNotification } from "./utils/notification";

const { Title, Text } = Typography;

class App extends React.PureComponent {
  state = {
    data: [],
    searchTerm: "",
    editingUser: null,
    isModalVisible: false,
    loading: true,
    totalUsers: 0,
    currentPage: 1,
    pageSize: 10,
    stats: {
      total: 0,
      admins: 0,
      users: 0,
    },
    sortedColumn: null,
    sortOrder: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  calculateStats = (users) => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      users: users.filter((user) => user.role === "user").length,
    };
  };

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const { searchTerm } = this.state;
      const response = await UserService.getUsers(searchTerm);
      const stats = this.calculateStats(response.users);

      this.setState({
        data: response.users,
        totalUsers: response.totalCount,
        stats,
        loading: false,
      });
    } catch (error) {
      this.setState({ loading: false });
      showNotification("error", "Error", error.message);
    }
  };

  handleSearch = async (value) => {
    this.setState({ searchTerm: value, currentPage: 1 }, this.fetchData);
  };

  handleEdit = (user) => {
    this.setState({ editingUser: user, isModalVisible: true });
  };

  sortData = (key) => {
    const { sortedColumn, sortOrder } = this.state;
    const newSortOrder =
      sortedColumn === key && sortOrder === "asc" ? "desc" : "asc";
    const sortedData = [...this.state.data].sort((a, b) => {
      if (newSortOrder === "asc") {
        return typeof a[key] === "string"
          ? a[key].localeCompare(b[key])
          : a[key] - b[key];
      } else {
        return typeof b[key] === "string"
          ? b[key].localeCompare(a[key])
          : b[key] - a[key];
      }
    });

    this.setState({
      data: sortedData,
      sortedColumn: key,
      sortOrder: newSortOrder,
    });
  };

  handleDelete = async (id) => {
    try {
      await UserService.deleteUser(id);
      showNotification("success", "Success", "User deleted successfully");
      this.fetchData();
    } catch (error) {
      showNotification("error", "Error", error.message);
    }
  };

  handleModalOk = async (values) => {
    try {
      const { editingUser } = this.state;
      if (editingUser) {
        await UserService.updateUser(editingUser.id, values);
        showNotification("success", "Success", "User updated successfully");
      } else {
        await UserService.createUser(values);
        showNotification("success", "Success", "User created successfully");
      }

      this.setState(
        { isModalVisible: false, editingUser: null },
        this.fetchData
      );
    } catch (error) {
      showNotification("error", "Error", error.message);
    }
  };

  handleModalCancel = () => {
    this.setState({ isModalVisible: false, editingUser: null });
  };

  handlePageChange = (page, pageSize) => {
    this.setState({ currentPage: page, pageSize }, this.fetchData);
  };

  handlePageSizeChange = (e) => {
    const pageSize = e.target.value;
    this.setState({ pageSize, currentPage: 1 }, this.fetchData);
  };

  render() {
    const {
      isModalVisible,
      editingUser,
      loading,
      data,
      totalUsers,
      currentPage,
      pageSize,
      stats,
      sortedColumn,
      sortOrder,
    } = this.state;

    return (
      <div
        className="app-container"
        style={{ padding: "24px", background: "#f0f2f5" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card bordered={false}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                    User Management
                  </Title>
                </Col>
                <Col>
                  <Space size="middle">
                    <Button
                      type="default"
                      icon={<ReloadOutlined />}
                      onClick={this.fetchData}
                      loading={loading}
                    >
                      Refresh
                    </Button>
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      onClick={() =>
                        this.setState({
                          isModalVisible: true,
                          editingUser: null,
                        })
                      }
                    >
                      Add User
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card
                  bordered={false}
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #1890ff11 0%, #1890ff05 100%)",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    Total Users
                  </Text>
                  <Title
                    level={2}
                    style={{ margin: "8px 0 0", color: "#1890ff" }}
                  >
                    {stats.total}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  bordered={false}
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #52c41a11 0%, #52c41a05 100%)",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    Admins
                  </Text>
                  <Title
                    level={2}
                    style={{ margin: "8px 0 0", color: "#52c41a" }}
                  >
                    {stats.admins}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  bordered={false}
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #722ed111 0%, #722ed105 100%)",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    Users
                  </Text>
                  <Title
                    level={2}
                    style={{ margin: "8px 0 0", color: "#722ed1" }}
                  >
                    {stats.users}
                  </Title>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Card bordered={false}>
              <Row gutter={[16, 16]}>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <SearchBar onSearch={this.handleSearch} />
                  <Radio.Group
                    value={pageSize}
                    onChange={this.handlePageSizeChange}
                    optionType="button"
                  >
                    <Radio.Button value={2}>2</Radio.Button>
                    <Radio.Button value={5}>5</Radio.Button>
                    <Radio.Button value={10}>10</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col span={24}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                      <Loader />
                    </div>
                  ) : (
                    <UserTable
                      data={data}
                      onEdit={this.handleEdit}
                      onDelete={this.handleDelete}
                      onSort={this.sortData}
                      sortedColumn={sortedColumn}
                      sortOrder={sortOrder}
                      pagination={{
                        current: currentPage,
                        pageSize,
                        total: totalUsers,
                        onChange: this.handlePageChange,
                        showTotal: (total) => `Total ${total} users`,
                        showSizeChanger: false,
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <UserModal
          visible={isModalVisible}
          onCancel={this.handleModalCancel}
          onOk={this.handleModalOk}
          editingUser={editingUser}
          loading={loading}
        />
      </div>
    );
  }
}

export default App;
