// ============================================
// 1. SUPABASE CONFIGURATION
// ============================================
// Add your Supabase URL and Anon Key here later
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;

// Initialize Supabase
function initSupabase() {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        console.warn('⚠️ Supabase configuration pending. Using mock data for now.');
        return false;
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
}

// ============================================
// 2. MOCK DATA (For Testing)
// ============================================
const mockVideos = [
    {
        id: '1',
        title: 'Learn JavaScript - Basics',
        description: 'In this video, we will learn the basics of JavaScript. This video is for beginners.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://picsum.photos/seed/vid1/400/225',
        category: 'education',
        views: 1250,
        is_published: true,
        created_at: '2026-10-20T10:00:00Z'
    },
    {
        id: '2',
        title: 'Beautiful Pakistan - Northern Areas',
        description: 'Tour of the beautiful northern areas of Pakistan.',
        video_url: 'https://www.youtube.com/watch?v=abcdef12345',
        thumbnail_url: 'https://picsum.photos/seed/vid2/400/225',
        category: 'vlogs',
        views: 3420,
        is_published: true,
        created_at: '2026-10-18T10:00:00Z'
    },
    {
        id: '3',
        title: 'iPhone 17 Review - Is it worth it?',
        description: 'Detailed review of the new iPhone.',
        video_url: 'https://www.youtube.com/watch?v=xyz789',
        thumbnail_url: 'https://picsum.photos/seed/vid3/400/225',
        category: 'tech',
        views: 5670,
        is_published: true,
        created_at: '2026-10-25T10:00:00Z'
    },
    {
        id: '4',
        title: 'Comedy Video - Laugh Out Loud',
        description: 'A hilarious comedy video.',
        video_url: 'https://www.youtube.com/watch?v=comedy123',
        thumbnail_url: 'https://picsum.photos/seed/vid4/400/225',
        category: 'entertainment',
        views: 8900,
        is_published: true,
        created_at: '2026-10-22T10:00:00Z'
    },
    {
        id: '5',
        title: 'Python Programming Tutorial',
        description: 'Learn Python the easy way.',
        video_url: 'https://www.youtube.com/watch?v=python456',
        thumbnail_url: 'https://picsum.photos/seed/vid5/400/225',
        category: 'education',
        views: 2100,
        is_published: true,
        created_at: '2026-10-15T10:00:00Z'
    },
    {
        id: '6',
        title: 'Gaming Stream - PUBG Mobile',
        description: 'LIVE gaming stream.',
        video_url: 'https://www.youtube.com/watch?v=gaming789',
        thumbnail_url: 'https://picsum.photos/seed/vid6/400/225',
        category: 'entertainment',
        views: 4500,
        is_published: true,
        created_at: '2026-10-27T10:00:00Z'
    }
];

const mockComments = [
    { id: '1', video_id: '1', user_name: 'Ahmed', comment_text: 'Great video!', created_at: '2026-10-26T10:00:00Z' },
    { id: '2', video_id: '1', user_name: 'Ali', comment_text: 'Make more videos', created_at: '2026-10-27T10:00:00Z' },
    { id: '3', video_id: '3', user_name: 'Sara', comment_text: 'I bought this phone', created_at: '2026-10-26T10:00:00Z' }
];

const mockAds = [
    {
        id: '1',
        title: 'Header Ad',
        image_url: 'https://picsum.photos/seed/ad1/728/90',
        link_url: 'https://example.com',
        position: 'header',
        is_active: true
    },
    {
        id: '2',
        title: 'Sidebar Ad',
        image_url: 'https://picsum.photos/seed/ad2/300/250',
        link_url: 'https://example.com',
        position: 'sidebar',
        is_active: true
    }
];

// ============================================
// 3. UTILITY FUNCTIONS
// ============================================

