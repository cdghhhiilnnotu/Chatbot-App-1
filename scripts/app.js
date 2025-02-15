const { userInfo } = require('os');
const ChatView = require('../scripts/chat.js');
const SettingView = require('../scripts/settings.js');
const fs = require('fs');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function convertDateFormat(dateString) {
    // Tách phần ngày và giờ
    const [datePart] = dateString.split(" ");  // Lấy phần "YYYY/MM/DD"
    
    // Tách các thành phần ngày tháng năm
    const [year, month, day] = datePart.split("-");  

    // Định dạng lại thành "DD/MM/YYYY"
    return `${day}-${month}-${year}`;
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

class App {
    constructor(){
        this.name = JSON.parse(localStorage.getItem('user_infor')).username
        this.history_file = `${this.name}.json`;
        this.init();
    }

    reset(){
        let chat_history = {};
        // Load chat history
        chat_history = JSON.parse(localStorage.getItem('user_chats'));
        print(chat_history)
        // Create chat elements based on chat history
        Object.keys(chat_history).forEach(group_name => {
            const existing_chat = document.createElement('div');
            existing_chat.classList.add('chat');
            existing_chat.textContent = group_name.slice(0, 2).toUpperCase();
    
            existing_chat.addEventListener('click', () => {
                setting_btn.classList.remove('active');
                
                // Remove active class from all chats
                document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
                
                // Add active class to clicked chat
                existing_chat.classList.add('active');
    
        
                // const chat_view = document.getElementById('chat-view');
                // const setting_view = document.getElementById('setting-view');
    
                default_view.style.display = 'none';
                setting_view.style.display = 'none';
                chat_view.style.display = 'block';
    
                chat_view.innerHTML = `
                    <div class="chat-header">
                        <div class="header-info">
                            <h2>Phòng Đào tạo</h2>
                            <div class="header-time">.${convertDateFormat(chat_history[group_name].createdAt)}.</div>
                        </div>
                        <div class="header-actions">
                            <div class="exit-chat">
                                <img src="../assets/light/exit.svg" alt="Exit Chat" />
                            </div>
                        </div>
                    </div>
                    <div class="chat-area"></div>
                `;
    
                const chat_area = chat_view.querySelector('.chat-area');
                const channel_name = getCurrentDateTime();
    
                fetch('../views/chat.html')
                    .then(response => response.text())
                    .then(html => {
                        chat_area.innerHTML = html;
                        new ChatView(group_name, channel_name);
                    })
                    .catch(error => console.error('Error:', error));
    
                chat_view.querySelector('.exit-chat').addEventListener('click', () => {
                    existing_chat.classList.remove('active');
                    chat_view.style.display = 'none';
                    default_view.style.display = 'block';
                });
            });
    
            chat_container.insertBefore(existing_chat, chat_container.firstChild);
        });
    }

    init(){
        this.setup();
    }

    setup(){
        let chat_history = {};
        // Load chat history
        chat_history = JSON.parse(localStorage.getItem('user_chats'));
        // Create chat elements based on chat history
        Object.keys(chat_history).forEach(group_name => {
            const existing_chat = document.createElement('div');
            existing_chat.classList.add('chat');
            existing_chat.textContent = group_name.slice(0, 2).toUpperCase();
    
            existing_chat.addEventListener('click', () => {
                setting_btn.classList.remove('active');
                
                // Remove active class from all chats
                document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
                
                // Add active class to clicked chat
                existing_chat.classList.add('active');
    
        
                // const chat_view = document.getElementById('chat-view');
                // const setting_view = document.getElementById('setting-view');
    
                default_view.style.display = 'none';
                setting_view.style.display = 'none';
                chat_view.style.display = 'block';
    
                chat_view.innerHTML = `
                    <div class="chat-header">
                        <div class="header-info">
                            <h2>Phòng Đào tạo</h2>
                            <div class="header-time">.${convertDateFormat(chat_history[group_name].createdAt)}.</div>
                        </div>
                        <div class="header-actions">
                            <div class="exit-chat">
                                <img src="../assets/light/exit.svg" alt="Exit Chat" />
                            </div>
                        </div>
                    </div>
                    <div class="chat-area"></div>
                `;
    
                const chat_area = chat_view.querySelector('.chat-area');
                const channel_name = getCurrentDateTime();
    
                fetch('../views/chat.html')
                    .then(response => response.text())
                    .then(html => {
                        chat_area.innerHTML = html;
                        new ChatView(group_name, channel_name);
                    })
                    .catch(error => console.error('Error:', error));
    
                chat_view.querySelector('.exit-chat').addEventListener('click', () => {
                    existing_chat.classList.remove('active');
                    chat_view.style.display = 'none';
                    default_view.style.display = 'block';
                });
            });
    
            chat_container.insertBefore(existing_chat, chat_container.firstChild);
        });
    
        // Handle create new chat
        const create_chat = document.getElementById('create-chat');
        if (create_chat) {
            create_chat.addEventListener('click', () => {
                setting_btn.classList.remove('active');
                const chat_name = generateRandomString(10);
            
                if (chat_name.trim() !== '') {
                    const new_chat = document.createElement('div');
                    new_chat.classList.add('chat');
                    new_chat.textContent = chat_name.slice(0, 2).toUpperCase();
            
                    new_chat.addEventListener('click', () => {
                        setting_btn.classList.remove('active');
                        document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
                        new_chat.classList.add('active');
            
                        default_view.style.display = 'none';
                        setting_view.style.display = 'none';
                        chat_view.style.display = 'block';
                        
                        const channel_name = getCurrentDateTime();
                        chat_view.innerHTML = `
                            <div class="chat-header">
                                <div class="header-info">
                                    <h2>Phòng Đào tạo</h2>
                                    <div class="header-time">${convertDateFormat(channel_name)}</div>
                                </div>
                                <div class="header-actions">
                                    <div class="exit-chat">
                                        <img src="../assets/light/exit.svg" alt="Exit Chat" />
                                    </div>
                                </div>
                            </div>
                            <div class="chat-area"></div>
                        `;
            
                        const chat_area = chat_view.querySelector('.chat-area');
            
                        fetch('../views/chat.html')
                            .then(response => response.text())
                            .then(html => {
                                chat_area.innerHTML = html;
                                new ChatView(chat_name, channel_name);
                            })
                            .catch(error => console.error('Error:', error));
            
                        chat_view.querySelector('.exit-chat').addEventListener('click', () => {
                            new_chat.classList.remove('active');
                            chat_view.style.display = 'none';
                            default_view.style.display = 'block';
                        });
                    });
            
                    // Insert the new chat at the top of the chat_container
                    chat_container.insertBefore(new_chat, chat_container.firstChild);
            
                    // Add the new chat to the history with the specified structure
                    const newChatData = {
                        createdAt: getCurrentDateTime(),
                        messages: []
                    };
                    
                    // If chat_history is not yet initialized, initialize it as an empty object
                    if (typeof chat_history !== 'object') {
                        chat_history = {};
                    }
            
                    // Add the new chat to the history object using the chat_name as the key
                    chat_history[chat_name] = newChatData;
                    // Save the updated history to the file
                    // fs.writeFileSync(this.history_file, JSON.stringify(chat_history, null, 2), 'utf-8');
                }
            });
            
        }
    
        if (setting_btn) {
            setting_btn.addEventListener('click', () => {
                setting_btn.classList.add('active');
                document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
                document.getElementById('chat-view').style.display = 'none';
    
                // const chat_view = document.getElementById('chat-view');
                // const setting_view = document.getElementById('setting-view');
    
                default_view.style.display = 'none';
                setting_view.style.display = 'block';
                chat_view.style.display = 'none';
    
                setting_view.innerHTML = `
                    <div class="setting-area"></div>
                `;
    
                const settingArea = setting_view.querySelector('.setting-area');
                const channel_name = getCurrentDateTime();
    
                fetch('../views/settings.html')
                .then(response => response.text())
                .then(html => {
                    settingArea.innerHTML = html;
    
                    // Dynamically load settings.css
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '../styles/settings.css';
                    document.head.appendChild(link);
    
                    const setting_viewer = new SettingView(document.getElementById("setting-img"));
                    const exit_setting_btn = setting_viewer.get_exit_btn()
    
                    exit_setting_btn.addEventListener('click', () => {
                        setting_view.style.display = 'none';
                        default_view.style.display = 'block';
                        setting_btn.classList.remove('active');
                    });
                })
                .catch(error => console.error('Error:', error));
            });
        }
    }
}

module.exports = App;