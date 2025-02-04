console.log('app.js đã được tải thành công!');
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

// document.addEventListener('DOMContentLoaded', () => {
//     const chatContainer = document.querySelector('.chat-container');
//     const add_img = document.getElementById('add-img');
            
//     const chatHistoryFile = 'chat_histories.json';
//     let chatHistory = {};

//     // Load chat history from file
//     if (fs.existsSync(chatHistoryFile)) {
//         chatHistory = JSON.parse(fs.readFileSync(chatHistoryFile, 'utf-8'));
//     }

//     // Create chat elements based on chat history
//     Object.keys(chatHistory).forEach(groupName => {
//         const existingChat = document.createElement('div');
//         existingChat.classList.add('chat');
//         existingChat.textContent = groupName.slice(0, 2).toUpperCase();

//         existingChat.addEventListener('click', () => {
//             const setting_btn = document.getElementById('setting-button');
//             setting_btn.classList.remove('active');
            
//             // Remove active class from all chats
//             document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
            
//             // Add active class to clicked chat
//             existingChat.classList.add('active');

//             const defaultView = document.getElementById('default-view');
//             const chatView = document.getElementById('chat-view');
//             const settingView = document.getElementById('setting-view');

//             defaultView.style.display = 'none';
//             settingView.style.display = 'none';
//             chatView.style.display = 'block';

//             chatView.innerHTML = `
//                 <div class="chat-header">
//                     <div class="header-info">
//                         <h2>Phòng Đào tạo</h2>
//                     </div>
//                     <div class="header-actions">
//                         <div class="exit-chat">
//                             <img src="../assets/light/exit.svg" alt="Exit Chat" />
//                         </div>
//                     </div>
//                 </div>
//                 <div class="chat-area"></div>
//             `;

//             const chatArea = chatView.querySelector('.chat-area');
//             const channelName = getCurrentDateTime();

//             fetch('../views/chat.html')
//                 .then(response => response.text())
//                 .then(html => {
//                     chatArea.innerHTML = html;
//                     new ChatView(groupName, channelName);
//                 })
//                 .catch(error => console.error('Error:', error));

//             chatView.querySelector('.exit-chat').addEventListener('click', () => {
//                 existingChat.classList.remove('active');
//                 chatView.style.display = 'none';
//                 defaultView.style.display = 'block';
//             });
//         });

//         chatContainer.appendChild(existingChat);
//     });

//     // Handle create new chat
//     const create_chat = document.getElementById('create-chat');
//     if (create_chat) {
//         create_chat.addEventListener('click', () => {
//             const setting_btn = document.getElementById('setting-button');
//             setting_btn.classList.remove('active');
//             const chat_name = generateRandomString(10);
        
//             if (chat_name.trim() !== '') {
//                 const new_chat = document.createElement('div');
//                 new_chat.classList.add('chat');
//                 new_chat.textContent = chat_name.slice(0, 2).toUpperCase();
        
//                 new_chat.addEventListener('click', () => {
//                     setting_btn.classList.remove('active');
//                     document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
//                     new_chat.classList.add('active');
        
//                     const defaultView = document.getElementById('default-view');
//                     const chatView = document.getElementById('chat-view');
//                     const settingView = document.getElementById('setting-view');
        
//                     defaultView.style.display = 'none';
//                     settingView.style.display = 'none';
//                     chatView.style.display = 'block';
        
//                     chatView.innerHTML = `
//                         <div class="chat-header">
//                             <div class="header-info">
//                                 <h2>Phòng Đào tạo</h2>
//                             </div>
//                             <div class="header-actions">
//                                 <div class="exit-chat">
//                                     <img src="../assets/light/exit.svg" alt="Exit Chat" />
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="chat-area"></div>
//                     `;
        
//                     const chatArea = chatView.querySelector('.chat-area');
//                     const channelName = getCurrentDateTime();
        
//                     fetch('../views/chat.html')
//                         .then(response => response.text())
//                         .then(html => {
//                             chatArea.innerHTML = html;
//                             new ChatView(chat_name, channelName);
//                         })
//                         .catch(error => console.error('Error:', error));
        
//                     chatView.querySelector('.exit-chat').addEventListener('click', () => {
//                         new_chat.classList.remove('active');
//                         chatView.style.display = 'none';
//                         defaultView.style.display = 'block';
//                     });
//                 });
        
