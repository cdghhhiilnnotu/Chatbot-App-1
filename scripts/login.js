const App = require('../scripts/app.js');
const fs = require('fs');

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

async function checkLogin(username, password, user_data) {
    try {
        const response = await fetch(`http://127.0.0.1:1237/login/${username}`);
        const data = await response.json();
        console.log(data)
        user_data.username = data.username;
        user_data.name = data.name;
        user_data.password = data.password;
        user_data.others = data.others;
        
        save_chats(data.chats)
        localStorage.setItem('user_chats', JSON.stringify(data.chats));

        return data.username == username && data.password == password;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
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
    // const is_valid_login = true;
    // user_data = {
    //     username: "Nguyễn",
    //     name: "Thành",
    //     password: "Dương"
    // }
    
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