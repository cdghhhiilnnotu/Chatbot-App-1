# Desktop Chatbot Application

A desktop chatbot application built with Node.js and Electron.js, connecting to a chatbot server to provide an interactive chat experience.

## Features

* **Login**:
    * Use the provided login credentials (account: 2055010051, password: duong1).
* **Chat**:
    * Add and display chat messages in real-time.
    * Voice Recognition: Use the microphone to input messages via voice.
* **Settings**:
    * Change profile picture.
    * View account information.
    * Logout.
    * About the application.

## Installation

1.  **Requirements**:
    * Node.js (version 14 or later)
    * npm (Node Package Manager)
    * A running chatbot server.
2.  **Install Packages**:

    ```bash
    git clone [https://www.thegioididong.com/game-app/cach-xem-kho-luu-tru-tin-tren-facebook-cuc-nhanh-don-gian-1356225](https://www.thegioididong.com/game-app/cach-xem-kho-luu-tru-tin-tren-facebook-cuc-nhanh-don-gian-1356225)
    cd chatbot-desktop
    npm install
    ```
3.  **Configure Server**:
    * Open the `scripts/utils.js` file.
    * Change the value of the `base` variable to your chatbot server URL. For example:

    ```javascript
    // scripts/utils.js
    // use for ngrok
    const base = '[https://54f5-34-105-108-239.ngrok-free.app](https://54f5-34-105-108-239.ngrok-free.app)';
    // use for local
    const base = '[http://127.0.0.1:1237](http://127.0.0.1:1237)';
    ```
4.  **Run Application**:

    ```bash
    npm start
    ```

## Notes

* Ensure that the chatbot server is running before starting the application.
* You can customize the user interface by editing the files in the `src/` directory.
* You need to install more library to support voice recognition.