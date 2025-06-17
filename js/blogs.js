// Get the container where posts will be displayed
const postsContainer = document.getElementById('posts-container');

// This is an async function to allow us to use 'await'
async function loadPosts() {
    try {
        // 1. Fetch the list of post filenames from our generated JSON file
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const postFiles = await response.json();

        // Clear the "Loading..." message
        postsContainer.innerHTML = '';

        if (postFiles.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        // 2. Loop through each post filename
        for (const postFile of postFiles) {
            // Fetch the content of the markdown file
            const postResponse = await fetch(`posts/${postFile}`);
            const markdownText = await postResponse.text();

            // Convert markdown to HTML using the 'marked' library
            const postHtml = marked.parse(markdownText);
            
            // Create a new article element to hold the post
            const article = document.createElement('article');
            article.classList.add('post');

            // Create a title from the filename
            // e.g., "my-first-post.md" becomes "My First Post"
            const title = postFile
                .replace('.md', '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());

            // Populate the article element
            article.innerHTML = `
                <h2 class = "title-link"> ${title} </h2>
                <div class="preview-text">
                    ${postHtml}
                </div>
            `;

            // 3. Append the new article to the container
            postsContainer.appendChild(article);
        }
    } catch (error) {
        console.error("Could not load posts:", error);
        postsContainer.innerHTML = '<p>Sorry, there was an error loading the posts.</p>';
    }
}

// Initial call to load the posts when the page loads
loadPosts();