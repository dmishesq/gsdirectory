import './globals.css'
export const metadata = { title: { default: 'Global Site Directory | Free Business Listings with Dofollow Backlinks', template: '%s | Global Site Directory' }, description: 'Free business directory with dofollow backlinks. List your business for free.', alternates: { canonical: 'https://gsdirectory.org' } }
export default function RootLayout({ children }) { return (<html lang="en"><body className="bg-white text-gray-900 min-h-screen flex flex-col"><Header /><main className="flex-1">{children}</main><Footer /></body></html>) }
