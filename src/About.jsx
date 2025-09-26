import { Link } from 'react-router-dom'

function About() {
    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-light text-gray-900 mb-6">About</h1>
            </header>

            <div className="prose prose-gray max-w-none">
                <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Welcome to my digital notebook—a collection of thoughts, observations, 
                        and learnings from my journey through technology, productivity, and life.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        This blog serves as both a personal knowledge repository and a space 
                        to share insights that might be useful to others. I believe in learning 
                        in public and the power of written reflection to clarify thinking.
                    </p>

                    <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">What You'll Find Here</h2>
                    
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>Technical notes</strong> - Code snippets, development patterns, and tools</li>
                        <li><strong>Productivity insights</strong> - Systems and workflows that work</li>
                        <li><strong>Book notes</strong> - Key takeaways from books that shaped my thinking</li>
                        <li><strong>Random thoughts</strong> - Observations on technology, design, and digital life</li>
                    </ul>

                    <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">Philosophy</h2>
                    
                    <p className="text-gray-700 leading-relaxed">
                        I'm drawn to simplicity, intentionality, and systems that amplify human 
                        capability rather than distract from it. These notes reflect my ongoing 
                        exploration of how to work and live more thoughtfully in our digital age.
                    </p>

                    <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">Connect</h2>
                    
                    <p className="text-gray-700 leading-relaxed">
                        Feel free to reach out if something here resonates with you or if you'd 
                        like to continue a conversation started in one of these notes.
                    </p>

                    <div className="mt-4">
                        <a 
                            href="https://www.linkedin.com/in/jackvhall/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                            LinkedIn Profile
                        </a>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <Link 
                            to="/" 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            ← Back to notes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
