const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, 'posts');
const outputPath = path.join(__dirname, 'posts.json');

function generatePostList() {
    console.log('Generating post list with 30-word previews...');
    const files = fs.readdirSync(postsDirectory);

    const postsData = files
        .filter(file => path.extname(file) === '.md')
        .map(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            const { data, content } = matter(fileContent);

            if (!data.date || !data.title) {
                console.warn(`❗️ Warning: Skipping "${file}" due to missing 'date' or 'title'.`);
                return null;
            }

            // --- START OF NEW "BY WORD" PREVIEW LOGIC ---
            // 1. Clean up the markdown content to get something closer to plain text.
            const plainText = content
                .replace(/^#\s.*$/m, '') // Remove H1 title
                .replace(/(\r\n|\n|\r)/gm, " ") // Replace newlines with spaces
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep only the text from links
                .replace(/[#*_~`>]/g, "") // Remove common markdown symbols
                .trim();

            // 2. Split the plain text by spaces, take the first 30 words, and join them back.
            const previewText = plainText
                .split(/\s+/) // Split by one or more spaces (robust)
                .slice(0, 30) // Take the first 30 elements (words)
                .join(' ')    // Join them back with a single space
                + '...';      // Add an ellipsis
            // --- END OF NEW "BY WORD" PREVIEW LOGIC ---

            return {
                filename: file,
                title: data.title,
                date: data.date,
                preview: previewText // The preview is now based on word count
            };
        })
        .filter(post => post !== null);

    postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputPath, JSON.stringify(postsData, null, 2));
    console.log(`✅ Successfully generated posts.json with ${postsData.length} posts.`);
}

generatePostList();