'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const posts = [
  {
    title: 'Bringing hope through food, shelter, and support',
    date: 'Apr 9, 2025',
    href: '/blog/bringing-hope-through-food-shelter-and-support',
    image: '/assets/Blog-1.jpg',
  },
  {
    title: 'Building Food Security Through Community Farming',
    date: 'Sep 19, 2025',
    href: '/blog/building-bonds-through-community-agriculture',
    image: '/assets/Blog-1.jpg',
  },
  {
    title: 'Restoring Hope in Times of Urgency in Human',
    date: 'Apr 7, 2025',
    href: '/blog/restoring-hope-in-times-of-urgency-in-human',
    image: '/assets/Blog-1.jpg',
  },
];

export default function BlogSection() {
  return (
    <section className="bg-zinc-100 text-black fr-section">
      <div className="fr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span>Blog</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">News. Stories. Voices</h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="text-zinc-600">
              Explore updates, field notes, and impact stories that amplify real-world change daily.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, idx) => (
            <motion.article
              key={p.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-3xl border border-zinc-200 bg-white overflow-hidden"
            >
              <Link href={p.href} className="block">
                <div className="relative aspect-[16/10]">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-zinc-500">{p.date}</div>
                  <div className="mt-2 font-semibold leading-snug">{p.title}</div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-zinc-600">Discover stories and become part of the impact they inspire</p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
