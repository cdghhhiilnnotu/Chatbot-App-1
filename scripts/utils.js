// const base = 'http://127.0.0.1:1237';
const base = 'https://54f5-34-105-108-239.ngrok-free.app';

const server_url = base; // Directly use base URL

// Convert HTTP to WebSocket (WS/WSS)
const speech_url = base.replace(/^http/, "ws") + "/ws/audio";

module.exports = { server_url, speech_url };