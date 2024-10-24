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
      <div className="app-container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="header-card">
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={2} className="page-title">
                    User Management
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
                  <Text type="secondary">Users</Text>
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
                  <Space
                    style={{
                      marginBottom: 16,
                      marginLeft: "auto",
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <Radio.Group
                      value={pageSize}
                      onChange={this.handlePageSizeChange}
                    >
                      <Radio.Button value={2}>2</Radio.Button>
                      <Radio.Button value={5}>5</Radio.Button>
                      <Radio.Button value={10}>10</Radio.Button>
                    </Radio.Group>
                  </Space>
                  {loading ? (
                    <div style={{ justifySelf: "center" }}>
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
