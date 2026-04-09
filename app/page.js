import { getCategoriesWithCounts, getFeaturedListings, getAllListings } from '@/data/directory'
export default function HomePage() {
  const cats = getCategoriesWithCounts()
  const featured = getFeaturedListings()
  const all = getAllListings()
  return (
    <>
      <section className="hero-gradient text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-300 font-semibold text-sm tracking-widest uppercase mb-4">Global Site Directory</p>
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">Get Your Business<br/>Listed for Free</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">Every listing includes a free dofollow backlink to your website. Join thousands of businesses already listed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/submit/" className="bg-amber-500 hover:bg-amber-400 text-brand-950 font-semibold px-8 py-3.5 rounded-lg text-base">Add Your Business Free</a>
            <a href="/categories/" className="border border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3.5 rounded-lg text-base">Browse Categories</a>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div><p className="text-2xl md:text-3xl font-display text-brand-900">{all.length}+</p><p className="text-sm text-gray-500 mt-1">Listings</p></div>
            <div><p className="text-2xl md:text-3xl font-display text-brand-900">{cats.length}</p><p className="text-sm text-gray-500 mt-1">Categories</p></div>
            <div><p className="text-2xl md:text-3xl font-display text-brand-900">100%</p><p className="text-sm text-gray-500 mt-1">Free</p></div>
          </div>
        </div>
      </section>
      {featured.length > 0 && (
        <section className="py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-2xl md:text-3xl font-display text-brand-950 mb-8">Featured Listings</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{featured.map(l=>(<a key={l.id} href={'/listing/'+l.slug+'/'} className="card-hover block bg-white rounded-xl border border-gray-200 p-6"><div className="flex items-start justify-between mb-3"><h3 className="font-display text-lg text-brand-900">{l.name}</h3><span className="listing-badge">Featured</span></div><p className="text-sm text-gray-600 mb-4 line-clamp-2">{l.description}</p><div className="text-xs text-gray-400">{l.city}, {l.state}</div></a>))}</div></div></section>
      )}
      <section className="py-16 bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-2xl md:text-3xl font-display text-brand-950 mb-8">Browse by Category</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{cats.map(cat=>(<a key={cat.slug} href={'/categories/'+cat.slug+'/'} className="category-card flex items-start gap-3 bg-white"><span className="text-2xl" dangerouslySetInnerHTML={{__html:cat.icon}}/><div><h3 className="font-semibold text-brand-900 text-sm">{cat.name}</h3><p className="text-xs text-gray-500 mt-0.5">{cat.count} listing{cat.count!==1?'s':''}</p></div></a>))}</div></div></section>
      <section className="py-16 text-center"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-2xl md:text-3xl font-display text-brand-950 mb-12">Why List on GS Directory?</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div><h3 className="font-display text-lg text-brand-900 mb-2">Free Dofollow Backlink</h3><p className="text-sm text-gray-600">Every listing includes a dofollow link to your website. Build domain authority for free.</p></div><div><h3 className="font-display text-lg text-brand-900 mb-2">Get Discovered</h3><p className="text-sm text-gray-600">Your listing is indexed by Google. Customers searching for your services find you here.</p></div><div><h3 className="font-display text-lg text-brand-900 mb-2">Verified & Trusted</h3><p className="text-sm text-gray-600">Claim your listing for a verified badge. Build trust with potential customers.</p></div></div><div className="mt-12"><a href="/submit/" className="bg-brand-900 hover:bg-brand-800 text-white font-semibold px-8 py-3.5 rounded-lg">Add Your Business Now</a></div></div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'GS Directory',url:'https://gsdirectory.org',description:'Free business directory with dofollow backlinks.'})}} />
    </>
  )
}
