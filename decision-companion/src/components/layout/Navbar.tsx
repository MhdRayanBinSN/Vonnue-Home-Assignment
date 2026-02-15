import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span>⚖️</span>
                    <span>Decision<span className="text-blue-400">Companion</span></span>
                </Link>
                <div className="flex gap-4 items-center">
                    <Link href="/" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Home
                    </Link>
                    <Link href="/decision/new" className="hidden sm:block bg-white/10 text-white hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20">
                        + New Decision
                    </Link>
                </div>
            </div>
        </nav>
    );
}
