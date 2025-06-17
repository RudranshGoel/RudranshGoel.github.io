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
        const postFiles = await response.json();

        // Clear the "Loading..." message
        postsContainer.innerHTML = '';

        if (postFiles.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        // 2. Create an array of promises, one for each post
        const postPromises = postFiles.map(async (postFile) => {
            try {
                const postResponse = await fetch(`posts/${postFile}`);
                if (!postResponse.ok) {
                    // Log an error for the specific file that failed
                    console.error(`Failed to fetch ${postFile}: ${postResponse.status}`);
                    // Return null so we can filter it out later
                    return null;
                }
                const markdownText = await postResponse.text();
                
                // Create a title from the filename
                const title = postFile
                    .replace('.md', '')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());

                // Convert markdown to HTML using the 'marked' library
                const contentHtml = marked.parse(markdownText);

                // Return a structured object for this post
                return {
                    title: title,
                    html: contentHtml
                };
            } catch (error) {
                console.error(`Error processing file ${postFile}:`, error);
                return null; // Return null on error
            }
        });

        // 3. Wait for all the fetch promises to resolve
        const posts = await Promise.all(postPromises);

        // 4. Loop through the resolved posts and render them
        posts.forEach(post => {
            // Check if the post was loaded successfully (not null)
            if (post) {
                const postElement = document.createElement('div');
                postElement.classList.add('latest-item');
                postElement.innerHTML = `
                <div class="latest-content">
                    <div class="latest-item-header">
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