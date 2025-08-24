# 🦝 Raccord – A Discord Clone

**Raccord** is full-stack Discord-like chat application built with **TypeScript**.  
It supports peer-to-peer messaging, group servers, role-based authentication, and persistent message history.

---

## 🚀 Features
- Real-time communication using **WebSockets / Socket.io**
- **Peer-to-Peer** connections with WebRTC
- **Authentication & Authorization** with JWT-secured cookies
- **Role-based access control**
- Persistent **chat history stored in database**
- **Direct Messages** and **Server-based channels**

---

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, SCSS  
- **Backend:** NestJS, TypeScript  
- **Real-time:** Socket.io, WebRTC  
- **Database:** PostgreSQL  

---

## 📦 Installation

### 1. Clone the repository
```sh
git clone https://github.com/ValentinKoruev/raccord.git
cd raccord
```
### 2. Install dependencies
```sh
# Run this both in the /client and /server

# with npm
npm install

# with yarn
yarn install

# with pnpm
pnpm install
```
### 3. Environment variables
Create `.env` files in both the client and the server with the provided `.env.example` files
### 4. Migrate & seed database
```sh
# /server

npx prisma migrate deploy && npx prisma db seed
```
### 5. Sync shared files
```sh
# /shared

node sync.js
```
### 6. Start the application
```sh
# /client and /server

# with npm
npm run dev

# with yarn
yarn dev

# with pnpm
pnpm dev
```
### 7. Extra
You can use the provided test users to test the application

- Dbeliq/test123
- Sir Raccford IV/test123


## 📌 Roadmap

- ✅ Frontend UI for guilds, direct messages, chat
- ✅ User registration and login with JWT authentication
- ✅ Real-time direct messaging fully functional  
- ✅ Storing messages in database for persistence  
- ✅ Guild channels with dynamic creation and management
- ✅ Notifications system
- ✅ Unit and integration tests for client
- 🛠️ Unit and integration tests for server
- 🛠️ Role-based access control
- ⏳ Direct Messages add and remove channels
- ⏳ Group DMs
- ⏳ Online/offline presence of users
- ⏳ Advanced message options (edit/unsend/reply/forward/etc...)
- ⏳ Message search (by keyword, user, date)
- ⏳ Moderation tools (ban, kick, mute, report system)
- ⏳ File sharing
- ⏳ File previews (images, PDFs, videos)
- ⏳ Voice channels with WebRTC
---
