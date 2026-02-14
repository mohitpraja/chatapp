# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start server:** `node app.js` (runs on `PORT` env var or defaults to 8000)
- **Start with auto-reload:** `npx nodemon app.js`
- **Install dependencies:** `npm install`

Note: `package.json` has `"main": "index.js"` and `"start": "node index.js"` but the actual entry point is `app.js`. No test or lint scripts are configured.

## Architecture

Real-time chat application using Express + Socket.IO with a vanilla JS frontend.

**Server (`app.js`):** Express HTTP server with Socket.IO attached. Serves static files from `public/`. Handles three socket events:
- `newuser` / `exituser` — broadcasts join/leave notifications to other clients via `update` event
- `chat` — broadcasts message objects `{username, text}` to other clients

**Client (`public/`):**
- `index.html` — two-screen SPA: join screen (username input) and chat screen (message list + input). Screens toggle via `.active` CSS class
- `code.js` — IIFE that manages Socket.IO client connection, screen transitions, message sending/receiving, and DOM rendering via `renderMessage(type, message)`
- `style.css` — all styling, mobile-friendly max-width 600px layout

Messages are not persisted; they exist only in connected clients' DOM. The server is a pure relay — no message storage, no user authentication, no rooms.