// Smart Video Handler - Detects video type from URL
function getVideoEmbed(url) {
    if (!url) return '<p>Video URL not available</p>';
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return `<iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
    }
    
    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" allowfullscreen></iframe>`;
    }
    
    // Dailymotion
    const dailymotionRegex = /(?:dailymotion\.com\/(?:video|hub)\/)([^_]+)/i;
    const dailymotionMatch = url.match(dailymotionRegex);
    if (dailymotionMatch) {
        return `<iframe src="https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}" allowfullscreen></iframe>`;
    }
    
    // Facebook
    if (url.includes('facebook.com') || url.includes('fb.watch')) {
        return `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false" allowfullscreen></iframe>`;
    }
    
    // Direct MP4/WebM
    if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
        return `<video controls autoplay><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
    
    // Fallback - iframe
    return `<iframe src="${url}" allowfullscreen></iframe>`;
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format views (1K, 1M, etc.)
function formatViews(views) {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
}

// Get category display name
function getCategoryName(cat) {
    const categories = {
        'western': 'Western',
        'asian': 'Asian',
        'tech': 'Technology',
        'vlogs': 'Vlogs'
    };
    return categories[cat] || cat;
}

// ============================================
// 4. DATA FETCHING FUNCTIONS
// ============================================

async function fetchPublishedVideos() {
    if (!supabaseClient) {
        // Use mock data
        return mockVideos.filter(v => v.is_published);
    }
    
    const { data, error } = await supabaseClient
        .from('videos')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
    return data;
}

async function fetchVideoById(id) {
    if (!supabaseClient) {
        return mockVideos.find(v => v.id === id);
    }
    
    const { data, error } = await supabaseClient
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error fetching video:', error);
        return null;
    }
    return data;
}

async function fetchAllVideos() {
    if (!supabaseClient) {
        return mockVideos;
    }
    
    const { data, error } = await supabaseClient
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
}

async function fetchComments(videoId) {
    if (!supabaseClient) {
        return mockComments.filter(c => c.video_id === videoId);
    }
    
    const { data, error } = await supabaseClient
        .from('comments')
        .select('*')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
}

async function fetchAllComments() {
    if (!supabaseClient) {
        return mockComments;
    }
    
    const { data, error } = await supabaseClient
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
}

async function fetchActiveAds() {
    if (!supabaseClient) {
        return mockAds.filter(a => a.is_active);
    }
    
    const { data, error } = await supabaseClient
        .from('ads')
        .select('*')
        .eq('is_active', true);
    
    if (error) return [];
    return data;
}

async function fetchAllAds() {
    if (!supabaseClient) {
        return mockAds;
    }
    
    const { data, error } = await supabaseClient
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
}

// ============================================
// 5. INDEX PAGE LOGIC
// ============================================

let currentCategory = 'all';
let currentSort = 'newest';
let currentSearch = '';

async function loadIndexPage() {
    const videos = await fetchPublishedVideos();
    renderVideos(videos);
    loadAds();
    setupIndexEvents();
}

function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    
    // Filter
    let filtered = videos;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(v => v.category === currentCategory);
    }
    
    // Search
    if (currentSearch) {
        const search = currentSearch.toLowerCase();
        filtered = filtered.filter(v => 
            v.title.toLowerCase().includes(search) ||
            v.description.toLowerCase().includes(search)
        );
    }
    
    // Sort
    if (currentSort === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (currentSort === 'popular') {
        filtered.sort((a, b) => b.views - a.views);
    } else if (currentSort === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="loading">No videos found</div>';
        return;
    }
    
    grid.innerHTML = filtered.map((video, index) => {
        const adInsert = (index > 0 && index % 6 === 0) ? getAdBetweenHTML() : '';
        return `
            ${adInsert}
            <div class="video-card" onclick="openVideo('${video.id}')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail_url}" alt="${video.title}" loading="lazy">
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <span>👁️ ${formatViews(video.views)} views</span>
                        <span>${getCategoryName(video.category)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getAdBetweenHTML() {
    return `
        <div class="ad-between" style="grid-column: 1 / -1;">
            <div class="ad-placeholder">Ad Space</div>
        </div>
    `;
}

function openVideo(id) {
    window.location.href = `video.html?id=${id}`;
}

async function loadAds() {
    const ads = await fetchActiveAds();
    
    // Header Ad
    const headerAd = document.getElementById('headerAd');
    if (headerAd) {
        const headerAdData = ads.find(a => a.position === 'header');
        if (headerAdData) {
            headerAd.innerHTML = `
                <a href="${headerAdData.link_url}" target="_blank">
                    <img src="${headerAdData.image_url}" alt="${headerAdData.title}" style="width:100%; border-radius:8px;">
                </a>
            `;
        }
    }
}

function setupIndexEvents() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                currentSearch = e.target.value;
                const videos = await fetchPublishedVideos();
                renderVideos(videos);
            }, 300);
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            if (searchInput) {
                currentSearch = searchInput.value;
                const videos = await fetchPublishedVideos();
                renderVideos(videos);
            }
        });
    }
    
    // Category Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            const videos = await fetchPublishedVideos();
            renderVideos(videos);
        });
    });
    
    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', async () => {
            currentSort = sortSelect.value;
            const videos = await fetchPublishedVideos();
            renderVideos(videos);
        });
    }
}