//                 // Insert the new chat at the top of the chatContainer
//                 chatContainer.insertBefore(new_chat, chatContainer.firstChild);
        
//                 // Add the new chat to the history with the specified structure
//                 const newChatData = {
//                     createdAt: getCurrentDateTime(),
//                     messages: []
//                 };
                
//                 // If chatHistory is not yet initialized, initialize it as an empty object
//                 if (typeof chatHistory !== 'object') {
//                     chatHistory = {};
//                 }
        
//                 // Add the new chat to the history object using the chat_name as the key
//                 chatHistory[chat_name] = newChatData;
        
//                 // Save the updated history to the file
//                 fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory, null, 2), 'utf-8');
//             }
//         });
        
//     }

//     const setting_btn = document.getElementById('setting-button');
//     if (setting_btn) {
//         setting_btn.addEventListener('click', () => {
//             setting_btn.classList.add('active');
//             document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
//             document.getElementById('chat-view').style.display = 'none';

//             const defaultView = document.getElementById('default-view');
//             const chatView = document.getElementById('chat-view');
//             const settingView = document.getElementById('setting-view');

//             defaultView.style.display = 'none';
//             settingView.style.display = 'block';
//             chatView.style.display = 'none';

//             settingView.innerHTML = `
//                 <div class="setting-area"></div>
//             `;

//             const settingArea = settingView.querySelector('.setting-area');
//             const channelName = getCurrentDateTime();

//             fetch('../views/settings.html')
//             .then(response => response.text())
//             .then(html => {
//                 settingArea.innerHTML = html;

//                 // Dynamically load settings.css
//                 const link = document.createElement('link');
//                 link.rel = 'stylesheet';
//                 link.href = '../styles/settings.css';
//                 document.head.appendChild(link);

//                 const setting_view = new SettingView(document.getElementById("setting-img"));
//                 const exit_setting_btn = setting_view.get_exit_btn()

//                 exit_setting_btn.addEventListener('click', () => {
//                     settingView.style.display = 'none';
//                     defaultView.style.display = 'block';
//                     setting_btn.classList.remove('active');
//                 });
//             })
//             .catch(error => console.error('Error:', error));

//             // settingView.querySelector('.exit-chat').addEventListener('click', () => {
//             //     new_chat.classList.remove('active');
//             //     settingView.style.display = 'none';
//             //     defaultView.style.display = 'block';
//             // });
//         });
//     }
// });

class App {
    constructor(){
        this.init();
    }

    init(){
        this.setup();
    }

