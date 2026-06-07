// Sistema de autenticación (simulado)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Función de login
function login(email, password) {
    // Simulación de autenticación
    if (email && password) {
        currentUser = {
            id: 1,
            username: 'usuario_demo',
            email: email,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            role: 'user',
            name: 'Carlos Martínez'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

// Función de registro
function register(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return false;
    }
    
    if (username && email && password) {
        currentUser = {
            id: Date.now(),
            username: username,
            email: email,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            role: 'user',
            name: username
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Verificar si el usuario está autenticado
function checkAuth() {
    if (!currentUser && !window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Configurar eventos según la página actual
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            login(email, password);
        });
    }
    
    // Register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            register(username, email, password, confirmPassword);
        });
    }
    
    // Logout buttons
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Modal de recuperar contraseña
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('forgotPasswordModal').style.display = 'flex';
        });
    }
    
    // Cerrar modales
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Editar perfil
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            document.getElementById('editProfileModal').style.display = 'flex';
        });
    }
    
    // Guardar cambios de perfil
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = document.getElementById('editName').value;
            const newBio = document.getElementById('editBio').value;
            const newLocation = document.getElementById('editLocation').value;
            const newStatus = document.getElementById('editStatus').value;
            
            if (newName) document.getElementById('profileName').textContent = newName;
            if (newBio) document.getElementById('profileBio').textContent = newBio;
            if (newLocation) document.getElementById('profileLocation').textContent = newLocation;
            
            document.getElementById('editProfileModal').style.display = 'none';
            showNotification('Perfil actualizado correctamente');
        });
    }
    
    // Sistema de mensajería
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (sendMessageBtn && messageInput && chatMessages) {
        sendMessageBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">${escapeHtml(message)}</div>
                        <div class="message-time">${new Date().toLocaleTimeString().slice(0,5)}</div>
                        <i class="fas fa-check-double read"></i>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
                messageInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessageBtn.click();
            }
        });
    }
    
    // Emojis en chat
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    
    if (emojiBtn && emojiPicker) {
        emojiBtn.addEventListener('click', () => {
            emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'flex' : 'none';
        });
        
        document.querySelectorAll('.emoji').forEach(emoji => {
            emoji.addEventListener('click', () => {
                if (messageInput) {
                    messageInput.value += emoji.textContent;
                    emojiPicker.style.display = 'none';
                }
            });
        });
    }
    
    // Cambiar entre conversaciones
    document.querySelectorAll('.conversation-item').forEach(conv => {
        conv.addEventListener('click', function() {
            document.querySelectorAll('.conversation-item').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const userName = this.querySelector('.conversation-name').textContent;
            const userAvatar = this.querySelector('img').src;
            document.getElementById('chatUserName').textContent = userName;
            document.getElementById('chatUserAvatar').src = userAvatar;
        });
    });
    
    // Crear grupo
    const createGroupBtn = document.getElementById('createGroupBtn');
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => {
            document.getElementById('createGroupModal').style.display = 'flex';
        });
    }
    
    // Unirse a grupos
    document.querySelectorAll('.join-group-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === 'Unirse') {
                this.textContent = 'Unido';
                this.classList.add('joined');
                showNotification('Te has unido al grupo');
            } else {
                this.textContent = 'Unirse';
                this.classList.remove('joined');
            }
        });
    });
    
    // Admin tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.adminTab;
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('usersTable').style.display = target === 'users' ? 'block' : 'none';
            document.getElementById('reportsTable').style.display = target === 'reports' ? 'block' : 'none';
        });
    });
    
    // Settings tabs
    document.querySelectorAll('.settings-nav').forEach(nav => {
        nav.addEventListener('click', function() {
            const section = this.dataset.section;
            document.querySelectorAll('.settings-nav').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.settings-section').forEach(sec => sec.style.display = 'none');
            document.getElementById(`${section}Section`).style.display = 'block';
        });
    });
    
    // Theme switcher
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    });
    
    // Gráfico de admin (si existe canvas)
    const chartCanvas = document.getElementById('activityChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Usuarios activos',
                    data: [1200, 1350, 1400, 1550, 1700, 1900, 2100],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
});

// Función para mostrar notificaciones
function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// CSS adicional para animaciones
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .dark-theme {
        background: #1a1a2e;
        color: white;
    }
    
    .dark-theme .sidebar,
    .dark-theme .right-sidebar,
    .dark-theme .post-card,
    .dark-theme .group-card {
        background: #16213e;
        color: white;
    }
    
    .action-btn.liked {
        color: #e74c3c;
    }
    
    .joined {
        background: #2ecc71;
        color: white;
        border-color: #2ecc71;
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 20px;
        font-size: 12px;
    }
    
    .status-badge.active { background: #2ecc71; color: white; }
    .status-badge.suspended { background: #e74c3c; color: white; }
    
    .table-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
    }
    
    .emoji-picker {
        position: absolute;
        bottom: 80px;
        left: 20px;
        background: white;
        border-radius: 12px;
        padding: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 100;
    }
    
    .emoji-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
    }
    
    .emoji {
        font-size: 24px;
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .emoji:hover {
        transform: scale(1.2);
    }
`;
document.head.appendChild(styleSheet);
