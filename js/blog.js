document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const blogFile = params.get('post');

    const blogTitleContainer = document.getElementById('blog-title');
    const blogContentContainer = document.getElementById('blog-content');
    const pageTitle = document.querySelector('title');

    if (!blogFile) {
        blogContentContainer.innerHTML = '<p>Error: Blog post not found. Please go back to the blogs list.</p>';
        return;
    }

    // FIX #1: Corrected the path. Removed the '../'
    const blogPath = `posts/${blogFile}.md`;

    fetch(blogPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            // FIX #2: Handle front matter before splitting content
            const contentWithoutFrontMatter = markdown.replace(/^---\s*([\s\S]*?)\s*---\s*/, '');

            const lines = contentWithoutFrontMatter.trim().split('\n');
            const title = lines.shift(); // Now this correctly gets the first line AFTER the front matter
            const content = lines.join('\n');

            blogTitleContainer.innerHTML = marked.parse(title);
            blogContentContainer.innerHTML = marked.parse(content);
            
            pageTitle.textContent = title.replace(/<[^>]*>?/gm, '').replace('#','').trim(); 
        })
        .catch(error => {
            console.error('Error fetching or parsing blog:', error);
            blogContentContainer.innerHTML = `<p>Sorry, we couldn't load this blog. It might not exist. <a href="blogs.html">Go back</a>.</p>`;
        });
});