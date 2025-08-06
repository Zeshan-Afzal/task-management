import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authAPI } from '../services/api';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the real login API
      const response = await authAPI.login({
        email: values.email,
        password: values.password
      });
   console.log(response);
   
      if (response.data) {
        // Store token and user data
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log("login succ");
        
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
     
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ 
        maxWidth: 400, 
        width: '100%', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        border: 'none'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <UserOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Task Manager
          </Title>
          <Title level={4} style={{ margin: '8px 0 0 0', color: '#666', fontWeight: 400 }}>
            Welcome Back
          </Title>
          <Text type="secondary">
            Sign in to continue to your dashboard
          </Text>
        </div>
        
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              placeholder="Enter your email" 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password 
              placeholder="Enter your password"
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                height: '48px', 
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Sign In
            </Button>
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Don't have an account? </Text>
              <Link to="/signup" style={{ color: '#1890ff', fontWeight: 500 }}>
                Sign Up
              </Link>
            </div>
          </Form.Item>

          <div style={{ 
            textAlign: 'center', 
            padding: '16px', 
            background: '#f6f8fa', 
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Create an account to get started with task management
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 