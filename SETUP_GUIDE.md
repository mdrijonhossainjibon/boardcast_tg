# Setup Guide - Telegram Broadcast with Authentication

## Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Environment Configuration

Create `.env.local` file:
```env
# Telegram Bot Token (from @BotFather)
TELEGRAM_BOT_TOKEN=your_bot_token_here

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_secret_here

# App URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
yarn dev
```

Visit: http://localhost:3000

## Demo Login Credentials

- **Email:** admin@example.com
- **Password:** password123

## Features Implemented

✅ **NextAuth.js v5** - Secure authentication  
✅ **Binance-Style Login** - Professional split-screen design  
✅ **Mobile Responsive** - Works on all devices  
✅ **Protected Routes** - Client-side auth guard  
✅ **Session Management** - Persistent login state  
✅ **Telegram Integration** - Broadcast messaging  
✅ **Tailwind CSS 4** - Modern styling  
✅ **Dark Mode** - Automatic theme support  

## Architecture

### Authentication Flow
1. User visits app → Redirected to `/login` if not authenticated
2. Login with credentials → NextAuth validates
3. Session created → User redirected to dashboard
4. `AuthGuard` component protects pages client-side
5. Logout → Session cleared, redirect to login

### File Structure
```
d:\boardcast\
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth API handler
│   │   └── broadcast/route.ts            # Telegram broadcast API
│   ├── components/
│   │   └── AuthGuard.tsx                 # Client-side route protection
│   ├── login/
│   │   └── page.tsx                      # Binance-style login page
│   ├── layout.tsx                        # Root layout with SessionProvider
│   ├── page.tsx                          # Protected dashboard
│   ├── providers.tsx                     # NextAuth SessionProvider wrapper
│   └── globals.css                       # Tailwind CSS 4 imports
├── auth.ts                               # NextAuth configuration
├── middleware.ts                         # Simplified middleware
└── .env.local                            # Environment variables
```

## Troubleshooting

### Edge Runtime Error
Fixed by using simplified middleware without NextAuth edge runtime integration. Authentication is handled client-side via `AuthGuard` component.

### TypeScript Errors
Run `yarn install` to ensure all dependencies are installed. The app uses:
- next-auth@^5.0.0-beta.25
- bcryptjs for password hashing
- @tailwindcss/postcss for Tailwind CSS 4

### Login Issues
1. Verify `.env.local` has `NEXTAUTH_SECRET` set
2. Check demo credentials are correct
3. Clear browser cookies and try again

## Production Deployment

Before deploying:
1. Replace demo users in `auth.ts` with database integration
2. Use secure password hashing (bcrypt already implemented)
3. Set production `NEXTAUTH_URL` in environment
4. Add proper error logging
5. Implement rate limiting on auth endpoints

## Next Steps

- [ ] Add database for user management
- [ ] Implement user registration
- [ ] Add email verification
- [ ] Implement 2FA
- [ ] Add password reset functionality
- [ ] Create admin panel for user management