// ============================================
// 6. VIDEO PAGE LOGIC
// ============================================

async function loadVideoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    
    if (!videoId) {
        window.location.href = 'index.html';
        return;
    }
    
    const video = await fetchVideoById(videoId);
    if (!video) {
        window.location.href = 'index.html';
        return;
    }
    
    // Render Video
    renderVideoPlayer(video);
    renderVideoDetails(video);
    
    // Increment Views
    await incrementViews(videoId, video.views);
    
    // Load Comments
    await loadComments(videoId);
    
    // Load Related Videos
    await loadRelatedVideos(video);
    
    // Load Sidebar Ad
    await loadSidebarAd();
    
    // Setup Events
    setupVideoPageEvents(videoId);
}

function renderVideoPlayer(video) {
    const player = document.getElementById('videoPlayer');
    if (player) {
        player.innerHTML = getVideoEmbed(video.video_url);
    }
}

function renderVideoDetails(video) {
    document.getElementById('videoTitle').textContent = video.title;
    document.getElementById('videoViews').textContent = `👁️ ${formatViews(video.views + 1)} views`;
    document.getElementById('videoDate').textContent = `📅 ${formatDate(video.created_at)}`;
    document.getElementById('videoDescription').textContent = video.description;
    document.title = `${video.title} - Video Gallery`;
}

async function incrementViews(videoId, currentViews) {
    // Check localStorage if this user has viewed before
    const viewedKey = `viewed_video_${videoId}`;
    const lastViewed = localStorage.getItem(viewedKey);
    const now = Date.now();
    
    // If 24 hours have passed, increment count
    if (!lastViewed || (now - parseInt(lastViewed)) > 24 * 60 * 60 * 1000) {
        localStorage.setItem(viewedKey, now.toString());
        
        if (supabaseClient) {
            await supabaseClient
                .from('videos')
                .update({ views: currentViews + 1 })
                .eq('id', videoId);
        }
    }
}

async function loadComments(videoId) {
    const comments = await fetchComments(videoId);
    renderComments(comments);
    document.getElementById('commentCount').textContent = comments.length;
}

