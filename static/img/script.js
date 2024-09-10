const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// 获取弹窗
var loginModal = document.getElementById("loginModal");

var registerModal = document.getElementById("registerModal");

var loggedInModal = document.getElementById("loggedInModal");

// 获取按钮
var account_bt = document.getElementById("account_bt");

var register_bt = document.getElementById("register_bt");

// 获取 <span> 元素，用于关闭弹窗
var closeButtons = document.getElementsByClassName("close");



// 当用户点击按钮时，打开弹窗
account_bt.onclick = function() {
    fetch('/get_login_status', { method: 'GET' })
        .then(response => {
            if (response.status === 200) {
                // 已登录，显示 loggedInModal
                loggedInModal.style.display = "block";
            } else if (response.status === 401) {
                // 未登录，显示 loginModal
                loginModal.style.display = "block";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // 处理错误
            loginModal.style.display = "block";
        });
}

register_bt.onclick = function() {
    loginModal.style.display = "none";
    registerModal.style.display = "block";
}

// 当用户点击 <span> (x)，关闭弹窗
for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function() {
        this.parentElement.parentElement.style.display = "none";
    }
}

// 当用户点击弹窗外部，关闭弹窗
window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    } else if (event.target == registerModal) {
        registerModal.style.display = "none";
    } else if (event.target == loggedInModal) {
        loggedInModal.style.display = "none";
    }
}

document.getElementById('loginForm').onsubmit = async function(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    const formData = new FormData(this);

    const response = await fetch('login', {
        method: 'POST',
        body: formData
    });

    if (response.status === 401) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = "Incorrect email or password.";
        errorMessage.style.display = 'block';
    } else if (response.ok) { // 检查响应是否成功
        window.location.href = "home";  // 成功后重定向到主页
    }
};

document.getElementById('registerForm').onsubmit = async function(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    const formData = new FormData(this);

    const response = await fetch('register', {
        method: 'POST',
        body: formData
    });

    if (response.status === 409) {
        const errorMessage = document.getElementById('register_error_message');
        errorMessage.textContent = "Email or phone number already exists";
        errorMessage.style.display = 'block';
    } else if (response.ok) { // 检查响应是否成功
        window.location.href = "home";  // 成功后重定向到主页
    }
};

document.getElementById('logoutButton').onclick = function() {
    fetch('/logout', {
        method: 'POST', // 假设你的 /logout API 使用 POST 方法
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // 登出成功，关闭 loggedInModal 并重定向到登录页面或其他页面
            loggedInModal.style.display = 'none';
            // window.location.href = '/home'; // 或者你希望重定向的路径
        } else {
            console.error('Logout failed.');
            // 处理登出失败的逻辑，比如显示一个错误消息
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        // 处理网络错误等情况
    });
};


document.getElementById('viewProfileButton').onclick = function() {
    fetch('/profile', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // 登出成功，关闭 loggedInModal 并重定向到登录页面或其他页面
            loggedInModal.style.display = 'none';
            window.location.href = 'profile';
            // window.location.href = '/home'; // 或者你希望重定向的路径
        } else {
            console.error('Profile page failed.');
            // 处理登出失败的逻辑，比如显示一个错误消息
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        // 处理网络错误等情况
    });
};