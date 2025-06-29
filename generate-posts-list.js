const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, 'posts');
const outputDirectory = __dirname; // Write JSON files to the root directory

function generatePostLists() {
    console.log('Generating categorized post lists...');
    
    // 1. Define the sections your website will have.
    const postsBySection = {
        blogs: [],
        memoirs: [],
        pastimes: [],
        career: []
    };

    const allFiles = fs.readdirSync(postsDirectory);

    // 2. Read every markdown file and sort it into the correct section.
    allFiles
        .filter(file => path.extname(file) === '.md')
        .forEach(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContent);

            // Validation: Ensure each post has the required front matter.
            if (!data.date || !data.title || !data.section) {
                console.warn(`❗️ Warning: Skipping "${file}" due to missing 'date', 'title', or 'section'.`);
                return;
            }
            if (!postsBySection.hasOwnProperty(data.section)) {
                console.warn(`❗️ Warning: Skipping "${file}" due to invalid section: "${data.section}". Valid sections are: ${Object.keys(postsBySection).join(', ')}`);
                return;
            }

            // Preview Generation Logic (Unchanged)
            const plainText = content
                .replace(/^#\s.*$/m, '')
                .replace(/(\r\n|\n|\r)/gm, " ")
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                .replace(/[#*_~`>]/g, "")
                .trim();
            const previewText = plainText.split(/\s+/).slice(0, 30).join(' ') + '...';

            const postMetadata = {
                filename: file,
                title: data.title,
                date: data.date,
                preview: previewText
            };
            
            // Add the post metadata to the correct section array.
            postsBySection[data.section].push(postMetadata);
        });

    // 3. Create a separate, sorted JSON file for each category.
    for (const section in postsBySection) {
        const sectionPosts = postsBySection[section];
        
        // Sort posts within this section by date (newest first).
        sectionPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const outputPath = path.join(outputDirectory, `${section}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(sectionPosts, null, 2));

        console.log(`✅ Successfully generated ${section}.json with ${sectionPosts.length} posts.`);
    }

    // 4. Create one master list of ALL posts for the homepage.
    let allPosts = [];
    for (const section in postsBySection) {
        postsBySection[section].forEach(post => {
            const sectionName = section.charAt(0).toUpperCase() + section.slice(1); // "blogs" -> "Blogs"
            let sectionLink = `${section}.html`;
            if (section === 'blogs') {
                sectionLink = 'blogs_page.html'; // Handle special filename for blogs page
            }
            allPosts.push({ ...post, sectionName, sectionLink });
        });
    }

    // Sort the master list by date to find the most recent posts overall.
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const allPostsPath = path.join(outputDirectory, 'all_posts.json');
    fs.writeFileSync(allPostsPath, JSON.stringify(allPosts, null, 2));
    console.log(`✅ Successfully generated all_posts.json with ${allPosts.length} total posts.`);
}

generatePostLists();