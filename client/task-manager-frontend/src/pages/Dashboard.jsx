import React, { useState, useEffect } from 'react';
import {
  Layout,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Dropdown,  
  Menu,
  Avatar,
  Tooltip,
  Empty,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authAPI, tasksAPI } from '../services/api';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const navigate = useNavigate();

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Build query parameters for filtering
      const queryParams = new URLSearchParams();
      
      // Add status filter if not 'all'
      if (statusFilter && statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      // Add search parameter if provided
      if (debouncedSearchText && debouncedSearchText.trim()) {
        queryParams.append('search', debouncedSearchText.trim());
      }
      
      // Add pagination and sorting parameters
      queryParams.append('page', '1');
      queryParams.append('limit', '50'); // Get more tasks
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('sortOrder', 'desc');
      
      const response = await tasksAPI.getTasks(queryParams.toString());
      if (response.data && response.data.tasks && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Refetch tasks when filters change
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [statusFilter, debouncedSearchText]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const taskData = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate?.toISOString(),
        priority: values.priority || 'medium',
        status: values.status || 'pending'
      };

      if (editingTask) {
        console.log("pending");
        
        // Update existing task
        const response = await tasksAPI.updateTask(editingTask._id, taskData);
        if (response.data && (response.data.success || response.data._id)) {
          message.success('Task updated successfully');
          fetchTasks(); // Refresh the task list
        } else {
          message.error(response.data?.message || 'Failed to update task');
        }
      } else {
        // Create new task
        const response = await tasksAPI.createTask(taskData);
        if (response.data && (response.data.success || response.data._id)) {
          message.success('Task created successfully');
          fetchTasks(); // Refresh the task list
        } else {
          message.error(response.data?.message || 'Failed to create task');
        }
      }

      setModalVisible(false);
      setEditingTask(null);
      form.resetFields();
    } catch (error) {
      console.error('Task operation error:', error);
      const errorMessage = error.response?.data?.message || 'Operation failed';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      // Remove the task locally first for immediate UI feedback
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      
      const response = await tasksAPI.deleteTask(taskId);
      if (response.status === 204 || response.data?.success) {
        message.success('Task deleted successfully');
        // Fetch fresh data to ensure consistency
        setTimeout(() => {
          fetchTasks();
        }, 500);
      } else {
        message.error('Failed to delete task');
        // If delete failed, restore the task
        fetchTasks();
      }
    } catch (error) {
      console.error('Delete task error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete task';
      message.error(errorMessage);
      // If delete failed, restore the task
      fetchTasks();
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await tasksAPI.updateTask(taskId, { status: newStatus });
      if (response.data && (response.data.success || response.data._id)) {
        message.success('Task status updated');
        // Update the task locally first for immediate UI feedback
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId 
              ? { ...task, status: newStatus }
              : task
          )
        );
        // Then fetch fresh data from server
        setTimeout(() => {
          fetchTasks();
        }, 500);
      } else {
        message.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      message.error(errorMessage);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
    });
    setModalVisible(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      message.success('Logged out successfully');
      navigate('/login');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' };
      case 'in_progress':
        return { color: 'blue', icon: <ClockCircleOutlined />, text: 'In Progress' };
      case 'pending':
        return { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' };
      default:
        return { color: 'default', icon: null, text: status };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const filteredTasks = tasks; // Backend handles filtering now

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const columns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
            {record.description && record.description.length > 100 
              ? `${record.description.substring(0, 100)}...` 
              : record.description || 'No description'
            }
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color={getPriorityColor(record.priority)} size="small">
              {record.priority?.toUpperCase() || 'MEDIUM'}
            </Tag>
          </div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'In Progress', value: 'in_progress' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => {
        if (!date) return <Text type="secondary">No due date</Text>;
        
        const dueDate = dayjs(date);
        const isOverdue = dueDate.isBefore(dayjs(), 'day');
        const isToday = dueDate.isSame(dayjs(), 'day');
        
        return (
          <div>
            <div style={{ 
              color: isOverdue ? '#ff4d4f' : isToday ? '#fa8c16' : '#666',
              fontWeight: isOverdue || isToday ? 500 : 400
            }}>
              {dueDate.format('MMM DD, YYYY')}
            </div>
            {isOverdue && <div style={{ fontSize: '11px', color: '#ff4d4f' }}>Overdue</div>}
            {isToday && <div style={{ fontSize: '11px', color: '#fa8c16' }}>Due today</div>}
          </div>
        );
      },
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item 
                  key="pending" 
                  onClick={() => handleStatusUpdate(record._id, 'pending')}
                  icon={<ClockCircleOutlined />}
                >
                  Mark as Pending
                </Menu.Item>
                <Menu.Item 
                  key="in_progress" 
                  onClick={() => handleStatusUpdate(record._id, 'in_progress')}
                  icon={<ClockCircleOutlined />}
                >
                  Mark as In Progress
                </Menu.Item>
                <Menu.Item 
                  key="completed" 
                  onClick={() => handleStatusUpdate(record._id, 'completed')}
                  icon={<CheckCircleOutlined />}
                >
                  Mark as Completed
                </Menu.Item>
              </Menu>
            }
          >
            <Button size="small">Status</Button>
          </Dropdown>
          <Tooltip title="Edit task">
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete task">
              <Button 
                type="primary" 
                danger 
                size="small" 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Task Manager
          </Title>
        </div>
        <Space>
          <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
          <Text>{user.name}</Text>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Total Tasks" 
                value={stats.total}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Pending" 
                value={stats.pending} 
                valueStyle={{ color: '#fa8c16' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="In Progress" 
                value={stats.inProgress} 
                valueStyle={{ color: '#1890ff' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Completed" 
                value={stats.completed} 
                valueStyle={{ color: '#52c41a' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Text strong>Filter by status:</Text>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%', marginTop: 8 }}
              >
                <Option value="all">All Tasks</Option>
                <Option value="pending">Pending</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Text strong>Search tasks:</Text>
              <Input
                placeholder="Search tasks..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                onClick={() => {
                  setStatusFilter('all');
                  setSearchText('');
                }}
                style={{ marginTop: 28 }}
              >
                Clear Filters
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreate}
                size="large"
                style={{ marginTop: 28 }}
              >
                Add New Task
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tasks Table */}
        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Loading tasks...</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <Empty
              description="No tasks found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleCreate}>
                Create Your First Task
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredTasks}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} tasks`,
                responsive: true
              }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>
      </Content>

      {/* Task Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priority: 'medium',
            status: 'pending'
          }}
        >
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter task title' }]}
          >
            <Input 
              placeholder="Enter task title" 
              size="large"
              prefix={<FileTextOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter task description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter detailed task description"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Select due date"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
              >
                <Select size="large" placeholder="Select priority">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {editingTask && (
            <Form.Item
              name="status"
              label="Status"
            >
              <Select size="large" placeholder="Select status">
                <Option value="pending">Pending</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setModalVisible(false);
                  setEditingTask(null);
                  form.resetFields();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                loading={submitting}
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Dashboard; 