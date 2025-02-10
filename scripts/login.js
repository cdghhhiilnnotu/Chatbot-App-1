const App = require('../scripts/app.js');
const fs = require('fs');
const {server_url} = require('../scripts/utils.js');

// const response = await fetch(`https://97d5-34-143-211-7.ngrok-free.app/login/${username}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" }
// });

// console.log(response.json())

const login_btn = document.getElementById('login-btn');
const login_fail = document.querySelector('.login-fail');
let appview = null;

function showError(message) {
    login_fail.textContent = message;
    login_fail.classList.add('show');
    
    // Tự động ẩn thông báo sau 1.5 giây
    setTimeout(() => {
        login_fail.classList.remove('show');
    }, 1500);
}

function save_chats(chats, file_path='chat_histories.json'){
    const json_data = JSON.stringify(chats, null, 2);
    fs.writeFile(file_path, json_data, (err) => {
        if (err) {
          console.error("Error writing file", err);
        } else {
          console.log("JSON file has been saved.");
        }
      });
}

async function checkLogin(username_id, password_id, user_data) {
    try {
        // Set a timeout limit for the fetch request (5 seconds)
        const timeout = 5000;
        const controller = new AbortController();
        const timeout_promise = new Promise((_, reject) => {
            setTimeout(() => {
                controller.abort(); // Cancel the fetch request
                reject(new Error('Request Timeout'));
            }, timeout);
        });
    
        // Send the fetch request with a timeout
        const response = await Promise.race([
            fetch(`${server_url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username_id, password: password_id }),
                signal: controller.signal, // Attach AbortController
            }),
            timeout_promise,
        ]);
    
        // Check if the response is OK (e.g., 200-299)
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data);
    
        // Ensure `data` contains required properties
        user_data.username = data.username || "";
        user_data.name = data.name || "";
        user_data.password = data.password || "";
        user_data.others = data.others || {};
    
        // Check if `chats` exist before calling `save_chats`
        save_chats(data.chats);
        localStorage.setItem('user_chats', JSON.stringify(data.chats));
    
        return data.username === username_id && data.password === password_id;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    
        if (error.name === 'AbortError' || (error instanceof TypeError && error.message.includes('Failed to fetch'))) {
            showError('Không thể kết nối tới server! Vui lòng kiểm tra kết nối và thử lại.');
        } else {
            showError('Đã xảy ra lỗi! Vui lòng thử lại sau.');
        }
    
        return false;
    }
    
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kiểm tra form trống
    if (!username && !password) {
        showError('Vui lòng nhập username và password!');
        return;
    }
    
    if (!username) {
        showError('Vui lòng nhập username!');
        return;
    }
    
    if (!password) {
        showError('Vui lòng nhập password!');
        return;
    }

    // Kiểm tra đăng nhập với API
    let user_data = {};
    const is_valid_login = await checkLogin(username, password, user_data);
    
    if (is_valid_login) {
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('user_infor', JSON.stringify(user_data));

        // Chuyển sang màn hình app
        container.classList.add('slide-left');
        if (appview == null){
            appview = new App();
        }
    } else if (!is_valid_login && !login_fail.classList.contains('show')) {
        // Chỉ hiển thị thông báo sai thông tin nếu không có lỗi kết nối
        showError('Username hoặc password không đúng!');
    }
}

// Xử lý sự kiện click nút login
login_btn.addEventListener('click', handleLogin);

// Xử lý sự kiện nhấn Enter trong input password
document.getElementById('password').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn form submit mặc định
        handleLogin();
    }
});

// Xử lý sự kiện nhấn Enter trong input username
document.getElementById('username').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Focus vào ô password nếu đang ở ô username
        document.getElementById('password').focus();
    }
});