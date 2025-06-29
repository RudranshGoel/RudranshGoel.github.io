const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // We'll use this to get the content easily

const postsDirectory = path.join(__dirname, 'posts');
const outputPath = path.join(__dirname, 'posts.json');

function generatePostList() {
    console.log('Generating post list with previews...');
    const files = fs.readdirSync(postsDirectory);

    const postsData = files
        .filter(file => path.extname(file) === '.md')
        .map(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // gray-matter beautifully separates front matter (data) from the rest (content)
            const { data, content } = matter(fileContent);

            if (!data.date || !data.title) {
                console.warn(`❗️ Warning: Skipping "${file}" due to missing 'date' or 'title'.`);
                return null;
            }

            // --- START OF NEW PREVIEW LOGIC ---
            const previewText = content
                .replace(/^#\s.*$/m, '') // Remove the main H1 title from the content
                .trim() // Remove leading/trailing whitespace
                .split('\n') // Split the content into lines
                .filter(line => line.length > 0) // Filter out any empty lines
                .slice(0, 2) // Take the first 2 non-empty lines
                .join(' ') // Join them together with a space
                + '...'; // Add an ellipsis at the end
            // --- END OF NEW PREVIEW LOGIC ---

            return {
                filename: file,
                title: data.title,
                date: data.date,
                preview: previewText // Add the new preview to our data object
            };
        })
        .filter(post => post !== null);

    postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputPath, JSON.stringify(postsData, null, 2));
    console.log(`✅ Successfully generated posts.json with ${postsData.length} posts.`);
}

generatePostList();