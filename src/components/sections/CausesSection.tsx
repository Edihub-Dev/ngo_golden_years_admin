'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const causes = [
  {
    title: 'Fundraising for Education Equality and Access',
    raised: '$40,000',
    goal: '$65,200',
    image: '/assets/causes_image.avif',
    slug: 'fundraising-for-education-equality-and-access',
  },
  {
    title: 'Building Stronger Futures Through Healthcare Access',
    raised: '$52,000',
    goal: '$75,200',
    image: '/assets/help_4.avif',
    slug: 'building-stronger-futures-through-healthcare-access',
  },
  {
    title: 'Empowering Women and Girls Through Education',
    raised: '$80,000',
    goal: '$85,000',
    image: '/assets/help_%.avif',
    slug: 'empowering-women-and-girls-through-education',
  },
];

export default function CausesSection() {
  return (
    <section className="bg-black text-white fr-section">
      <div className="fr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-sm font-medium text-white/70 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span>Causes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Causes That Inspire</h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="text-white/70">
              From education to relief efforts, every cause reflects our shared mission to empower.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {causes.map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                <Image src={c.image} alt={c.title} fill className="object-cover" />
              </div>

              <div className="pt-4">
                <div className="text-base font-semibold leading-snug min-h-[48px]">
                  {c.title}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/70">
                  <div>
                    <div className="text-xs">Raised Amount</div>
                    <div className="text-white font-semibold">{c.raised}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">Goal Amount</div>
                    <div className="text-white font-semibold">{c.goal}</div>
                  </div>
                </div>

                <Link
                  href={`/causes/${c.slug}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/70">
            Explore all causes and join us in making a meaningful impact.
          </p>
          <Link
            href="/causes"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            View All Causes
          </Link>
        </div>
      </div>
    </section>
  );
}
