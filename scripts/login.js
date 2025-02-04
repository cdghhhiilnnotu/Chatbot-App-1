const App = require('../scripts/app.js');
const fs = require('fs');

const loginBtn = document.getElementById('login-btn');
const loginFail = document.querySelector('.login-fail');

function showError(message) {
    loginFail.textContent = message;
    loginFail.classList.add('show');
    
    // Tự động ẩn thông báo sau 1.5 giây
    setTimeout(() => {
        loginFail.classList.remove('show');
    }, 1500);
}

function save_chats(chats, file_path='chat_histories.json'){
    const jsonData = JSON.stringify(chats, null, 2);
    fs.writeFile(file_path, jsonData, (err) => {
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
        // user_data.chats = data.chats;
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
    const isValidLogin = await checkLogin(username, password, user_data);
    // const isValidLogin = true;
    // user_data = {
    //     username: "Nguyễn",
    //     name: "Thành",
    //     password: "Dương"
    // }
    
    if (isValidLogin) {
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('userInfo', JSON.stringify(user_data));

        // Chuyển sang màn hình app
        container.classList.add('slide-left');
        new App();
    } else if (!isValidLogin && !loginFail.classList.contains('show')) {
        // Chỉ hiển thị thông báo sai thông tin nếu không có lỗi kết nối
        showError('Username hoặc password không đúng!');
    }
}

// Xử lý sự kiện click nút login
loginBtn.addEventListener('click', handleLogin);

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