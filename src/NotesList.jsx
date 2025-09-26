import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import matter from 'gray-matter'
import { Buffer } from 'buffer'

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
    window.Buffer = Buffer
}

function NotesList() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Temporary fallback data for testing
        const fallbackNotes = [
            {
                slug: 'on-writing',
                title: 'On Writing',
                date: '2024-01-15',
                author: 'Jack Vincent Hall',
                excerpt: 'Thoughts on the craft of writing and why it matters in our modern world.',
                tags: ['writing', 'creativity', 'thoughts'],
                readTime: '3 min read'
            },
            {
                slug: 'digital-minimalism',
                title: 'Digital Minimalism',
                date: '2024-01-10',
                author: 'Jack Vincent Hall',
                excerpt: 'Notes on reducing digital clutter and finding focus in an always-connected world.',
                tags: ['minimalism', 'technology', 'productivity'],
                readTime: '4 min read'
            },
            {
                slug: 'learning-in-public',
                title: 'Learning in Public',
                date: '2024-01-05',
                author: 'Jack Vincent Hall',
                excerpt: 'The benefits of sharing your learning journey and building in the open.',
                tags: ['learning', 'growth', 'community'],
                readTime: '3 min read'
            }
        ]

        const loadNotes = async () => {
            try {
                console.log('Loading notes...')
                // List of markdown files (in a real app, this would come from a build process or API)
                const noteFiles = ['on-writing', 'digital-minimalism', 'learning-in-public']
                
                const notePromises = noteFiles.map(async (filename) => {
                    try {
                        console.log(`Fetching ${filename}.md...`)
                        const response = await fetch(`/notes/${filename}.md`)
                        console.log(`Response for ${filename}:`, response.status, response.ok)
                        
                        if (!response.ok) {
                            console.log(`Failed to fetch ${filename}, using fallback data`)
                            return fallbackNotes.find(note => note.slug === filename)
                        }
                        
                        const markdownContent = await response.text()
                        console.log(`Content length for ${filename}:`, markdownContent.length)
                        
                        const { data } = matter(markdownContent)
                        console.log(`Parsed data for ${filename}:`, data)
                        
                        return {
                            slug: filename,
                            ...data
                        }
                    } catch (error) {
                        console.error(`Error loading ${filename}:`, error)
                        console.log(`Using fallback data for ${filename}`)
                        return fallbackNotes.find(note => note.slug === filename)
                    }
                })

                const loadedNotes = await Promise.all(notePromises)
                console.log('Loaded notes:', loadedNotes)
                const validNotes = loadedNotes.filter(note => note !== null)
                console.log('Valid notes:', validNotes)
                
                // Sort by date (newest first)
                validNotes.sort((a, b) => new Date(b.date) - new Date(a.date))
                
                setNotes(validNotes)
            } catch (error) {
                console.error('Error loading notes:', error)
                setError(error.message)
                // Use fallback data on error
                setNotes(fallbackNotes)
            } finally {
                setLoading(false)
            }
        }

        loadNotes()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <header className="mb-12">
                    <h2 className="text-2xl font-light text-gray-900 mb-2">Notes</h2>
                    <p className="text-gray-600">A collection of thoughts and observations</p>
                </header>
                <div className="text-center py-8">
                    <div className="text-gray-500">Loading notes...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header className="mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-2">Notes</h2>
                <p className="text-gray-600">A collection of thoughts and observations</p>
            </header>
            
            <div className="space-y-6">
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500">Error loading notes: {error}</p>
                    </div>
                )}
                {notes.length === 0 && !error ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No notes found.</p>
                    </div>
                ) : (
                    notes.map(note => {
                        const formattedDate = new Date(note.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        
                        return (
                            <article key={note.slug}>
                                <Link 
                                    to={`/notes/${note.slug}`}
                                    className="block group cursor-pointer"
                                >
                                    <div className="border-b border-gray-100 pb-6 group-hover:border-gray-200 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                                                {note.title}
                                            </h3>
                                            <time className="text-sm text-gray-500">{formattedDate}</time>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{note.excerpt}</p>
                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {note.tags.slice(0, 3).map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </article>
                        )
                    })
                )}
            </div>
        </div>
    );
}

export default NotesList;
