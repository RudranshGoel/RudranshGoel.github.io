document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the blog file name from the URL query parameter (e.g., ?post=new-blog)
    const params = new URLSearchParams(window.location.search);
    const blogFile = params.get('post');

    // Find the elements where we will display the content
    const blogTitleContainer = document.getElementById('blog-title');
    const blogContentContainer = document.getElementById('blog-content');
    const pageTitle = document.querySelector('title');

    if (!blogFile) {
        blogContentContainer.innerHTML = '<p>Error: Blog post not found. Please go back to the blogs list.</p>';
        return;
    }

    // 2. Construct the path to the markdown file
    const blogPath = `../posts/${blogFile}.md`;

    // 3. Fetch the markdown file content
    fetch(blogPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            // 4. Separate the title from the rest of the content
            // We'll assume the first line of the .md file is the title
            const lines = markdown.split('\n');
            const title = lines.shift(); 
            const content = lines.join('\n');

            // 5. Convert Markdown to HTML using the 'marked' library and display it
            blogTitleContainer.innerHTML = marked.parse(title);
            blogContentContainer.innerHTML = marked.parse(content);
            
            // Optional: Set the browser tab title to the blog's title
            pageTitle.textContent = title.replace(/<[^>]*>?/gm, '').replace('#',''); 
        })
        .catch(error => {
            console.error('Error fetching or parsing blog:', error);
            blogContentContainer.innerHTML = `<p>Sorry, we couldn't load this blog. It might not exist. <a href="blogs.html">Go back</a>.</p>`;
        });
});