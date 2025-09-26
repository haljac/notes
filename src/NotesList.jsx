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
        const loadNotes = async () => {
            try {
                console.log('Loading notes from index...')
                
                // First, try to load the notes index
                const indexResponse = await fetch('/notes-index.json')
                if (!indexResponse.ok) {
                    throw new Error('Could not load notes index')
                }
                
                const notesIndex = await indexResponse.json()
                console.log('Loaded notes index:', notesIndex)
                
                if (!Array.isArray(notesIndex) || notesIndex.length === 0) {
                    throw new Error('Notes index is empty or invalid')
                }
                
                // The index already contains all the metadata we need
                // Sort by date (newest first) - the index should already be sorted, but just in case
                notesIndex.sort((a, b) => new Date(b.date) - new Date(a.date))
                
                setNotes(notesIndex)
                console.log(`Successfully loaded ${notesIndex.length} notes from index`)
                
            } catch (error) {
                console.error('Error loading notes:', error)
                setError(error.message)
                
                // Fallback: try to load notes dynamically if index fails
                console.log('Falling back to dynamic discovery...')
                await loadNotesWithFallback()
            } finally {
                setLoading(false)
            }
        }
        
        const loadNotesWithFallback = async () => {
            try {
                // Attempt to discover notes by trying common patterns
                const potentialSlugs = ['pain-and-pleasure', 'on-writing', 'digital-minimalism', 'learning-in-public']
                const foundNotes = []
                
                for (const slug of potentialSlugs) {
                    try {
                        const response = await fetch(`/notes/${slug}.md`)
                        if (response.ok) {
                            const markdownContent = await response.text()
                            const { data } = matter(markdownContent)
                            
                            foundNotes.push({
                                slug,
                                ...data,
                                // Provide defaults if missing
                                title: data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                                date: data.date || new Date().toISOString().split('T')[0],
                                excerpt: data.excerpt || 'No excerpt available.',
                                tags: data.tags || [],
                                readTime: data.readTime || '5 min read'
                            })
                            console.log(`Found note: ${slug}`)
                        }
                    } catch {
                        console.log(`Note not found: ${slug}`)
                    }
                }
                
                if (foundNotes.length > 0) {
                    foundNotes.sort((a, b) => new Date(b.date) - new Date(a.date))
                    setNotes(foundNotes)
                    console.log(`Fallback discovery found ${foundNotes.length} notes`)
                } else {
                    setNotes([])
                }
                
            } catch (fallbackError) {
                console.error('Fallback loading failed:', fallbackError)
                setNotes([])
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