function renderComments(comments) {
    const list = document.getElementById('commentsList');
    if (!list) return;
    
    if (comments.length === 0) {
        list.innerHTML = '<p class="loading">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    list.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-name">${comment.user_name}</span>
                <span>${formatDate(comment.created_at)}</span>
            </div>
            <p class="comment-text">${comment.comment_text}</p>
        </div>
    `).join('');
}

async function loadRelatedVideos(currentVideo) {
    const allVideos = await fetchPublishedVideos();
    const related = allVideos
        .filter(v => v.id !== currentVideo.id && v.category === currentVideo.category)
        .slice(0, 5);
    
    // If not enough in same category, get from others
    if (related.length < 5) {
        const others = allVideos
            .filter(v => v.id !== currentVideo.id && v.category !== currentVideo.category)
            .slice(0, 5 - related.length);
        related.push(...others);
    }
    
    const list = document.getElementById('relatedVideosList');
    if (list) {
        list.innerHTML = related.map(video => `
            <div class="related-item" onclick="openVideo('${video.id}')">
                <div class="related-thumbnail">
                    <img src="${video.thumbnail_url}" alt="${video.title}">
                </div>
                <div class="related-info">
                    <h4 class="related-title">${video.title}</h4>
                    <p class="related-meta">👁️ ${formatViews(video.views)} views</p>
                </div>
            </div>
        `).join('');
    }
}

async function loadSidebarAd() {
    const ads = await fetchActiveAds();
    const sidebarAd = document.getElementById('sidebarAd');
    if (sidebarAd) {
        const ad = ads.find(a => a.position === 'sidebar');
        if (ad) {
            sidebarAd.innerHTML = `
                <a href="${ad.link_url}" target="_blank">
                    <img src="${ad.image_url}" alt="${ad.title}" style="width:100%; border-radius:8px;">
                </a>
            `;
        }
    }
}

function setupVideoPageEvents(videoId) {
    const submitBtn = document.getElementById('submitComment');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const name = document.getElementById('commentName').value.trim();
            const text = document.getElementById('commentText').value.trim();
            
            if (!name || !text) {
                alert('Please enter your name and comment');
                return;
            }
            
            const newComment = {
                video_id: videoId,
                user_name: name,
                comment_text: text,
                created_at: new Date().toISOString()
            };
            
            if (supabaseClient) {
                const { error } = await supabaseClient
                    .from('comments')
                    .insert([newComment]);
                
                if (error) {
                    alert('Error posting comment');
                    return;
                }
            } else {
                // Add to mock data
                newComment.id = Date.now().toString();
                mockComments.push(newComment);
            }
            
            // Clear form
            document.getElementById('commentName').value = '';
            document.getElementById('commentText').value = '';
            
            // Reload comments
            await loadComments(videoId);
        });
    }
    
    // Search on video page
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
}

// ============================================
// 7. ADMIN PANEL LOGIC
// ============================================

let currentAdminSection = 'dashboard';

async function loadAdminPage() {
    // Check if logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
    
    setupAdminEvents();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadDashboardStats();
}

async function loadDashboardStats() {
    const videos = await fetchAllVideos();
    const comments = await fetchAllComments();
    const ads = await fetchAllAds();
    
    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const activeAds = ads.filter(a => a.is_active).length;
    
    document.getElementById('totalVideos').textContent = videos.length;
    document.getElementById('totalViews').textContent = formatViews(totalViews);
    document.getElementById('totalComments').textContent = comments.length;
    document.getElementById('totalAds').textContent = activeAds;
}

function setupAdminEvents() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('admin_logged_in');
            showLogin();
        });
    }
    
    // Navigation
    document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchSection(btn.dataset.section);
        });
    });
    
    // Add Video Button
    const addVideoBtn = document.getElementById('addVideoBtn');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', () => {
            openVideoForm();
        });
    }
    
    // Video Form
    const videoForm = document.getElementById('videoForm');
    if (videoForm) {
        videoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveVideo();
        });
    }
    
    // Add Ad Button
    const addAdBtn = document.getElementById('addAdBtn');
    if (addAdBtn) {
        addAdBtn.addEventListener('click', () => {
            openAdForm();
        });
    }
    
    // Ad Form
    const adForm = document.getElementById('adForm');
    if (adForm) {
        adForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAd();
        });
    }
    
    // Modal Close Buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    
    // Load initial data
    loadVideosTable();
    loadCommentsTable();
    loadAdsTable();
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (supabaseClient) {
        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            errorEl.textContent = 'Invalid email or password';
            return;
        }
    } else {
        // Mock login - default credentials
        if (email === 'admin@example.com' && password === 'admin123') {
            // OK
        } else {
            errorEl.textContent = 'Invalid email or password (admin@example.com / admin123)';
            return;
        }
    }
    
    localStorage.setItem('admin_logged_in', 'true');
    errorEl.textContent = '';
    showDashboard();
}

function switchSection(section) {
    currentAdminSection = section;
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}Section`).classList.add('active');
    
    if (section === 'dashboard') loadDashboardStats();
    if (section === 'videos') loadVideosTable();
    if (section === 'comments') loadCommentsTable();
    if (section === 'ads') loadAdsTable();
}

