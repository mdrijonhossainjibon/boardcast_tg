"use client";

import { Avatar, Drawer, Layout, Menu, Space, Typography } from "antd";
import {
  DashboardOutlined, MessageOutlined, RobotOutlined, SettingOutlined
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title, Text } = Typography;

interface AppSidebarProps {
  activeMenu: string;
  onMenuChange: (key: string) => void;
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

const menuItems = [
  {
    key: 'broadcast',
    icon: <DashboardOutlined />,
    label: 'Broadcast',
  },
  {
    key: 'bots',
    icon: <RobotOutlined />,
    label: 'Bot List',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

const SidebarContent = ({ activeMenu, onMenuChange }: { activeMenu: string; onMenuChange: (key: string) => void }) => (
  <>
    <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Space>
        <Avatar size={40} style={{ backgroundColor: '#faad14' }} icon={<MessageOutlined />} />
        <div>
          <Title level={5} style={{ margin: 0, color: 'white' }}>TG Broadcast</Title>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Pro Panel</Text>
        </div>
      </Space>
    </div>
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[activeMenu]}
      items={menuItems}
      onClick={({ key }) => onMenuChange(key)}
      style={{ borderRight: 0 }}
    />
  </>
);

export function AppSidebar({ activeMenu, onMenuChange, mobileMenuOpen, onMobileMenuClose }: AppSidebarProps) {
  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={onMobileMenuClose}
        open={mobileMenuOpen}
        bodyStyle={{ padding: 0, backgroundColor: '#001529' }}
        width={256}
      >
        <SidebarContent activeMenu={activeMenu} onMenuChange={(key) => {
          onMenuChange(key);
          onMobileMenuClose();
        }} />
      </Drawer>

      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        width={256}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <SidebarContent activeMenu={activeMenu} onMenuChange={onMenuChange} />
      </Sider>
    </>
  );
}
