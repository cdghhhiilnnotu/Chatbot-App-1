const fs = require('fs');
const {server_url, speech_url} = require('../scripts/utils.js');

class ChatView {
    constructor(group_name, channel_name, message_file = 'chat_histories.json', serverurl = `${server_url}`, speechurl = `${speech_url}`) {
        this.group_name = group_name;
        this.channel_name = channel_name;
        this.server = serverurl;
        this.speech = speechurl;
        this.message_file = message_file;
        this.user_infor = JSON.parse(localStorage.getItem('user_infor'));

        this.chat_input = document.querySelector('.chat-input');
        this.messages_container = document.querySelector('.chat-messages');

        this.mic_input = document.querySelector('.mic-input');
        // this.file_input = document.querySelector('.file-input');
        this.mic_img = document.getElementById('mic-img');
        
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.ws = null;

        this.init();
    }

    init() {
        this.updateChannelInfo();
        this.setupChatInput();
        this.loadMessages();
        this.initializeWebSocket();
    }

    initializeWebSocket() {
        this.ws = new WebSocket(`${this.speech}/${this.user_infor.username}`);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };

        this.ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === 'success' && response.text) {
                // Add the transcribed text to the chat input
                this.chat_input.value += response.text + ' ';
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket Connection Closed');
            setTimeout(() => this.initializeWebSocket(), 3000);
        };
    }

    async startRecording() {
        try {
            this.audioChunks = [];
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            const options = { mimeType: 'audio/webm; codecs=opus' };
            this.mediaRecorder = new MediaRecorder(stream, options);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                    if (this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(event.data);
                    }
                }
            };

            this.mediaRecorder.start(250);
            this.mic_img.src = "../assets/dark/unmic.svg";
            this.mic_input.classList.add('active');
            this.chat_input.placeholder = `Đang nghe...`;

        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.mediaRecorder.onstop = () => {
                this.mic_img.src = "../assets/dark/mic.svg";
                this.mic_input.classList.remove('active');
                this.chat_input.placeholder = `Gửi tin nhắn đến phòng chat ID: ${this.group_name}`;
                this.mediaRecorder.stream.getTracks().forEach(track => track.stop());

                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ command: "start_recognition" }));
                }
            };
        }
    }

    setupChatInput() {
        if (this.chat_input && this.messages_container) {
            this.chat_input.addEventListener('input', () => {
                const rows = this.chat_input.value.split('\n').length;
                this.chat_input.rows = Math.min(rows, 5);
            });
            
            // this.file_input.addEventListener('click', () => {
            //     this.file_input.classList.add('active');
            //     this.mic_input.classList.remove('active');
            //     if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            //         this.stopRecording();
            //     }
            // });
            
            this.mic_input.addEventListener('click', () => {
                if (!this.mic_input.classList.contains('active')) {
                    this.startRecording();
                    // this.file_input.classList.remove('active');
                } else {
                    this.stopRecording();
                }
            });

            this.chat_input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
                    e.preventDefault();
                    const userMessage = e.target.value.trim();
                    e.target.value = ''; 

                    this.saveMessage({ type: 'User', text: userMessage });
                    this.displayMessage(userMessage, this.messages_container, 'User');

                    await this.sendMessageToServer(userMessage);

                    this.chat_input.rows = 1; 
                    this.chat_input.focus(); 
                    this.messages_container.scrollTop = this.messages_container.scrollHeight;
                }
            });
        }
    }

    updateChannelInfo() {
        if (this.chat_input) {
            this.chat_input.placeholder = `Gửi tin nhắn đến phòng chat ID: ${this.group_name}`;
        }
    }

    loadMessages() {
        if (this.messages_container) {
            const chat_history = JSON.parse(localStorage.getItem('user_chats'));
            const messages = chat_history[this.group_name]?.messages || [];

            messages.forEach(({ type, text }) =>
                this.displayMessage(text, this.messages_container, type)
            );
            this.messages_container.scrollTop = this.messages_container.scrollHeight;
        }
    }

    async sendMessageToServer(message) {
        try {
            // Set a timeout limit for the fetch request (e.g., 5 seconds)
            const timeout = 5000;
            const timeout_promise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request Timeout')), timeout)
            );
        
            // Send the fetch request and race it with the timeout
            const response = await Promise.race([
                fetch(`${this.server}/response/${this.user_infor.username}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: message, chat_id: this.group_name }),
                }),
                timeout_promise,
            ]);

            if (!response.body) {
                console.error('No response body');
                return;
            }
        
            if (response.ok) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;
                let response_text = '';
        
                const message_div = this.createMessageElement(this.messages_container, 'AIMAGE');
        
                while (!done) {
                    const { value, done: streamDone } = await reader.read();
                    done = streamDone;
                    const chunk = decoder.decode(value, { stream: true });
                    response_text += chunk;
        
                    const message_content = message_div.querySelector('.message-content');
                    if (message_content) {
                        message_content.textContent = response_text;
                    }
        
                    this.messages_container.scrollTop = this.messages_container.scrollHeight;
                }
        
                this.saveMessage({ type: 'AIMAGE', text: response_text });
            } else {
                const error = await response.json();
                const error_message = `[${error.code}]: "${error.name}"`;
                this.displayMessage(error_message, this.messages_container, 'AIMAGE');
                this.saveMessage({ type: 'AIMAGE', text: error_message });
            }
        } catch (error) {
            console.error('Failed to fetch response from server:', error);
        
            // Handle timeout and other errors
            const error_message = `[Error]: "${error.message}"`;
            this.displayMessage(error_message, this.messages_container, 'AIMAGE');
            this.saveMessage({ type: 'AIMAGE', text: error_message });
        }
    }

    saveMessage(message) {
        let chat_history = JSON.parse(localStorage.getItem('user_chats'));
    
        // If the chat doesn't exist, initialize it
        if (!chat_history[this.group_name]) {
            chat_history[this.group_name] = { createdAt: this.channel_name, messages: [] };
        }
    
        // Add the new message to the chat history
        chat_history[this.group_name].messages.push(message);
    
        // Keep only the last 10 messages
        chat_history[this.group_name].messages = chat_history[this.group_name].messages.slice(-10);
    
        // Save the updated chat history back to the JSON file
        localStorage.setItem('user_chats', JSON.stringify(chat_history));
        fs.writeFileSync(this.message_file, JSON.stringify(chat_history, null, 2), 'utf-8');
    }

    displayMessage(message, container, type, message_div = null) {
        if (!message_div) {
            message_div = this.createMessageElement(container, type, message);
        } else {
            const message_content = message_div.querySelector('.message-content');
            if (message_content) {
                message_content.textContent = message;
            }
        }
    }

    createMessageElement(container, type, message = '') {
        const message_div = document.createElement('div');
        let img_src;
        if(localStorage.getItem('avatar_src')){
            img_src = type === 'User' ? localStorage.getItem('avatar_src') : '../assets/hau.png';
        }
        else{
            img_src = type === 'User' ? '../assets/avatar.png' : '../assets/hau.png';

        }

        message_div.classList.add('message');
        message_div.innerHTML = `
            <img src="${img_src}" alt="${type} message" />
            <div class="message-content">${message}</div>
        `;
        container.appendChild(message_div);
        return message_div;
    }
}

module.exports = ChatView;
