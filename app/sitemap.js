import { categories, listings } from '@/data/directory'
export default function sitemap() {
  const base = 'https://gsdirectory.org'
  const now = new Date().toISOString()
  const pages = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: base+'/categories/', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: base+'/submit/', lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: base+'/about/', lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: base+'/blog/', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]
  categories.forEach(c => { pages.push({ url: base+'/categories/'+c.slug+'/', lastModified: now, changeFrequency: 'daily', priority: 0.8 }) })
  listings.forEach(l => { pages.push({ url: base+'/listing/'+l.slug+'/', lastModified: now, changeFrequency: 'weekly', priority: 0.7 }) })
  return pages
}
