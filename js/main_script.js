// js/main_script.js - DYNAMIC HOMEPAGE SCRIPT

async function loadLatestPosts() {
    const latestContainer = document.getElementById('latest-container');
    if (!latestContainer) return;

    try {
        const response = await fetch('all_posts.json');
        if (!response.ok) {
            throw new Error(`Failed to load all_posts.json: ${response.statusText}`);
        }
        const allPosts = await response.json();

        // Take the 3 most recent posts from the sorted list.
        const postsToShow = allPosts.slice(0, 3);

        latestContainer.innerHTML = ''; // Clear any fallback content

        if (postsToShow.length === 0) {
            latestContainer.innerHTML = '<p>No posts available yet. Check back soon!</p>';
            return;
        }

        postsToShow.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('latest-item');
            
            const fileNameWithoutExt = post.filename.replace('.md', '');
            const postLink = `blog.html?post=${fileNameWithoutExt}`;
            
            // Note: The 'image' property is not included by default.
            // To use it, add `image: "path/to/image.jpg"` to your markdown front matter
            // and ensure `generate-posts-list.js` passes it to the JSON file.

            postElement.innerHTML = `
                <div class="latest-content">
                    <div class="latest-item-header">
                        <a href="${postLink}" class="title-link">${post.title}</a>
                        •
                        <a href="${post.sectionLink}" class="section-link">(${post.sectionName})</a>
                    </div>
                    <p class="preview-text">${post.preview}</p>
                </div>
            `;
            
            latestContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error("Could not load latest posts for homepage:", error);
        latestContainer.innerHTML = '<p>Sorry, could not load the latest updates.</p>';
    }
}

// Wait for the page to load before running the script
document.addEventListener('DOMContentLoaded', loadLatestPosts);