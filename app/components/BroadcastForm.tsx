"use client";

import { useState } from "react";
import { Card, Form, Select, Input, Upload, Button, Space, Radio, Alert, message as antdMessage } from "antd";
import {
  SendOutlined, PictureOutlined, VideoCameraOutlined, FileTextOutlined, UploadOutlined
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedBotId } from "@/store/actions/botActions";
import { sendBroadcastRequest } from "@/store/actions/broadcastActions";

const { TextArea } = Input;
const { Option } = Select;

type MessageType = "text" | "image" | "video";

export function BroadcastForm() {
  const dispatch = useAppDispatch();
  const { bots, selectedBotId } = useAppSelector((state) => state.bots);
  const { loading, result } = useAppSelector((state) => state.broadcast);
  const [messageType, setMessageType] = useState<MessageType>("text");
  const [message, setMessage] = useState("");
  const [chatIds, setChatIds] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");

  const handleMediaChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        
        // Support different JSON formats
        let chatIdArray: string[] = [];
        
        if (Array.isArray(jsonData)) {
          // Check if array contains objects with telegramId property
          if (jsonData.length > 0 && typeof jsonData[0] === 'object' && jsonData[0] !== null) {
            // Array of objects: [{ telegramId: "123" }, { telegramId: "456" }]
            chatIdArray = jsonData
              .map((item: any) => item.telegramId || item.chatId || item.id)
              .filter(Boolean)
              .map(id => String(id));
          } else {
            // Direct array: ["123", "456"] or [123, 456]
            chatIdArray = jsonData.map(id => String(id));
          }
        } else if (jsonData.chatIds && Array.isArray(jsonData.chatIds)) {
          // Object with chatIds property: { "chatIds": ["123", "456"] }
          chatIdArray = jsonData.chatIds.map((id: any) => String(id));
        } else {
          antdMessage.error("Invalid JSON format. Expected array of chat IDs or objects with 'telegramId' property.");
          return;
        }
        
        if (chatIdArray.length === 0) {
          antdMessage.warning("No chat IDs found in the JSON file.");
          return;
        }
        
        setChatIds(chatIdArray.join(", "));
        antdMessage.success(`Loaded ${chatIdArray.length} chat IDs from JSON file.`);
      } catch (error) {
        antdMessage.error("Failed to parse JSON file. Please check the file format.");
        console.error("JSON parse error:", error);
      }
    };
    reader.onerror = () => {
      antdMessage.error("Failed to read file.");
    };
    reader.readAsText(file);
    return false; // Prevent auto upload
  };

  const handleSend = () => {
    const chatIdArray = chatIds.split(",").map((id) => id.trim()).filter(Boolean);
    
    dispatch(sendBroadcastRequest({
      message,
      messageType,
      chatIds: chatIdArray,
      botId: selectedBotId,
      media: mediaFile || undefined,
    }));

    // Clear form
    setMessage("");
    setChatIds("");
    setMediaFile(null);
    setMediaPreview("");
  };

  const activeBots = bots.filter((bot) => bot.active);

  return (
    <Card title="Send Broadcast Message" bordered={false}>
      <Form layout="vertical">
        <Form.Item label="Select Bot" required>
          <Select
            placeholder="Choose a bot"
            value={selectedBotId}
            onChange={(botId) => dispatch(setSelectedBotId(botId))}
            size="large"
          >
            {activeBots.map((bot) => (
              <Option key={bot.id} value={bot.id}>
                {bot.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Message Type" required>
          <Radio.Group
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="text">
              <FileTextOutlined /> Text
            </Radio.Button>
            <Radio.Button value="image">
              <PictureOutlined /> Image
            </Radio.Button>
            <Radio.Button value="video">
              <VideoCameraOutlined /> Video
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {messageType !== "text" && (
          <Form.Item label={`Upload ${messageType === "image" ? "Image" : "Video"}`} required>
            <Upload
              beforeUpload={() => false}
              onChange={handleMediaChange}
              maxCount={1}
              listType="picture-card"
              accept={messageType === "image" ? "image/*" : "video/*"}
            >
              <div>
                {messageType === "image" ? <PictureOutlined /> : <VideoCameraOutlined />}
                <div style={{ marginTop: 8 }}>Upload {messageType === "image" ? "Image" : "Video"}</div>
              </div>
            </Upload>
            {mediaPreview && (
              <div style={{ marginTop: 16 }}>
                {messageType === "image" ? (
                  <img src={mediaPreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200 }} />
                ) : (
                  <video src={mediaPreview} controls style={{ maxWidth: "100%", maxHeight: 200 }} />
                )}
              </div>
            )}
          </Form.Item>
        )}

        <Form.Item label="Message" required>
          <TextArea
            rows={4}
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Chat IDs (comma-separated)" required>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload
              beforeUpload={handleJsonUpload}
              accept=".json"
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                Upload JSON File (Chat IDs)
              </Button>
            </Upload>
            <TextArea
              rows={3}
              placeholder="123456789, 987654321, ... (or upload JSON file)"
              value={chatIds}
              onChange={(e) => setChatIds(e.target.value)}
            />
          </Space>
        </Form.Item>

        {result && (
          <Alert
            message={result.success ? "Broadcast Sent Successfully!" : "Broadcast Failed"}
            description={result.message}
            type={result.success ? "success" : "error"}
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            disabled={
              !selectedBotId || 
              !message || 
              !chatIds || 
              (messageType !== "text" && !mediaFile)
            }
            block
          >
            Send Broadcast
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
