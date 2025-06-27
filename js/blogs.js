// Get the container where posts will be displayed
const postsContainer = document.getElementById('posts-container');

// This is an async function to allow us to use 'await'
async function loadPosts() {
    try {
        // 1. Fetch the list of post METADATA from our generated JSON file.
        // This file is now pre-sorted by date from our build script.
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`Failed to load posts.json: ${response.status} ${response.statusText}`);
        }
        const postsMetadata = await response.json();

        // Clear the "Loading..." message
        postsContainer.innerHTML = '';

        if (postsMetadata.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        // 2. Create an array of promises to fetch the content for each post
        const postPromises = postsMetadata.map(async (meta) => {
            try {
                const postResponse = await fetch(`posts/${meta.filename}`);
                if (!postResponse.ok) {
                    console.error(`Failed to fetch ${meta.filename}: ${postResponse.status}`);
                    return null; // Skip this post on error
                }
                let markdownText = await postResponse.text();
                
                // IMPORTANT: Strip the front matter from the markdown before rendering
                // so it doesn't appear in the post's preview.
                const contentWithoutFrontMatter = markdownText.replace(/^---\s*([\s\S]*?)\s*---\s*/, '');

                // Convert the remaining markdown to HTML
                const contentHtml = marked.parse(contentWithoutFrontMatter);

                // Return a structured object for this post using data from the metadata
                return {
                    title: meta.title, // Use the title from front matter
                    html: contentHtml,
                    postLink: `#${meta.filename.replace('.md', '')}` // Example link
                };
            } catch (error) {
                console.error(`Error processing file ${meta.filename}:`, error);
                return null; // Return null on error
            }
        });

        // 3. Wait for all the fetch promises to resolve
        const posts = await Promise.all(postPromises);

        // 4. Loop through the resolved posts and render them.
        // They are already in the correct (reverse chronological) order.
        posts.forEach(post => {
            if (post) { // Check if the post was loaded successfully
                const postElement = document.createElement('div');
                postElement.classList.add('post-item');
                postElement.innerHTML = `
                <div class="post-content">
                    <div class="post-item-header">
                        <a href="${post.postLink}" class="title-link">${post.title}</a>
                    </div>
                    <p class="preview-text">${post.html}</p>
                </div>
                `;
                postsContainer.appendChild(postElement);
            }
        });

    } catch (error) {
        console.error("Could not load posts:", error);
        postsContainer.innerHTML = '<p>Sorry, there was an error loading the posts.</p>';
    }
}

// Initial call to load the posts when the page loads
loadPosts();