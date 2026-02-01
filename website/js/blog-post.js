// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get('id'));

// Load posts from localStorage
function loadPosts() {
    const stored = localStorage.getItem('vaultsio_blog_posts');
    return stored ? JSON.parse(stored) : [];
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get category class
function getCategoryClass(category) {
    return `category-${category}`;
}

// Display the post
function displayPost(post) {
    // Update page title
    document.title = `${post.title} - VaultSio Blog`;
    document.getElementById('postTitle').textContent = `${post.title} - VaultSio Blog`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
    }
    
    // Update post content
    document.getElementById('postCategory').textContent = post.category;
    document.getElementById('postCategory').className = `post-category ${getCategoryClass(post.category)}`;
    document.getElementById('postTitleMain').textContent = post.title;
    document.getElementById('postAuthor').textContent = post.author;
    document.getElementById('postDate').textContent = formatDate(post.date);
    document.getElementById('postReadTime').textContent = post.readTime;
    
    // Update featured image
    const imageContainer = document.getElementById('postImageContainer');
    const postImage = document.getElementById('postImage');
    if (post.image && post.image !== 'assets/images/logo.svg') {
        postImage.src = post.image;
        postImage.alt = post.title;
    } else {
        imageContainer.style.display = 'none';
    }
    
    // Update post body
    document.getElementById('postBody').innerHTML = post.content;
    
    // Update tags
    const tagsContainer = document.getElementById('postTags');
    tagsContainer.innerHTML = post.tags.map(tag => 
        `<a href="blog.html?search=${tag}" class="tag">#${tag}</a>`
    ).join('');
    
    // Set up share buttons
    setupShareButtons(post);
    
    // Display related posts
    displayRelatedPosts(post);
    
    // Show content, hide loading
    document.getElementById('loadingPost').style.display = 'none';
    document.getElementById('postContent').style.display = 'block';
}

// Setup share buttons
function setupShareButtons(post) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);
    
    // Twitter
    document.getElementById('shareTwitter').href = 
        `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    
    // Facebook
    document.getElementById('shareFacebook').href = 
        `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    // LinkedIn
    document.getElementById('shareLinkedin').href = 
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    
    // Copy link
    document.getElementById('shareCopy').addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
            const btn = e.currentTarget;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        });
    });
}

// Display related posts
function displayRelatedPosts(currentPost) {
    const posts = loadPosts();
    
    // Find related posts (same category, excluding current post)
    const relatedPosts = posts
        .filter(post => 
            post.id !== currentPost.id && 
            (post.category === currentPost.category || 
             post.tags.some(tag => currentPost.tags.includes(tag)))
        )
        .slice(0, 3);
    
    if (relatedPosts.length > 0) {
        const relatedPostsSection = document.getElementById('relatedPostsSection');
        const relatedPostsGrid = document.getElementById('relatedPosts');
        
        relatedPostsGrid.innerHTML = relatedPosts.map(post => `
            <article class="blog-card">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}">
                    <div class="blog-card-category ${getCategoryClass(post.category)}">
                        ${post.category}
                    </div>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt.substring(0, 100)}...</p>
                    <div class="blog-card-footer">
                        <a href="blog-post.html?id=${post.id}" class="read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
        
        relatedPostsSection.style.display = 'block';
    }
}

// Show error
function showError() {
    document.getElementById('loadingPost').style.display = 'none';
    document.getElementById('errorPost').style.display = 'block';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!postId) {
        showError();
        return;
    }
    
    const posts = loadPosts();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        displayPost(post);
    } else {
        showError();
    }
});

// Smooth scroll for back button
document.addEventListener('click', (e) => {
    if (e.target.closest('.back-button')) {
        e.preventDefault();
        window.location.href = 'blog.html';
    }
});
