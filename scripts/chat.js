const fs = require('fs');

class ChatView {
    constructor(groupName, channelName, serverUrl = "http://127.0.0.1:1237") {
        this.groupName = groupName;
        this.channelName = channelName;
        this.serverUrl = serverUrl;
        this.channelId = `${groupName}_${channelName}`;
        this.messageFile = 'chat_histories.json'; // Use chat_histories.json file
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

        this.init();
    }

    init() {
        this.updateChannelInfo();
        this.setupChatInput();
        this.loadMessages();
    }

    updateChannelInfo() {
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            chatInput.placeholder = `Send a message to ${this.groupName}`;
        }
    }

    loadMessages() {
        const messagesContainer = document.querySelector('.chat-messages');
        if (messagesContainer) {
            // Load chat history from the JSON file
            // const chatHistory = JSON.parse(fs.readFileSync(this.messageFile, 'utf-8')) || {};
            const chatHistory = JSON.parse(localStorage.getItem('user_chats'));
            const messages = chatHistory[this.groupName]?.messages || [];

            messages.forEach(({ type, text }) =>
                this.displayMessage(text, messagesContainer, type)
            );
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    setupChatInput() {
        const chatInput = document.querySelector('.chat-input');
        const messagesContainer = document.querySelector('.chat-messages');

        if (chatInput && messagesContainer) {
            chatInput.addEventListener('input', () => {
                const rows = chatInput.value.split('\n').length;
                chatInput.rows = Math.min(rows, 5);
            });

            chatInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
                    e.preventDefault();
                    const userMessage = e.target.value.trim();
                    e.target.value = ''; 

                    this.saveMessage({ type: 'user', text: userMessage });
                    this.displayMessage(userMessage, messagesContainer, 'user');

                    await this.sendMessageToServer(userMessage, messagesContainer);

                    chatInput.rows = 1; 
                    chatInput.focus(); 
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        }
    }

    async sendMessageToServer(message, messagesContainer) {
        try {
            const chatHistory = JSON.parse(fs.readFileSync(this.messageFile, 'utf-8')) || {};
            const history = chatHistory[this.groupName]?.messages || [];
            // console.log(history)
        
            // Set a timeout limit for the fetch request (e.g., 5 seconds)
            const timeout = 5000;
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request Timeout')), timeout)
            );
        
            // Send the fetch request and race it with the timeout
            const response = await Promise.race([
                fetch(`${this.serverUrl}/response/${this.userInfo.username}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: message, chat_id: this.groupName }),
                }),
                timeoutPromise,
            ]);
            console.log(history)
            if (!response.body) {
                console.error('No response body');
                return;
            }
        
            if (response.ok) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;
                let responseText = '';
        
                const messageDiv = this.createMessageElement(messagesContainer, 'server');
        
                while (!done) {
                    const { value, done: streamDone } = await reader.read();
                    done = streamDone;
                    const chunk = decoder.decode(value, { stream: true });
                    responseText += chunk;
        
                    const messageContent = messageDiv.querySelector('.message-content');
                    if (messageContent) {
                        messageContent.textContent = responseText;
                    }
        
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
        
                this.saveMessage({ type: 'server', text: responseText });
            } else {
                const error = await response.json();
                const errorMessage = `[${error.code}]: "${error.name}"`;
                this.displayMessage(errorMessage, messagesContainer, 'server');
                this.saveMessage({ type: 'server', text: errorMessage });
            }
        } catch (error) {
            console.error('Failed to fetch response from server:', error);
        
            // Handle timeout and other errors
            const errorMessage = `[Error]: "${error.message}"`;
            this.displayMessage(errorMessage, messagesContainer, 'server');
            this.saveMessage({ type: 'server', text: errorMessage });
        }
    }

    saveMessage(message) {
        // Read the current chat history from the JSON file
        let chatHistory = JSON.parse(fs.readFileSync(this.messageFile, 'utf-8')) || {};
    
        // If the chat doesn't exist, initialize it
        if (!chatHistory[this.groupName]) {
            chatHistory[this.groupName] = { createdAt: this.channelName, messages: [] };
        }
    
        // Add the new message to the chat history
        chatHistory[this.groupName].messages.push(message);
    
        // Keep only the last 10 messages
        chatHistory[this.groupName].messages = chatHistory[this.groupName].messages.slice(-10);
    
        // Save the updated chat history back to the JSON file
        fs.writeFileSync(this.messageFile, JSON.stringify(chatHistory, null, 2), 'utf-8');
    }

    displayMessage(message, container, type, messageDiv = null) {
        if (!messageDiv) {
            messageDiv = this.createMessageElement(container, type, message);
        } else {
            const messageContent = messageDiv.querySelector('.message-content');
            if (messageContent) {
                messageContent.textContent = message;
            }
        }
    }

    createMessageElement(container, type, message = '') {
        const messageDiv = document.createElement('div');
        const imgSrc = type === 'User' ? '../assets/avatar.png' : '../assets/hau.png';

        messageDiv.classList.add('message');
        messageDiv.innerHTML = `
            <img src="${imgSrc}" alt="${type} message" />
            <div class="message-content">${message}</div>
        `;
        container.appendChild(messageDiv);
        return messageDiv;
    }
}

module.exports = ChatView;
