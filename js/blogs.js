// Get the container where posts will be displayed
const postsContainer = document.getElementById('posts-container');

// This is an async function to allow us to use 'await'
async function loadPosts() {
    try {
        // 1. Fetch the list of post filenames from our generated JSON file
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`Failed to load posts.json: ${response.status} ${response.statusText}`);
        }
        const postFiles = await response.json(); // This will be an array of strings like ["post.md", "post2.md"]

        // Clear the "Loading..." message
        postsContainer.innerHTML = '';

        if (postFiles.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        // 2. Loop through each filename in the array
        for (const postFile of postFiles) {
            try {
                // Fetch the content of the markdown file
                const postResponse = await fetch(`posts/${postFile}`);
                if (!postResponse.ok) {
                    // Log an error for the specific file that failed and continue
                    console.error(`Failed to fetch ${postFile}: ${postResponse.status}`);
                    continue; // Skip to the next post
                }
                const markdownText = await postResponse.text();

                // Convert markdown to HTML using the 'marked' library
                const postHtml = marked.parse(markdownText);
                
                // Create a new article element to hold the post
                const article = document.createElement('article');
                article.classList.add('post');

                // Create a title from the filename
                // e.g., "test-post.md" becomes "Test Post"
                const title = postFile
                    .replace('.md', '')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());

                // Populate the article element with the generated title and content
                article.innerHTML = `
                    <h2>${title}</h2>
                    <div class="post-content">
                        ${postHtml}
                    </div>
                `;

                // 3. Append the new article to the container
                postsContainer.appendChild(article);
            } catch (error) {
                console.error(`Error processing file ${postFile}:`, error);
                // Continue to the next post even if one fails
            }
        }
    } catch (error) {
        console.error("Could not load posts:", error);
        postsContainer.innerHTML = '<p>Sorry, there was an error loading the posts.</p>';
    }
}

// Ensure the marked library is loaded before we run our script
// We check if 'marked' is available. If not, we wait for the DOM to be fully loaded.
if (typeof marked === 'undefined') {
    console.warn("Marked.js library not found immediately. Waiting for DOMContentLoaded.");
    document.addEventListener('DOMContentLoaded', loadPosts);
} else {
    loadPosts();
}