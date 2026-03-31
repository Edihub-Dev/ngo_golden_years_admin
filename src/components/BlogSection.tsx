'use client';

import { useEffect, useState } from 'react';
import { blogApi } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BlogPost {
  _id: string;
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

export default function BlogSection() {
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await blogApi.getAll({ limit: 3 });
        if (response.success && response.data) {
          setLatestBlogs(response.data as BlogPost[]);
        }
      } catch (error) {
        console.error('Failed to fetch latest blogs:', error);
      }
    };

    fetchLatest();
  }, []);

  const displayBlogs = latestBlogs.length > 0 ? latestBlogs : [
    {
      _id: 'default-1',
      id: 'caring-for-aging-parents',
      title: 'Caring for Aging Parents: A Complete Guide',
      category: 'Caregiving',
      date: new Date().toISOString(),
      image: '/assets/blog_caregiving.png',
    },
    {
      _id: 'default-2',
      id: 'importance-of-emotional-support',
      title: 'Importance of Emotional Support for Seniors',
      category: 'Health',
      date: new Date().toISOString(),
      image: '/assets/blog_emotional.png',
    },
    {
      _id: 'default-3',
      id: 'healthy-living-tips',
      title: 'Healthy Living Tips for Elderly',
      category: 'Wellness',
      date: new Date().toISOString(),
      image: '/assets/blog_health.png',
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight">
              Latest Stories<br />& Insights
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-black font-bold hover:text-[#00b749] transition-colors mb-2"
          >
            Read More Blogs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogs.map((post) => (
            <Link key={post._id} href={`/blog/${post.id || post._id}`} className="group flex flex-col gap-4">
              <div className="w-full aspect-video bg-gray-100 rounded-[2.5rem] overflow-hidden relative shadow-sm border border-black/5">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url(${post.image})` }} 
                />
                <div className="absolute top-6 left-6 bg-[#00b749] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm transition-transform group-hover:-translate-y-1">
                  {post.category}
                </div>
              </div>
              <div className="flex flex-col flex-1 mt-4 px-2">
                 <span className="text-black/40 text-sm font-bold uppercase tracking-widest mb-3">
                   {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                 </span>
                 <h2 className="text-2xl font-bold tracking-tight group-hover:text-[#00b749] transition-colors line-clamp-2 pr-4 leading-tight mb-4 text-black">
                   {post.title}
                 </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
