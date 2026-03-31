'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const programs = [
  {
    tag: 'Emergency Health Relief',
    title: 'Healthcare Access',
    desc: 'Ensure fast delivery of medical and health units during emergency to provide care and support recovery.',
    raised: '$16,800',
    goal: '$40,000',
    image: '/assets/program_2.avif',
    slug: 'healthcare-access',
  },
  {
    tag: 'Food Security Initiative',
    title: 'Nutritional Support',
    desc: 'Ensure timely access to nutritious food, clean water, and supplements for communities in times of crisis.',
    raised: '$60,800',
    goal: '$100,800',
    image: '/assets/program_3.avif',
    slug: 'nutritional-support',
  },
  {
    tag: 'Water Purification Project',
    title: 'Access to Clean Water',
    desc: 'Provide clean water access through filtration systems, safe water distribution and hygiene education.',
    raised: '$20,800',
    goal: '$60,000',
    image: '/assets/Program_1.avif',
    slug: 'access-to-clean-water',
  },
];

export default function ProgramsSection() {
  return (
    <section className="bg-zinc-100 text-black fr-section">
      <div className="fr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span>Programs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Spark Positive Change</h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="text-zinc-600">
              Our efforts provide care, skills, and support igniting hope and lasting impact in the lives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border border-zinc-300 bg-white p-2">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                <Image src="/assets/Program_1.avif" alt="Programs" fill className="object-cover" />
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-6">
            {programs.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-3xl border border-zinc-200 bg-white p-7"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-8">
                    <div className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                      {p.tag}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-zinc-600 leading-relaxed">{p.desc}</p>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-zinc-500 text-xs">Raised Amount</div>
                        <div className="font-semibold">{p.raised}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-zinc-500 text-xs">Goal Amount</div>
                        <div className="font-semibold">{p.goal}</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/programs/${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-50 transition-colors"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 aspect-[4/3]">
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
