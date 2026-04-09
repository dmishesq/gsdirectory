import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: { default: 'Global Site Directory | Free Business Listings with Dofollow Backlinks', template: '%s | Global Site Directory' },
  description: 'Free business directory with dofollow backlinks. List your business for free.',
  alternates: { canonical: 'https://gsdirectory.org' }
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-brand-900 flex items-center gap-2">
          <span className="bg-brand-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">G</span>
          Global Site Directory
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/categories/" className="text-gray-600 hover:text-brand-900">Categories</Link>
          <Link href="/about/" className="text-gray-600 hover:text-brand-900">About</Link>
          <Link href="/faq/" className="text-gray-600 hover:text-brand-900">FAQ</Link>
          <Link href="/submit/" className="bg-brand-900 hover:bg-brand-800 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Listing</Link>
        </nav>
        <Link href="/submit/" className="md:hidden bg-brand-900 hover:bg-brand-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium">+ Add</Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white text-gray-900 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">G</span>
              <span className="text-white font-display">Global Site Directory</span>
            </div>
            <p className="text-sm">A free global business directory. Every listing includes a dofollow link to your website.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Directory</h4>
            <div className="space-y-2 text-sm">
              <div><Link href="/categories/" className="hover:text-white">All Categories</Link></div>
              <div><Link href="/categories/tax-attorneys/" className="hover:text-white">Tax Attorneys</Link></div>
              <div><Link href="/categories/cpas-accountants/" className="hover:text-white">CPAs</Link></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Popular</h4>
            <div className="space-y-2 text-sm">
              <div><Link href="/categories/business-attorneys/" className="hover:text-white">Business Attorneys</Link></div>
              <div><Link href="/categories/real-estate-agents/" className="hover:text-white">Real Estate</Link></div>
              <div><Link href="/categories/marketing-agencies/" className="hover:text-white">Marketing</Link></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
            <div className="space-y-2 text-sm">
              <div><Link href="/about/" className="hover:text-white">About</Link></div>
              <div><Link href="/faq/" className="hover:text-white">FAQ</Link></div>
              <div><Link href="/submit/" className="hover:text-white">Submit Listing</Link></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">&copy; {new Date().getFullYear()} Global Site Directory. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
