// js/category_page.js - REUSABLE SCRIPT FOR ALL CATEGORY PAGES

async function loadCategorizedPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    // Read the category from the data attribute on the container element.
    const category = postsContainer.dataset.category;

    if (!category) {
        console.error("Error: 'data-category' attribute not set on #posts-container.");
        postsContainer.innerHTML = '<p>Page configuration error. Cannot determine which posts to load.</p>';
        return;
    }

    // Dynamically construct the path to the correct JSON file (e.g., "blogs.json").
    const jsonPath = `${category}.json`;

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${jsonPath}: ${response.statusText}`);
        }
        const postsMetadata = await response.json();

        postsContainer.innerHTML = ''; // Clear "Loading..."

        if (postsMetadata.length === 0) {
            postsContainer.innerHTML = '<p>No posts found in this category yet.</p>';
            return;
        }

        // Loop through the metadata and create the post links.
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
        console.error(`Could not load posts for category "${category}":`, error);
        postsContainer.innerHTML = `<p>Sorry, there was an error loading the post list for this category.</p>`;
    }
}

loadCategorizedPosts();