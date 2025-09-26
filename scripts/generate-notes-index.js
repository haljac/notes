#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesDir = path.join(__dirname, '..', 'public', 'notes');
const outputPath = path.join(__dirname, '..', 'public', 'notes-index.json');

async function generateNotesIndex() {
    try {
        // Check if notes directory exists
        if (!fs.existsSync(notesDir)) {
            console.log('Notes directory does not exist:', notesDir);
            return;
        }

        // Read all files in the notes directory
        const files = fs.readdirSync(notesDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));

        console.log(`Found ${markdownFiles.length} markdown files:`, markdownFiles);

        // Process each markdown file to extract metadata
        const notesIndex = [];

        for (const filename of markdownFiles) {
            try {
                const filePath = path.join(notesDir, filename);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data: frontmatter } = matter(fileContent);
                
                const slug = filename.replace('.md', '');
                
                // Create note entry with frontmatter data
                const noteEntry = {
                    slug,
                    filename,
                    ...frontmatter,
                    // Add default values if not present in frontmatter
                    title: frontmatter.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    date: frontmatter.date || new Date().toISOString().split('T')[0],
                    excerpt: frontmatter.excerpt || 'No excerpt available.',
                    tags: frontmatter.tags || [],
                    readTime: frontmatter.readTime || '5 min read'
                };

                notesIndex.push(noteEntry);
                console.log(`Processed: ${filename} -> ${noteEntry.title}`);
            } catch (error) {
                console.error(`Error processing ${filename}:`, error.message);
            }
        }

        // Sort by date (newest first)
        notesIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Write the index file
        fs.writeFileSync(outputPath, JSON.stringify(notesIndex, null, 2));
        console.log(`Generated notes index with ${notesIndex.length} entries at:`, outputPath);
        
        return notesIndex;
    } catch (error) {
        console.error('Error generating notes index:', error);
        throw error;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateNotesIndex()
        .then(() => console.log('Notes index generation completed successfully!'))
        .catch((error) => {
            console.error('Failed to generate notes index:', error);
            process.exit(1);
        });
}

export default generateNotesIndex;
