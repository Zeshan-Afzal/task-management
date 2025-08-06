import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authAPI } from '../services/api';

const { Title, Text } = Typography;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the real signup API
      const response = await authAPI.signup({
        name: values.name,
        email: values.email,
        password: values.password
      });

      if (response.data) {
        message.success('Account created successfully! Please sign in.');
        navigate('/dashboard');
      } else {
        message.error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
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
        maxWidth: 450, 
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
            background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
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
            Create Account
          </Title>
          <Text type="secondary">
            Join us and start managing your tasks efficiently
          </Text>
        </div>
        
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input 
              placeholder="Enter your full name" 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              placeholder="Enter your email" 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              placeholder="Create a password"
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm your password"
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ height: '48px', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
              },
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <Link to="/terms" style={{ color: '#1890ff' }}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: '#1890ff' }}>
                Privacy Policy
              </Link>
            </Checkbox>
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
              Create Account
            </Button>
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Already have an account? </Text>
              <Link to="/login" style={{ color: '#1890ff', fontWeight: 500 }}>
                Sign In
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
              By creating an account, you agree to our terms and privacy policy
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignupPage;