    setup(){
        const chatContainer = document.querySelector('.chat-container');
        const add_img = document.getElementById('add-img');
                
        const chatHistoryFile = 'chat_histories.json';
        let chatHistory = {};
    
        // Load chat history from file
        // if (fs.existsSync(chatHistoryFile)) {
        //     chatHistory = JSON.parse(fs.readFileSync(chatHistoryFile, 'utf-8'));
        // }
        chatHistory = JSON.parse(localStorage.getItem('user_chats'));
        console.log(chatHistory)
        // Create chat elements based on chat history
        Object.keys(chatHistory).forEach(groupName => {
            const existingChat = document.createElement('div');
            existingChat.classList.add('chat');
            existingChat.textContent = groupName.slice(0, 2).toUpperCase();
    
            existingChat.addEventListener('click', () => {
                const setting_btn = document.getElementById('setting-button');
                setting_btn.classList.remove('active');
                
                // Remove active class from all chats
                document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
                
                // Add active class to clicked chat
                existingChat.classList.add('active');
    
                const defaultView = document.getElementById('default-view');
                const chatView = document.getElementById('chat-view');
                const settingView = document.getElementById('setting-view');
    
                defaultView.style.display = 'none';
                settingView.style.display = 'none';
                chatView.style.display = 'block';
    
                chatView.innerHTML = `
                    <div class="chat-header">
                        <div class="header-info">
                            <h2>Phòng Đào tạo</h2>
                        </div>
                        <div class="header-actions">
                            <div class="exit-chat">
                                <img src="../assets/light/exit.svg" alt="Exit Chat" />
                            </div>
                        </div>
                    </div>
                    <div class="chat-area"></div>
                `;
    
                const chatArea = chatView.querySelector('.chat-area');
                const channelName = getCurrentDateTime();
    
                fetch('../views/chat.html')
                    .then(response => response.text())
                    .then(html => {
                        chatArea.innerHTML = html;
                        new ChatView(groupName, channelName);
                    })
                    .catch(error => console.error('Error:', error));
    
                chatView.querySelector('.exit-chat').addEventListener('click', () => {
                    existingChat.classList.remove('active');
                    chatView.style.display = 'none';
                    defaultView.style.display = 'block';
                });
            });
    
            chatContainer.appendChild(existingChat);
        });
    
        // Handle create new chat
        const create_chat = document.getElementById('create-chat');
        if (create_chat) {
            create_chat.addEventListener('click', () => {
                const setting_btn = document.getElementById('setting-button');
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
            
                        const defaultView = document.getElementById('default-view');
                        const chatView = document.getElementById('chat-view');
                        const settingView = document.getElementById('setting-view');
            
                        defaultView.style.display = 'none';
                        settingView.style.display = 'none';
                        chatView.style.display = 'block';
            
                        chatView.innerHTML = `
                            <div class="chat-header">
                                <div class="header-info">
                                    <h2>Phòng Đào tạo</h2>
                                </div>
                                <div class="header-actions">
                                    <div class="exit-chat">
                                        <img src="../assets/light/exit.svg" alt="Exit Chat" />
                                    </div>
                                </div>
                            </div>
                            <div class="chat-area"></div>
                        `;
            
                        const chatArea = chatView.querySelector('.chat-area');
                        const channelName = getCurrentDateTime();
            
                        fetch('../views/chat.html')
                            .then(response => response.text())
                            .then(html => {
                                chatArea.innerHTML = html;
                                new ChatView(chat_name, channelName);
                            })
                            .catch(error => console.error('Error:', error));
            
                        chatView.querySelector('.exit-chat').addEventListener('click', () => {
                            new_chat.classList.remove('active');
                            chatView.style.display = 'none';
                            defaultView.style.display = 'block';
                        });
                    });
            
                    // Insert the new chat at the top of the chatContainer
                    chatContainer.insertBefore(new_chat, chatContainer.firstChild);
            
                    // Add the new chat to the history with the specified structure
                    const newChatData = {
                        createdAt: getCurrentDateTime(),
                        messages: []
                    };
                    
                    // If chatHistory is not yet initialized, initialize it as an empty object
                    if (typeof chatHistory !== 'object') {
                        chatHistory = {};
                    }
            
                    // Add the new chat to the history object using the chat_name as the key
                    chatHistory[chat_name] = newChatData;
            
                    // Save the updated history to the file
                    fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory, null, 2), 'utf-8');
                }
            });
            
        }
    
        const setting_btn = document.getElementById('setting-button');
        if (setting_btn) {
            setting_btn.addEventListener('click', () => {
                setting_btn.classList.add('active');
                document.querySelectorAll('.chat').forEach(g => g.classList.remove('active'));
                document.getElementById('chat-view').style.display = 'none';
    
                const defaultView = document.getElementById('default-view');
                const chatView = document.getElementById('chat-view');
                const settingView = document.getElementById('setting-view');
    
                defaultView.style.display = 'none';
                settingView.style.display = 'block';
                chatView.style.display = 'none';
    
                settingView.innerHTML = `
                    <div class="setting-area"></div>
                `;
    
                const settingArea = settingView.querySelector('.setting-area');
                const channelName = getCurrentDateTime();
    
                fetch('../views/settings.html')
                .then(response => response.text())
                .then(html => {
                    settingArea.innerHTML = html;
    
                    // Dynamically load settings.css
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '../styles/settings.css';
                    document.head.appendChild(link);
    
                    const setting_view = new SettingView(document.getElementById("setting-img"));
                    const exit_setting_btn = setting_view.get_exit_btn()
    
                    exit_setting_btn.addEventListener('click', () => {
                        settingView.style.display = 'none';
                        defaultView.style.display = 'block';
                        setting_btn.classList.remove('active');
                    });
                })
                .catch(error => console.error('Error:', error));
            });
        }
    }
}

// // Xử lý sự kiện logout
// logoutBtn.addEventListener('click', () => {
//     // Xóa thông tin người dùng
//     localStorage.removeItem('userInfo');
    
//     // Reset form đăng nhập
//     document.getElementById('username').value = '';
//     document.getElementById('password').value = '';
    
//     // Chuyển về màn hình login
//     container.classList.remove('slide-left');
// });

module.exports = App;