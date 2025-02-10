const fs = require('fs');
const path = require('path');

class SettingView {
    constructor(setting_btn) {
        this.display_btn = document.getElementById('display-btn');
        this.display_btn.classList.add('active-btn');
        this.about_btn = document.getElementById('about-btn');
        this.tabs = document.getElementById('tab-main');
        this.exit_btn = document.getElementById('exit-btn');
        this.avt_input = document.getElementById('avatar-input');
        this.avt_btn = document.getElementById('avatar-btn');
        this.logout_btn = document.getElementById('logout-btn');
        this.setting_btn = setting_btn
        this.avatar_img = document.getElementById('avatar-img')
        this.avatar_img.src = setting_btn.src
        this.username_text = document.querySelector('.info-text-username');
        this.name_text = document.querySelector('.info-text-name');
        this.password_text = document.querySelector('.info-text-password');
        this.password_field = document.querySelector('.info-password');
        this.user_infor = JSON.parse(localStorage.getItem('user_infor'));
        
        this.init()
    }

    init() {
        this.setup_btn();
        this.show_infor();
    }

    setup_btn() {
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
                        localStorage.setItem('avatar_src', e.target.result)
                        // Convert base64 to buffer
                        const base64_data = e.target.result.replace(/^data:image\/\w+;base64,/, '');
                        const buffer = Buffer.from(base64_data, 'base64');
                        
                        // Ensure the assets directory exists
                        const avatar_dath = path.join(__dirname, '../assets/avatar.png');
                        
                        // Create directory if it doesn't exist
                        const directory = path.dirname(avatar_dath);
                        if (!fs.existsSync(directory)){
                            fs.mkdirSync(directory, { recursive: true });
                        }
                        
                        // Write file
                        fs.writeFile(avatar_dath, buffer, (err) => {
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
        this.username_text.textContent = this.user_infor.username
        this.name_text.textContent = this.user_infor.name
        this.password_text.textContent = this.user_infor.password.replace(/./g, '•');

        let is_visible = false
        this.password_field.addEventListener("click", ()=>{
            if (!is_visible){
                this.password_text.textContent = this.user_infor.password
                is_visible = true
            }
            else{
                this.password_text.textContent = this.user_infor.password.replace(/./g, '•');
                is_visible = false
            }
        })

        this.logout_btn.addEventListener("click", () =>{
            localStorage.removeItem('user_infor');
            localStorage.removeItem('user_chats');

            // Reset form đăng nhập
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            default_view.style.display = 'block';
            setting_view.style.display = 'none';
            chat_view.style.display = 'none';

            setting_btn.classList.remove('active');

            chat_container.replaceChildren();
            fs.unlinkSync('chat_histories.json');
            
            // Chuyển về màn hình login
            container.classList.remove('slide-left');
        });
    }
}

module.exports = SettingView;