async function loadVideosTable() {
    const videos = await fetchAllVideos();
    const tbody = document.getElementById('videosTableBody');
    if (!tbody) return;
    
    const comments = await fetchAllComments();
    
    tbody.innerHTML = videos.map(video => {
        const commentCount = comments.filter(c => c.video_id === video.id).length;
        return `
            <tr>
                <td><img src="${video.thumbnail_url}" alt="${video.title}"></td>
                <td>${video.title}</td>
                <td>${getCategoryName(video.category)}</td>
                <td>${formatViews(video.views)}</td>
                <td>${commentCount}</td>
                <td>
                    <span class="status-badge ${video.is_published ? 'status-published' : 'status-draft'}">
                        ${video.is_published ? 'Published' : 'Draft'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-secondary" onclick="editVideo('${video.id}')">Edit</button>
                        <button class="btn-danger" onclick="deleteVideo('${video.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openVideoForm(video = null) {
    const modal = document.getElementById('videoFormModal');
    const formTitle = document.getElementById('formTitle');
    
    if (video) {
        formTitle.textContent = 'Edit Video';
        document.getElementById('videoId').value = video.id;
        document.getElementById('videoTitleInput').value = video.title;
        document.getElementById('videoDescInput').value = video.description;
        document.getElementById('videoUrlInput').value = video.video_url;
        document.getElementById('thumbnailUrlInput').value = video.thumbnail_url;
        document.getElementById('categoryInput').value = video.category;
        document.getElementById('publishedInput').checked = video.is_published;
    } else {
        formTitle.textContent = 'Add New Video';
        document.getElementById('videoForm').reset();
        document.getElementById('videoId').value = '';
    }
    
    modal.style.display = 'flex';
}

async function editVideo(id) {
    const video = await fetchVideoById(id);
    if (video) openVideoForm(video);
}

async function saveVideo() {
    const id = document.getElementById('videoId').value;
    const videoData = {
        title: document.getElementById('videoTitleInput').value,
        description: document.getElementById('videoDescInput').value,
        video_url: document.getElementById('videoUrlInput').value,
        thumbnail_url: document.getElementById('thumbnailUrlInput').value,
        category: document.getElementById('categoryInput').value,
        is_published: document.getElementById('publishedInput').checked
    };
    
    if (supabaseClient) {
        if (id) {
            await supabaseClient.from('videos').update(videoData).eq('id', id);
        } else {
            await supabaseClient.from('videos').insert([videoData]);
        }
    } else {
        if (id) {
            const index = mockVideos.findIndex(v => v.id === id);
            if (index !== -1) mockVideos[index] = { ...mockVideos[index], ...videoData };
        } else {
            videoData.id = Date.now().toString();
            videoData.views = 0;
            videoData.created_at = new Date().toISOString();
            mockVideos.push(videoData);
        }
    }
    
    document.getElementById('videoFormModal').style.display = 'none';
    loadVideosTable();
    loadDashboardStats();
}

async function deleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    if (supabaseClient) {
        await supabaseClient.from('videos').delete().eq('id', id);
    } else {
        const index = mockVideos.findIndex(v => v.id === id);
        if (index !== -1) mockVideos.splice(index, 1);
    }
    
    loadVideosTable();
    loadDashboardStats();
}

async function loadCommentsTable() {
    const comments = await fetchAllComments();
    const videos = await fetchAllVideos();
    const tbody = document.getElementById('commentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = comments.map(comment => {
        const video = videos.find(v => v.id === comment.video_id);
        return `
            <tr>
                <td>${comment.user_name}</td>
                <td>${comment.comment_text}</td>
                <td>${video ? video.title : 'Unknown'}</td>
                <td>${formatDate(comment.created_at)}</td>
                <td>
                    <button class="btn-danger" onclick="deleteComment('${comment.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function deleteComment(id) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    if (supabaseClient) {
        await supabaseClient.from('comments').delete().eq('id', id);
    } else {
        const index = mockComments.findIndex(c => c.id === id);
        if (index !== -1) mockComments.splice(index, 1);
    }
    
    loadCommentsTable();
    loadDashboardStats();
}

async function loadAdsTable() {
    const ads = await fetchAllAds();
    const tbody = document.getElementById('adsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = ads.map(ad => `
        <tr>
            <td><img src="${ad.image_url}" alt="${ad.title}"></td>
            <td>${ad.title}</td>
            <td>${ad.position}</td>
            <td>
                <span class="status-badge ${ad.is_active ? 'status-published' : 'status-draft'}">
                    ${ad.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="editAd('${ad.id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteAd('${ad.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAdForm(ad = null) {
    const modal = document.getElementById('adFormModal');
    const formTitle = document.getElementById('adFormTitle');
    
    if (ad) {
        formTitle.textContent = 'Edit Ad';
        document.getElementById('adId').value = ad.id;
        document.getElementById('adTitleInput').value = ad.title;
        document.getElementById('adImageInput').value = ad.image_url;
        document.getElementById('adLinkInput').value = ad.link_url;
        document.getElementById('adPositionInput').value = ad.position;
        document.getElementById('adActiveInput').checked = ad.is_active;
    } else {
        formTitle.textContent = 'Add New Ad';
        document.getElementById('adForm').reset();
        document.getElementById('adId').value = '';
    }
    
    modal.style.display = 'flex';
}

async function editAd(id) {
    const ads = await fetchAllAds();
    const ad = ads.find(a => a.id === id);
    if (ad) openAdForm(ad);
}

async function saveAd() {
    const id = document.getElementById('adId').value;
    const adData = {
        title: document.getElementById('adTitleInput').value,
        image_url: document.getElementById('adImageInput').value,
        link_url: document.getElementById('adLinkInput').value,
        position: document.getElementById('adPositionInput').value,
        is_active: document.getElementById('adActiveInput').checked
    };
    
    if (supabaseClient) {
        if (id) {
            await supabaseClient.from('ads').update(adData).eq('id', id);
        } else {
            await supabaseClient.from('ads').insert([adData]);
        }
    } else {
        if (id) {
            const index = mockAds.findIndex(a => a.id === id);
            if (index !== -1) mockAds[index] = { ...mockAds[index], ...adData };
        } else {
            adData.id = Date.now().toString();
            adData.created_at = new Date().toISOString();
            mockAds.push(adData);
        }
    }
    
    document.getElementById('adFormModal').style.display = 'none';
    loadAdsTable();
    loadDashboardStats();
}

async function deleteAd(id) {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    
    if (supabaseClient) {
        await supabaseClient.from('ads').delete().eq('id', id);
    } else {
        const index = mockAds.findIndex(a => a.id === id);
        if (index !== -1) mockAds.splice(index, 1);
    }
    
    loadAdsTable();
    loadDashboardStats();
}

// ============================================
// 8. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    
    // Determine which page we're on
    const path = window.location.pathname;
    
    if (path.endsWith('video.html')) {
        loadVideoPage();
    } else if (path.endsWith('admin.html')) {
        loadAdminPage();
    } else {
        // index.html
        loadIndexPage();
        
        // Check if search parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = searchQuery;
                currentSearch = searchQuery;
                fetchPublishedVideos().then(renderVideos);
            }
        }
    }
});
