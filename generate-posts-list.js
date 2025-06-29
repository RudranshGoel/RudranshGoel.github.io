// generate-posts-list.js - UPGRADED

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Use the standard library

const postsDirectory = path.join(__dirname, 'posts');
const outputPath = path.join(__dirname, 'posts.json');

function generatePostList() {
    console.log('Searching for markdown files in:', postsDirectory);
    const files = fs.readdirSync(postsDirectory);

    const markdownFiles = files.filter(file => path.extname(file) === '.md');
    console.log('Found markdown files:', markdownFiles);

    let postsData = markdownFiles.map(file => {
        const filePath = path.join(postsDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content); // Use gray-matter to parse

        if (!data.date || !data.title) {
            console.warn(`❗️ Warning: Skipping "${file}" due to missing 'date' or 'title'.`);
            return null;
        }

        return { filename: file, title: data.title, date: data.date };
    }).filter(post => post !== null);

    postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputPath, JSON.stringify(postsData, null, 2));
    console.log(`✅ Successfully generated posts.json with ${postsData.length} posts.`);
}

generatePostList();