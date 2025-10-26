"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Layout, Typography, Card } from "antd";
import { AuthGuard } from "./components/AuthGuard";
import { AppHeader } from "./components/AppHeader";
import { AppSidebar } from "./components/AppSidebar";
import { BroadcastForm } from "./components/BroadcastForm";
import { BotTable } from "./components/BotTable";
import { useAppDispatch } from "@/store/hooks";
import { fetchBotsRequest } from "@/store/actions/botActions";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  
  // Local UI state
  const [activeMenu, setActiveMenu] = useState<"broadcast" | "bots" | "settings">("broadcast");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch bots on mount
  useEffect(() => {
    dispatch(fetchBotsRequest());
  }, [dispatch]);

  return (
    <AuthGuard>
      <Layout style={{ minHeight: '100vh' }}>
        <AppSidebar
          activeMenu={activeMenu}
          onMenuChange={(key) => setActiveMenu(key as any)}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuClose={() => setMobileMenuOpen(false)}
        />

        <Layout style={{ marginLeft: 256 }}>
          <AppHeader
            userName={session?.user?.name}
            userEmail={session?.user?.email}
            onMenuToggle={() => setMobileMenuOpen(true)}
          />

          <Content style={{ margin: '24px', padding: 24, background: '#f0f2f5', minHeight: 280 }}>
            {activeMenu === "broadcast" && <BroadcastForm />}

            {activeMenu === "bots" && <BotTable />}

            {activeMenu === "settings" && (
              <Card title="Setup Instructions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Title level={5}>1. Create a Telegram Bot</Title>
                    <Paragraph>
                      Message @BotFather on Telegram and use the /newbot command to create your bot.
                    </Paragraph>
                  </div>
                  <div>
                    <Title level={5}>2. Add Bot Token</Title>
                    <Paragraph>
                      Copy the bot token from BotFather and add it in the Bot List section.
                    </Paragraph>
                  </div>
                  <div>
                    <Title level={5}>3. Get Chat IDs</Title>
                    <Paragraph>
                      Message your bot and visit https://api.telegram.org/bot[YOUR_TOKEN]/getUpdates to see chat IDs.
                    </Paragraph>
                  </div>
                  <div>
                    <Title level={5}>4. Start Broadcasting</Title>
                    <Paragraph>
                      Go to the Broadcast section and send messages to multiple chats at once!
                    </Paragraph>
                  </div>
                </div>
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>

      <style jsx global>{`
        @media (max-width: 992px) {
          .ant-layout-sider {
            display: none !important;
          }
          .ant-layout {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </AuthGuard>
  );
}
