// js/blogs_page.js - EFFICIENT AND FIXED

async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    try {
        // Fetch the pre-sorted list of post metadata
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`Failed to load posts.json: ${response.statusText}`);
        }
        const postsMetadata = await response.json();

        postsContainer.innerHTML = ''; // Clear "Loading..."

        if (postsMetadata.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        // Just loop through the metadata and create the links. No need to fetch content here!
        postsMetadata.forEach(meta => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item');

            const fileNameWithoutExt = meta.filename.replace('.md', '');
            const postDate = new Date(meta.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            postElement.innerHTML = `
                <div class="post-item-header">
                    <a href="blog.html?post=${fileNameWithoutExt}" class="title-link">${meta.title}</a>
                    <p class="post-item-date">${postDate}</p>
                    <p class="preview-text">${meta.preview}</p>                    
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error("Could not load posts list:", error);
        postsContainer.innerHTML = '<p>Sorry, there was an error loading the blog list.</p>';
    }
}

loadPosts();