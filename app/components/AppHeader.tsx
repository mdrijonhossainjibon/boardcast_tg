"use client";

import { Avatar, Button, Dropdown, Layout, Space, Typography } from "antd";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";

const { Header } = Layout;
const { Text } = Typography;

interface AppHeaderProps {
  userName?: string | null;
  userEmail?: string | null;
  onMenuToggle: () => void;
}

export function AppHeader({ userName, userEmail, onMenuToggle }: AppHeaderProps) {
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={onMenuToggle}
        style={{ fontSize: '18px' }}
        className="mobile-menu-btn"
      />
      
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text strong>{userName || 'User'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{userEmail}</Text>
          </div>
        </Space>
      </Dropdown>
    </Header>
  );
}
