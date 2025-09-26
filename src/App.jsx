import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopNav from './TopNav.jsx'
import NotesList from './NotesList.jsx'
import NoteView from './NoteView.jsx'
import About from './About.jsx'

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white">
                <TopNav />
                <main className="max-w-4xl mx-auto px-6 py-8">
                    <Routes>
                        <Route path="/" element={<NotesList />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/notes/:slug" element={<NoteView />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
