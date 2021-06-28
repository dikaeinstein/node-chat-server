# node-chat-server

A node chat server that allows participants to submit an HTML form to connect with their name and preferred locale, and sends messages to everyone connected via WebSockets.

## Project Structure

- TODO

## Requirements

- Node.js 12.x
- npm
- Docker

## Getting Started

```sh
git clone https://github.com:dikaeinstein/node-chat-server.git # https
git clone git@github.com:dikaeinstein/node-chat-server.git # ssh

cd node-chat-server
cp .env.example .env

npm install
npm start or npm run dev
```

You should now be able to access the API via http://localhost:4900.

**NOTE:** You may need to modify the `.env` file configuration if the defaults in are not suitable for your environment.

## Available Commands

The following commands can be used via `npm`:

- `build` - builds the application using `Typescript` and outputs the artifact into the `dist` directory.
- `lint` — lints the entire application via `eslint`
- `start` — runs the API via `node`
- `test` — runs all unit tests via `jest`
- `dev` — runs the API via `tsc-watch` (useful when developing locally)

## Developing Locally

### Using tsc-watch

```sh
npm run dev
```

This command will run `tsc-watch` to start the application and automatically restart it when code changes are detected.
