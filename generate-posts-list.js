// This script runs on your computer (using Node.js), not in the browser.

const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');

const postsDirectory = path.join(__dirname, 'posts');
const outputPath = path.join(__dirname, 'posts.json');

/**
 * A simple function to parse YAML front matter from markdown content.
 * @param {string} fileContent
 * @returns {object|null} - The parsed data or null if no front matter is found.
 */
function parseFrontMatter(fileContent) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n/.exec(fileContent);
    if (!match) {
        return null;
    }

    const frontMatter = match[1];
    const data = {};
    frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            // Trim key and join/trim the value part
            data[key.trim()] = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
        }
    });
    return data;
}

async function generatePostList() {
    try {
        console.log('Searching for markdown files in:', postsDirectory);
        const files = await fs.readdir(postsDirectory);

        // Filter for markdown files
        const markdownFiles = files.filter(file => path.extname(file) === '.md');
        console.log('Found markdown files:', markdownFiles);

        // 1. Read each file and parse its front matter
        let postsData = await Promise.all(
            markdownFiles.map(async (file) => {
                const filePath = path.join(postsDirectory, file);
                const content = await fs.readFile(filePath, 'utf8');
                const frontMatter = parseFrontMatter(content);

                if (!frontMatter || !frontMatter.date || !frontMatter.title) {
                    console.warn(`❗️ Warning: Skipping "${file}" because it's missing 'date' or 'title' in its front matter.`);
                    return null;
                }

                return {
                    filename: file,
                    title: frontMatter.title,
                    date: frontMatter.date,
                };
            })
        );
        
        // Filter out any null entries from files that were skipped
        postsData = postsData.filter(post => post !== null);

        // 2. Sort the posts by date in reverse chronological order (newest first)
        postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 3. Write the sorted list to posts.json
        await fs.writeFile(outputPath, JSON.stringify(postsData, null, 2));
        
        console.log(`✅ Successfully generated posts.json with ${postsData.length} posts, sorted by date.`);

    } catch (err) {
        console.error('❌ Error generating post list:', err);
    }
}

generatePostList();