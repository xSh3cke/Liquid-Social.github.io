// Global variables
let allItems = [];
let currentFilter = 'all';
let searchTerm = '';

// Load all data
async function loadAllData() {
    try {
        const [scripts, executors, tools] = await Promise.all([
            fetch('data/scripts.json').then(res => res.json()),
            fetch('data/executors.json').then(res => res.json()),
            fetch('data/tools.json').then(res => res.json())
        ]);
        
        allItems = [...scripts, ...executors, ...tools];
        
        // Update statistics
        updateStatistics(scripts, executors, tools);
        
        // Load recent items
        loadRecentItems(allItems);
        
        // Load top items
        loadTopItems(allItems);
        
        // Render cards
        renderCards();
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Update statistics widgets
function updateStatistics(scripts, executors, tools) {
    const totalScripts = scripts.length;
    const totalExecutors = executors.length;
    const totalTools = tools.length;
    const totalDownloads = [...scripts, ...executors, ...tools].reduce((sum, item) => sum + parseInt(item.downloads), 0);
    
    document.getElementById('totalScripts').textContent = totalScripts;
    document.getElementById('totalExecutors').textContent = totalExecutors;
    document.getElementById('totalTools').textContent = totalTools;
    document.getElementById('totalDownloads').textContent = totalDownloads.toLocaleString();
}

// Load recent items (last 5)
function loadRecentItems(items) {
    const recent = [...items].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const recentContainer = document.getElementById('recentItems');
    
    recentContainer.innerHTML = recent.map(item => `
        <div class="news-item">
            🔹 ${item.title} - <span style="color: var(--accent-primary);">${item.category}</span>
        </div>
    `).join('');
}

// Load top items by downloads
function loadTopItems(items) {
    const top = [...items].sort((a, b) => parseInt(b.downloads) - parseInt(a.downloads)).slice(0, 5);
    const topContainer = document.getElementById('topItems');
    
    topContainer.innerHTML = top.map((item, index) => `
        <div class="top-item">
            ${index + 1}. ${item.title} (⬇️ ${item.downloads})
        </div>
    `).join('');
}

// Render cards based on filters
function renderCards() {
    let filtered = allItems;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.category === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    const cardsGrid = document.getElementById('cardsGrid');
    
    if (filtered.length === 0) {
        cardsGrid.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
        return;
    }
    
    cardsGrid.innerHTML = filtered.map(item => `
        <div class="card">
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x160?text=No+Image'">
                ${item.verified ? '<span class="verified-badge">✓ Verificado</span>' : ''}
            </div>
            <div class="card-content">
                <span class="card-category ${item.category.toLowerCase()}">${item.category}</span>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
                <div class="card-footer">
                    <span class="card-downloads">⬇️ ${item.downloads}</span>
                    <a href="${item.link}" class="card-btn">Abrir</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderCards();
        });
    }
    
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderCards();
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.body.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
        
        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
    }
    
    // Discord button
    const discordBtn = document.querySelector('.discord-btn');
    if (discordBtn) {
        discordBtn.addEventListener('click', () => {
            window.open('https://discord.gg/novacode', '_blank');
        });
    }
}

// Initialize
loadAllData();
