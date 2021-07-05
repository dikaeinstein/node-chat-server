# node-chat-server [![Build Status](https://github.com/dikaeinstein/node-chat-server/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dikaeinstein/node-chat-server/actions)

A node chat server that allows participants to submit an HTML form to connect with their name and preferred locale, and sends messages to everyone connected via WebSockets.

## Requirements

- Node.js 12.x
- npm

## Getting Started

```sh
git clone https://github.com:dikaeinstein/node-chat-server.git # https
git clone git@github.com:dikaeinstein/node-chat-server.git # ssh

cd node-chat-server
cp .env.example .env

npm install
npm start or npm run dev
```

You should now be able to access the chat app via http://localhost:4900.

**NOTE:**

- You may need to modify the `.env` file configuration if the defaults are not suitable for your environment.
- Changes in the `.env` file are not automatically loaded. You have to start the app manually when you make an update to the `.env` file.

## Available Commands

The following commands can be used via `npm`:

- `build` - builds the application using `Typescript` and outputs the artifact into the `dist` directory.
- `lint` — lints the entire application via `eslint`
- `start` — runs the server via `node`
- `test` — runs all unit tests via `jest`
- `dev` — runs the server via `tsc-watch` (useful when developing locally)
