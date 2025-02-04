const fs = require('fs');
const path = require('path');

// Function to convert RGBA to HEX
function rgbaToHex(rgba) {
    const match = rgba.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (!match) return '#000000';
    return `#${parseInt(match[1]).toString(16).padStart(2, '0')}${parseInt(match[2]).toString(16).padStart(2, '0')}${parseInt(match[3]).toString(16).padStart(2, '0')}`;
}

// Function to convert HEX to RGBA
function hexToRgba(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

function get_setting(settingsPath) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) || {};
    return settings
}

class SettingView {
    constructor(setting_btn) {
        this.display_btn = document.getElementById('display-btn');
        this.display_btn.classList.add('active-btn');
        this.about_btn = document.getElementById('about-btn');
        this.tabs = document.getElementById('tab-main');
        this.exit_btn = document.getElementById('exit-btn');
        this.avt_input = document.getElementById('avatar-input');
        this.avt_btn = document.getElementById('avatar-btn');
        this.setting_btn = setting_btn
        this.avatar_img = document.getElementById('avatar-img')
        this.avatar_img.src = setting_btn.src

        this.init()
    }

    init() {
        this.setup_btn();
        this.show_infor()
        // this.display_to_main();
        // this.color_picker_handler();
        // this.set_avatar_handler();
    }

    setup_btn() {
        // this.knowledge_tab.addEventListener('click', () => this.knowledge_to_main())
        // this.display_tab.addEventListener('click', () => this.display_to_main())
        this.display_btn.addEventListener("click", () => {
            this.tabs.classList.remove('tab-slide-left');
            this.display_btn.classList.add('active-btn');
            this.about_btn.classList.remove('active-btn');
        })
        this.about_btn.addEventListener("click", () => {
            this.tabs.classList.add('tab-slide-left');
            this.about_btn.classList.add('active-btn');
            this.display_btn.classList.remove('active-btn');
        })
        
        this.avt_btn.addEventListener("click", ()=>{
            const self = this;
            this.avt_input.click()
            this.avt_input.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Update image sources
                        self.avatar_img.src = e.target.result;
                        self.setting_btn.src = e.target.result;
                        
                        // Convert base64 to buffer
                        const base64Data = e.target.result.replace(/^data:image\/\w+;base64,/, '');
                        const buffer = Buffer.from(base64Data, 'base64');
                        
                        // Ensure the assets directory exists
                        const avatarPath = path.join(__dirname, '../assets/avatar.png');
                        
                        // Create directory if it doesn't exist
                        const directory = path.dirname(avatarPath);
                        if (!fs.existsSync(directory)){
                            fs.mkdirSync(directory, { recursive: true });
                        }
                        
                        // Write file
                        fs.writeFile(avatarPath, buffer, (err) => {
                            if (err) {
                                console.error('Error saving avatar:', err);
                            } else {
                                console.log('Avatar saved successfully');
                            }
                        });
                    };
                    reader.readAsDataURL(file);
                }
            })
        })
    }

    get_exit_btn(){
        return this.exit_btn;
    }

    show_infor(){
        const username_text = document.querySelector('.info-text-username');
        const name_text = document.querySelector('.info-text-name');
        const password_text = document.querySelector('.info-text-password');
        const password_field = document.querySelector('.info-password');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        username_text.textContent = userInfo.username
        name_text.textContent = userInfo.name
        password_text.textContent = userInfo.password.replace(/./g, '•');

        let is_visible = false
        password_field.addEventListener("click", ()=>{
            if (!is_visible){
                password_text.textContent = userInfo.password
                is_visible = true
            }
            else{
                password_text.textContent = userInfo.password.replace(/./g, '•');
                is_visible = false
            }
        })

    }

}

module.exports = SettingView;
