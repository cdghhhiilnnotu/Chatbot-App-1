# Ứng dụng Chatbot Desktop

Ứng dụng chatbot desktop được xây dựng bằng Node.js và Electron.js, kết nối với máy chủ chatbot để cung cấp trải nghiệm trò chuyện tương tác.

## Tính năng

* **Đăng nhập**:
    * Sử dụng thông tin đăng nhập được cung cấp (tài khoản: 2055010051, mật khẩu: duong1).
* **Trò chuyện**:
    * Thêm và hiển thị các đoạn chat theo thời gian thực.
    * Nhận dạng giọng nói: Sử dụng micro để nhập tin nhắn bằng giọng nói.
* **Cài đặt**:
    * Thay đổi ảnh đại diện.
    * Xem thông tin tài khoản.
    * Đăng xuất.
    * Giới thiệu về ứng dụng.

## Cài đặt

1.  **Yêu cầu**:
    * Node.js (phiên bản 14 trở lên)
    * npm (Node Package Manager)
    * một máy chủ chatbot đang hoạt động.
2.  **Cài đặt các gói**:

    ```bash
    git clone [https://www.thegioididong.com/game-app/cach-xem-kho-luu-tru-tin-tren-facebook-cuc-nhanh-don-gian-1356225](https://www.thegioididong.com/game-app/cach-xem-kho-luu-tru-tin-tren-facebook-cuc-nhanh-don-gian-1356225)
    cd chatbot-desktop
    npm install
    ```
3.  **Cấu hình máy chủ**:
    * Mở tệp `scripts/utils.js`.
    * Thay đổi giá trị của biến `SERVER_URL` thành URL máy chủ chatbot của bạn. Ví dụ:

    ```javascript
    // scripts/utils.js
    // sử dụng cho ngrok
    const base = 'https://54f5-34-105-108-239.ngrok-free.app';
    // sử dụng cho local
    const base = 'http://127.0.0.1:1237';
    ```
4.  **Chạy ứng dụng**:

    ```bash
    npm start
    ```

## Lưu ý

* Đảm bảo rằng máy chủ chatbot đang chạy trước khi khởi động ứng dụng.
* Bạn có thể tùy chỉnh giao diện người dùng bằng cách chỉnh sửa các tệp trong thư mục `src/`.
* Bạn cần cài đặt thêm các gói hỗ trợ nhận diện giọng nói, và cài đặt thêm các thư viện hỗ trợ cho việc đó.