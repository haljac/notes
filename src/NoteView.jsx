import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import matter from 'gray-matter'
import { Buffer } from 'buffer'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Make Buffer available globally for gray-matter
window.Buffer = Buffer

function NoteView() {
    const { slug } = useParams()
    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadNote = async () => {
            try {
                setLoading(true)
                // In a real app, you'd fetch from an API or build system
                // For now, we'll simulate loading the markdown files
                const response = await fetch(`/notes/${slug}.md`)
                if (!response.ok) {
                    throw new Error('Note not found')
                }
                const markdownContent = await response.text()
                const { data, content } = matter(markdownContent)
                
                setNote({
                    frontmatter: data,
                    content: content,
                    slug: slug
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            loadNote()
        }
    }, [slug])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-light text-gray-900 mb-4">Note not found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link 
                        to="/" 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        ← Back to notes
                    </Link>
                </div>
            </div>
        )
    }

    if (!note) {
        return null
    }

    const { frontmatter, content } = note
    const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <article className="max-w-3xl mx-auto">
            {/* Back navigation */}
            <div className="mb-8">
                <Link 
                    to="/" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                    ← Back to notes
                </Link>
            </div>

            {/* Article header with metadata */}
            <header className="mb-12 pb-8 border-b border-gray-200">
                <h1 className="text-3xl font-light text-gray-900 mb-4">
                    {frontmatter.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <time dateTime={frontmatter.date}>
                        {formattedDate}
                    </time>
                    {frontmatter.author && (
                        <>
                            <span>•</span>
                            <span>{frontmatter.author}</span>
                        </>
                    )}
                    {frontmatter.readTime && (
                        <>
                            <span>•</span>
                            <span>{frontmatter.readTime}</span>
                        </>
                    )}
                </div>

                {frontmatter.excerpt && (
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        {frontmatter.excerpt}
                    </p>
                )}

                {frontmatter.tags && frontmatter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {frontmatter.tags.map((tag, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* Article content */}
            <div className="prose prose-gray max-w-none">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({children}) => <h1 className="text-2xl font-light text-gray-900 mb-6 mt-8">{children}</h1>,
                        h2: ({children}) => <h2 className="text-xl font-medium text-gray-900 mb-4 mt-8">{children}</h2>,
                        h3: ({children}) => <h3 className="text-lg font-medium text-gray-900 mb-3 mt-6">{children}</h3>,
                        p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="leading-relaxed">{children}</li>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">{children}</blockquote>,
                        code: ({node, inline, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-lg mb-6"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            )
                        },
                        hr: () => <hr className="border-gray-300 my-8" />,
                        strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    )
}

export default NoteView

