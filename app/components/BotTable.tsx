"use client";

import { useState } from "react";
import { Button, Input, Space, Switch, Table, Tag, Typography, Modal, Form } from "antd";
import {
  RobotOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, PlusOutlined
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createBotRequest,
  updateBotRequest,
  deleteBotRequest,
  toggleBotActiveRequest,
  setEditingBotId,
  updateBotLocal,
} from "@/store/actions/botActions";

const { Text } = Typography;

interface Bot {
  id: string;
  name: string;
  token: string;
  active: boolean;
}

export function BotTable() {
  const dispatch = useAppDispatch();
  const { bots, editingBotId, loading } = useAppSelector((state) => state.bots);
  const columns = [
    {
      title: 'Bot Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Bot) => (
        editingBotId === record.id ? (
          <Input
            value={record.name}
            onChange={(e) => dispatch(updateBotLocal({ ...record, name: e.target.value }))}
            placeholder="Bot Name"
          />
        ) : (
          <Space>
            <RobotOutlined style={{ color: '#faad14' }} />
            <Text strong>{text}</Text>
          </Space>
        )
      ),
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: (text: string, record: Bot) => (
        editingBotId === record.id ? (
          <Input.Password
            value={record.token}
            onChange={(e) => dispatch(updateBotLocal({ ...record, token: e.target.value }))}
            placeholder="Bot Token"
          />
        ) : (
          <Text code>{text ? `${text.substring(0, 20)}...` : 'No token set'}</Text>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Bot) => (
        <Space>
          {editingBotId === record.id ? (
            <Button type="primary" size="small" onClick={() => dispatch(updateBotRequest(record))}>
              Save
            </Button>
          ) : (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => dispatch(setEditingBotId(record.id))}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => dispatch(deleteBotRequest(record.id))}
              />
              <Switch
                checked={record.active}
                onChange={() => dispatch(toggleBotActiveRequest(record))}
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<CloseCircleOutlined />}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      dispatch(createBotRequest({ 
        name: values.name, 
        token: values.token, 
        active: values.active 
      }));
      form.resetFields();
      setIsModalOpen(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 18 }}>Bot Management</Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add New Bot
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={bots}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          <Space>
            <RobotOutlined style={{ color: '#faad14' }} />
            <span>Add New Bot</span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add Bot"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: "New Bot", token: "", active: false }}
        >
          <Form.Item
            label="Bot Name"
            name="name"
            rules={[{ required: true, message: 'Please enter bot name!' }]}
          >
            <Input placeholder="Enter bot name" size="large" />
          </Form.Item>

          <Form.Item
            label="Bot Token"
            name="token"
            rules={[
              { required: true, message: 'Please enter bot token!' },
              { min: 20, message: 'Token must be at least 20 characters!' }
            ]}
          >
            <Input.Password placeholder="Enter bot token from @BotFather" size="large" />
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="active"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
