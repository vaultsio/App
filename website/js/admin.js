// Check authentication on page load
if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

// Load posts from localStorage
function loadPosts() {
    const stored = localStorage.getItem('vaultsio_blog_posts');
    return stored ? JSON.parse(stored) : [];
}

// Save posts to localStorage
function savePosts(posts) {
    localStorage.setItem('vaultsio_blog_posts', JSON.stringify(posts));
}

// Current state
let currentSection = 'posts';
let editingPostId = null;
let deletePostId = null;
let currentFilter = {
    category: 'all',
    sort: 'newest',
    search: ''
};

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.add('active');
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    
    currentSection = section;
    
    // Load data for section
    if (section === 'posts') {
        loadPostsTable();
    } else if (section === 'categories') {
        loadCategoryStats();
    } else if (section === 'stats') {
        loadStatistics();
    } else if (section === 'new-post') {
        if (editingPostId === null) {
            resetPostForm();
        }
    }
}

// Load posts table
function loadPostsTable() {
    let posts = loadPosts();
    
    // Apply filters
    if (currentFilter.category !== 'all') {
        posts = posts.filter(post => post.category === currentFilter.category);
    }
    
    if (currentFilter.search) {
        const search = currentFilter.search.toLowerCase();
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(search) ||
            post.excerpt.toLowerCase().includes(search) ||
            post.author.toLowerCase().includes(search) ||
            post.tags.some(tag => tag.toLowerCase().includes(search))
        );
    }
    
    // Apply sorting
    if (currentFilter.sort === 'newest') {
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentFilter.sort === 'oldest') {
        posts.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (currentFilter.sort === 'title') {
        posts.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Update posts count
    document.getElementById('postsCount').textContent = loadPosts().length;
    
    // Display posts
    const tbody = document.getElementById('postsTableBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.querySelector('.posts-table-container');
    
    if (posts.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';
        
        tbody.innerHTML = posts.map(post => `
            <tr>
                <td class="post-title-cell">${post.title}</td>
                <td>
                    <span class="post-category-badge ${post.category}">${post.category}</span>
                </td>
                <td>${post.author}</td>
                <td>${formatDate(post.date)}</td>
                <td>
                    <div class="post-tags">
                        ${post.tags.slice(0, 2).map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                        ${post.tags.length > 2 ? `<span class="post-tag">+${post.tags.length - 2}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div class="post-actions">
                        <button class="action-btn edit" onclick="editPost(${post.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="openDeleteModal(${post.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Edit post
function editPost(id) {
    const posts = loadPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) return;
    
    editingPostId = id;
    
    // Update form title
    document.getElementById('postFormTitle').textContent = 'Edit Post';
    document.getElementById('postFormSubtitle').textContent = 'Update your blog post';
    document.getElementById('saveButtonText').textContent = 'Update Post';
    
    // Fill form
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitleInput').value = post.title;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postContentInput').value = post.content;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postAuthor').value = post.author;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postReadTime').value = post.readTime;
    document.getElementById('postImage').value = post.image || '';
    document.getElementById('postTags').value = post.tags.join(', ');
    
    // Update preview
    updatePreview();
    
    // Show form
    showSection('new-post');
}

// Delete post
function openDeleteModal(id) {
    const posts = loadPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) return;
    
    deletePostId = id;
    document.querySelector('.delete-post-title').textContent = post.title;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    deletePostId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

function confirmDelete() {
    if (!deletePostId) return;
    
    let posts = loadPosts();
    posts = posts.filter(p => p.id !== deletePostId);
    savePosts(posts);
    
    closeDeleteModal();
    loadPostsTable();
    showToast('Post deleted successfully');
}

// Save post
function savePost() {
    // Get form values
    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitleInput').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContentInput').value.trim();
    const category = document.getElementById('postCategory').value;
    const author = document.getElementById('postAuthor').value.trim();
    const date = document.getElementById('postDate').value;
    const readTime = document.getElementById('postReadTime').value.trim();
    const image = document.getElementById('postImage').value.trim() || 'assets/images/logo.svg';
    const tagsInput = document.getElementById('postTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
    
    // Validate
    if (!title || !excerpt || !content || !category || !author || !date || !readTime) {
        alert('Please fill in all required fields');
        return;
    }
    
    let posts = loadPosts();
    
    if (id) {
        // Update existing post
        const index = posts.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                title,
                excerpt,
                content,
                category,
                author,
                date,
                readTime,
                image,
                tags
            };
        }
        showToast('Post updated successfully');
    } else {
        // Create new post
        const newPost = {
            id: Date.now(),
            title,
            excerpt,
            content,
            category,
            author,
            date,
            readTime,
            image,
            tags
        };
        posts.push(newPost);
        showToast('Post published successfully');
    }
    
    savePosts(posts);
    resetPostForm();
    showSection('posts');
}

// Reset form
function resetPostForm() {
    editingPostId = null;
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('postFormTitle').textContent = 'Create New Post';
    document.getElementById('postFormSubtitle').textContent = 'Write and publish your blog post';
    document.getElementById('saveButtonText').textContent = 'Publish Post';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('postDate').value = today;
    
    updatePreview();
}

// Update preview
function updatePreview() {
    const title = document.getElementById('postTitleInput').value || 'Post Title';
    const excerpt = document.getElementById('postExcerpt').value || 'Post excerpt will appear here...';
    const category = document.getElementById('postCategory').value || 'updates';
    const author = document.getElementById('postAuthor').value || 'Author';
    const date = document.getElementById('postDate').value;
    const readTime = document.getElementById('postReadTime').value || '5 min read';
    
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewExcerpt').textContent = excerpt;
    document.getElementById('previewCategory').textContent = category;
    document.getElementById('previewAuthor').textContent = author;
    document.getElementById('previewDate').textContent = date ? formatDate(date) : 'Date';
    document.getElementById('previewReadTime').textContent = readTime;
    
    // Update category styling
    const categoryColors = {
        updates: 'rgba(99, 102, 241, 0.9)',
        tips: 'rgba(20, 184, 166, 0.9)',
        guides: 'rgba(236, 72, 153, 0.9)',
        features: 'rgba(245, 158, 11, 0.9)'
    };
    document.getElementById('previewCategory').style.backgroundColor = categoryColors[category];
}

// Insert HTML helper for editor
function insertHTML(openTag, closeTag) {
    const textarea = document.getElementById('postContentInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + openTag + selectedText + closeTag + text.substring(end);
    textarea.value = newText;
    
    // Set cursor position
    const newCursorPos = start + openTag.length + selectedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

// Load category stats
function loadCategoryStats() {
    const posts = loadPosts();
    const counts = {
        updates: 0,
        tips: 0,
        guides: 0,
        features: 0
    };
    
    posts.forEach(post => {
        counts[post.category]++;
    });
    
    document.getElementById('updatesCount').textContent = `${counts.updates} post${counts.updates !== 1 ? 's' : ''}`;
    document.getElementById('tipsCount').textContent = `${counts.tips} post${counts.tips !== 1 ? 's' : ''}`;
    document.getElementById('guidesCount').textContent = `${counts.guides} post${counts.guides !== 1 ? 's' : ''}`;
    document.getElementById('featuresCount').textContent = `${counts.features} post${counts.features !== 1 ? 's' : ''}`;
}

// Load statistics
function loadStatistics() {
    const posts = loadPosts();
    
    // Total posts
    document.getElementById('totalPosts').textContent = posts.length;
    
    // Posts this month
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const recentPosts = posts.filter(post => {
        const postDate = new Date(post.date);
        return postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear;
    });
    document.getElementById('recentPosts').textContent = recentPosts.length;
    
    // Total tags
    const allTags = new Set();
    posts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));
    document.getElementById('totalTags').textContent = allTags.size;
    
    // Average read time
    const totalMinutes = posts.reduce((sum, post) => {
        const match = post.readTime.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
    const avgMinutes = posts.length > 0 ? Math.round(totalMinutes / posts.length) : 0;
    document.getElementById('avgReadTime').textContent = `${avgMinutes} min`;
    
    // Recent activity
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivity = document.getElementById('recentActivity');
    
    if (sortedPosts.length === 0) {
        recentActivity.innerHTML = '<p style="color: var(--gray); text-align: center; padding: var(--spacing-lg);">No activity yet</p>';
    } else {
        recentActivity.innerHTML = sortedPosts.slice(0, 5).map(post => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="activity-content">
                    <p>${post.title}</p>
                    <small>Published on ${formatDate(post.date)}</small>
                </div>
            </div>
        `).join('');
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('successToast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.dataset.section;
            showSection(section);
        });
    });
    
    // Filters
    document.getElementById('adminCategoryFilter').addEventListener('change', (e) => {
        currentFilter.category = e.target.value;
        loadPostsTable();
    });
    
    document.getElementById('adminSortFilter').addEventListener('change', (e) => {
        currentFilter.sort = e.target.value;
        loadPostsTable();
    });
    
    document.getElementById('adminSearch').addEventListener('input', (e) => {
        currentFilter.search = e.target.value;
        loadPostsTable();
    });
    
    // Form inputs - update preview
    ['postTitleInput', 'postExcerpt', 'postCategory', 'postAuthor', 'postDate', 'postReadTime'].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });
    
    // Close modal on background click
    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') {
            closeDeleteModal();
        }
    });
    
    // Initialize
    showSection('posts');
    
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('postDate').value = today;
});
