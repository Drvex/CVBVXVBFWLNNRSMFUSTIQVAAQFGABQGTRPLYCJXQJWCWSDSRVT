import React from "react";
import { Button, Card, Row, Col, Typography, Space } from "antd";
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
      const { searchTerm, currentPage, pageSize } = this.state;
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
    } = this.state;

    return (
      <div className="app-container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="header-card">
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={2} className="page-title">
                    User Management Console
                  </Title>
                </Col>
                <Col>
                  <Space>
                    <Button
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
                <Card className="stats-card">
                  <Text type="secondary">Total Users</Text>
                  <Title level={3}>{stats.total}</Title>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="stats-card">
                  <Text type="secondary">Admins</Text>
                  <Title level={3}>{stats.admins}</Title>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="stats-card">
                  <Text type="secondary">Regular Users</Text>
                  <Title level={3}>{stats.users}</Title>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <SearchBar onSearch={this.handleSearch} />
                </Col>
                <Col span={24}>
                  {loading ? (
                    <Loader />
                  ) : (
                    <UserTable
                      data={data}
                      onEdit={this.handleEdit}
                      onDelete={this.handleDelete}
                      pagination={{
                        current: currentPage,
                        pageSize,
                        total: totalUsers,
                        onChange: this.handlePageChange,
                        showTotal: (total) => `Total ${total} users`,
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
