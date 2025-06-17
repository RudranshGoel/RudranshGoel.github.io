// Wait for the page to load before running the script
document.addEventListener('DOMContentLoaded', function() {

    // --- YOUR CONTENT GOES HERE ---
    // This is an array of all your posts.
    // To add a new post, just copy one of the blocks and change the details.
    const posts = [
        {
            title: "My First Blog Post",
            sectionName: "Blogs",
            sectionLink: "blogs.html", // Link to the section page
            postLink: "blogs.html#post1", // A link to the specific post (using an anchor)
            preview: "This is a preview of my very first blog post where I talk about setting up this website...",
            image: "images/latest-post-image.jpg" // Path to image, or leave as "" for no image
        },
        {
            title: "Summer Internship Experience",
            sectionName: "memoirs",
            sectionLink: "memoirs.html",
            postLink: "memoirs.html#summer-intern",
            preview: "I spent the summer working as a software developer intern. Here are my key takeaways...",
            image: "" // No image for this one
        },
        {
            title: "New Goal: Learn Python",
            sectionName: "Goals/Projects",
            sectionLink: "goals.html",
            postLink: "goals.html#python-goal",
            preview: "I've decided to start learning Python for data science. I'll be tracking my progress here.",
            image: ""
        }
    ];

    // --- THE CODE THAT BUILDS THE PAGE ---
    // (You don't need to change anything below this line)
    const latestContainer = document.getElementById('latest-container');

    if (latestContainer) {
        // Clear the container first
        latestContainer.innerHTML = '';

        // Loop through each post and create the HTML for it
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('latest-item');

            // Conditionally add the image part only if an image URL is provided
            const imageHtml = post.image 
                ? `<div class="latest-item-image"><img src="${post.image}" alt="${post.title}"></div>` 
                : '';

            postElement.innerHTML = `
                <div class="latest-content">
                    <div class="latest-item-header">
                        <a href="${post.postLink}" class="title-link">${post.title}</a>
                        •
                        <a href="${post.sectionLink}" class="section-link">(${post.sectionName})</a>
                    </div>
                    <p class="preview-text">${post.preview}</p>
                </div>
                ${imageHtml}
            `;
            
            latestContainer.appendChild(postElement);
        });
    }
});
