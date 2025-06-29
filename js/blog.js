// js/blog.js - SIMPLIFIED AND FIXED

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW DYNAMIC BACK BUTTON LOGIC ---
    const backButton = document.getElementById('go-back-link');

    if (backButton) {
        backButton.addEventListener('click', function(event) {
            // Prevent the link from navigating to its default href
            event.preventDefault();

            // Check if the user came from another page on the same site.
            // document.referrer shows the URL of the page that linked to this one.
            // If it's empty, the user likely navigated here directly.
            if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
                // If the referrer is from our site, use the browser's history to go back.
                // This preserves the user's scroll position on the previous page.
                history.back();
            } else {
                // If the user came from an external site or navigated directly,
                // send them to the main blog page as a safe fallback.
                window.location.href = 'blogs_page.html';
            }
        });
    }
    // --- END OF NEW LOGIC ---


    // The rest of your existing code remains the same...
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
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            const contentWithoutFrontMatter = markdown.replace(/^---\s*([\s\S]*?)\s*---\s*/, '');
            blogContentContainer.innerHTML = marked.parse(contentWithoutFrontMatter);
            
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