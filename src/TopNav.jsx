import { Link } from 'react-router-dom'

function TopNav() {
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-xl font-medium text-gray-900 hover:text-gray-600 transition-colors">
                        Hall's Notes
                    </Link>
                    <div className="flex space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Notes</Link>
                        <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default TopNav;
