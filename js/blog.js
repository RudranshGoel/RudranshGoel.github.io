// js/blog.js - SIMPLIFIED AND FIXED

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const postFileName = params.get('post'); // e.g., "first-post"

    const blogContentContainer = document.getElementById('blog-content');
    const pageTitle = document.querySelector('title'); // To set the browser tab title

    if (!postFileName) {
        blogContentContainer.innerHTML = '<p>Error: Blog post not specified. Please go back.</p>';
        return;
    }

    // Construct the path to the markdown file
    const blogPath = `posts/${postFileName}.md`;

    fetch(blogPath)
        .then(response => {
            if (!response.ok) {
                // This will catch the 404 if the file doesn't exist
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            // Use gray-matter's regex to reliably strip front matter
            const contentWithoutFrontMatter = markdown.replace(/^---\s*([\s\S]*?)\s*---\s*/, '');
            
            // The title is now part of the markdown content itself.
            // Let marked.js render the h1/h2 tags from your file.
            blogContentContainer.innerHTML = marked.parse(contentWithoutFrontMatter);
            
            // Optional: Try to find the first heading to set the page title
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = blogContentContainer.innerHTML;
            const firstHeading = tempDiv.querySelector('h1, h2, h3');
            if (firstHeading) {
                pageTitle.textContent = firstHeading.textContent;
            } else {
                pageTitle.textContent = "Blog Post";
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing blog post:', error);
            blogContentContainer.innerHTML = `<p>Sorry, we couldn't load this post. It might not exist. <a href="blogs_page.html">Go back</a>.</p>`;
        });
});