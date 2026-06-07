// Datos de ejemplo (simulando backend)
let currentUser = {
    id: 1,
    username: "usuario_demo",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "user"
};

let posts = [
    {
        id: 1,
        author: {
            id: 2,
            name: "Ana García",
            username: "@ana_garcia",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        content: "¡Bienvenidos a Liquid Social! Una nueva forma de conectar sin límites 🌊",
        media: null,
        likes: 45,
        comments: 12,
        shares: 5,
        timestamp: "2024-01-15T10:30:00",
        likedByCurrentUser: false
    },
    {
        id: 2,
        author: {
            id: 3,
            name: "Carlos Ruiz",
            username: "@carlos_tech",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg"
        },
        content: "Probando la nueva función de mensajería en tiempo real. ¡Increíble! 🚀",
        media: null,
        likes: 23,
        comments: 7,
        shares: 2,
        timestamp: "2024-01-15T09:15:00",
        likedByCurrentUser: true
    }
];

// Cargar publicaciones en el feed
function loadFeed() {
    const feedContainer = document.getElementById('feedPosts');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        feedContainer.appendChild(postElement);
    });
}

// Crear elemento HTML de publicación
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    postDiv.dataset.postId = post.id;
    
    const postDate = new Date(post.timestamp);
    const timeAgo = getTimeAgo(postDate);
    
    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${post.author.avatar}" class="avatar" alt="">
            <div class="post-author-info">
                <div class="post-author-name">${post.author.name}</div>
                <div class="post-author-username">${post.author.username}</div>
            </div>
            <div class="post-time">${timeAgo}</div>
            <div class="post-menu"><i class="fas fa-ellipsis-h"></i></div>
        </div>
        <div class="post-content">
            <p>${escapeHtml(post.content)}</p>
        </div>
        ${post.media ? `<img src="${post.media}" class="post-media" alt="">` : ''}
        <div class="post-stats">
            <span><i class="fas fa-heart"></i> ${post.likes} likes</span>
            <span><i class="fas fa-comment"></i> ${post.comments} comentarios</span>
            <span><i class="fas fa-share"></i> ${post.shares} compartidos</span>
        </div>
        <div class="post-actions-buttons">
            <button class="action-btn like-btn ${post.likedByCurrentUser ? 'liked' : ''}">
                <i class="fas fa-heart"></i> Like
            </button>
            <button class="action-btn comment-btn">
                <i class="fas fa-comment"></i> Comentar
            </button>
            <button class="action-btn share-btn">
                <i class="fas fa-share"></i> Compartir
            </button>
        </div>
    `;
    
    // Agregar eventos
    const likeBtn = postDiv.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => toggleLike(post.id, likeBtn));
    
    return postDiv;
}

// Alternar like
function toggleLike(postId, button) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likedByCurrentUser = !post.likedByCurrentUser;
        post.likes += post.likedByCurrentUser ? 1 : -1;
        
        if (post.likedByCurrentUser) {
            button.classList.add('liked');
            showNotification('Le diste like a una publicación');
        } else {
            button.classList.remove('liked');
        }
        
        loadFeed(); // Recargar feed para actualizar contadores
    }
}

// Crear nueva publicación
function createPost(content, mediaUrl = null) {
    if (!content.trim() && !mediaUrl) return;
    
    const newPost = {
        id: Date.now(),
        author: {
            id: currentUser.id,
            name: currentUser.username,
            username: `@${currentUser.username}`,
            avatar: currentUser.avatar
        },
        content: content,
        media: mediaUrl,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        likedByCurrentUser: false
    };
    
    posts.unshift(newPost);
    loadFeed();
    showNotification('¡Publicación creada con éxito!');
}

// Mostrar notificación toast
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
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Calcular tiempo transcurrido
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'ahora mismo';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} d`;
    return date.toLocaleDateString();
}

// Escapar HTML para evitar XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal de notificaciones
function setupModals() {
    const modal = document.getElementById('notificationsModal');
    const btn = document.getElementById('notificationsBtn');
    const closeBtn = document.querySelector('.close-modal');
    
    if (btn && modal) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadFeed();
    setupModals();
    
    // Botón de crear publicación
    const createPostBtn = document.getElementById('createPostBtn');
    const postContent = document.getElementById('postContent');
    
    if (createPostBtn && postContent) {
        createPostBtn.addEventListener('click', () => {
            createPost(postContent.value);
            postContent.value = '';
        });
    }
    
    // Búsqueda global
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                const filtered = posts.filter(post => 
                    post.content.toLowerCase().includes(searchTerm) ||
                    post.author.name.toLowerCase().includes(searchTerm)
                );
                const feedContainer = document.getElementById('feedPosts');
                if (feedContainer) {
                    feedContainer.innerHTML = '';
                    filtered.forEach(post => {
                        feedContainer.appendChild(createPostElement(post));
                    });
                }
            } else if (searchTerm.length === 0) {
                loadFeed();
            }
        });
    }
    
    // Botones de seguir (simulación)
    document.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === 'Seguir') {
                this.textContent = 'Siguiendo';
                this.style.background = '#2ecc71';
                this.style.borderColor = '#2ecc71';
                this.style.color = 'white';
                showNotification('¡Ahora sigues a este usuario!');
            } else {
                this.textContent = 'Seguir';
                this.style.background = 'none';
                this.style.borderColor = '#667eea';
                this.style.color = '#667eea';
            }
        });
    });
});

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .toast-notification {
        animation: slideIn 0.3s ease;
    }
    
    .action-btn.liked {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);
