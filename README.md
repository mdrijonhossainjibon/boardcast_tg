# Telegram Broadcast App

A modern Next.js 15+ application with Tailwind CSS 4 for sending broadcast messages via Telegram.

## Features

- 🚀 **Next.js 15+** - Latest Next.js with App Router
- 🎨 **Tailwind CSS 4** - Modern utility-first CSS framework
- 🔐 **NextAuth.js** - Secure authentication with Binance-style login
- 📱 **Telegram Integration** - Send broadcast messages to multiple chats
- 🌙 **Dark Mode** - Automatic dark mode support
- ⚡ **TypeScript** - Full type safety
- 📱 **Mobile Responsive** - Optimized for all devices
- 🎯 **Modern UI** - Beautiful, responsive interface with Lucide icons

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the instructions
3. Copy your bot token

### 3. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### 4. Get Chat IDs

To send messages, you need the chat IDs of your recipients:

1. Add your bot to a chat or send it a message
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for the `chat.id` field in the response
4. Use these IDs in the broadcast form (comma-separated)

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials

Use these demo credentials to sign in:
- **Email:** admin@example.com
- **Password:** password123

## Production

Build for production:

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/broadcast

Send a broadcast message to multiple Telegram chats.

**Request Body:**
```json
{
  "message": "Your broadcast message",
  "chatIds": ["123456789", "987654321"]
}
```

**Response:**
```json
{
  "message": "Broadcast sent! Success: 2, Failed: 0",
  "successful": 2,
  "failed": 0
}
```

## Tech Stack

- **Framework:** Next.js 15+
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js v5
- **Telegram:** Telegraf
- **Icons:** Lucide React
- **Password Hashing:** bcryptjs

## License

MIT
