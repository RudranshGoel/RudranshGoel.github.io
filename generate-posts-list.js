// This script runs on your computer (using Node.js), not in the browser.

const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(__dirname, 'posts');

console.log('Searching for markdown files in:', postsDirectory);

// Read all filenames in the 'posts' directory
fs.readdir(postsDirectory, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory:', err);
    }

    // Filter the list to only include markdown (.md) files
    const markdownFiles = files.filter(file => path.extname(file) === '.md');

    console.log('Found markdown files:', markdownFiles);

    // Create the path for the output JSON file
    const outputPath = path.join(__dirname, 'posts.json');
    
    // Write the array of filenames to posts.json
    fs.writeFile(outputPath, JSON.stringify(markdownFiles, null, 2), err => {
        if (err) {
            return console.error('Error writing JSON file:', err);
        }
        console.log('Successfully generated posts.json!');
    });
});