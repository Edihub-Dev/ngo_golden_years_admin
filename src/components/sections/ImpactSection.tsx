'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const cards = [
  {
    title: '1,000+',
    subtitle: 'Meals Distributed',
    desc: 'For families and individuals.',
    image: '/assets/help_1.avif',
  },
  {
    title: '300+',
    subtitle: 'Homes rebuilt',
    desc: 'Families restore safety & dignity.',
    image: '/assets/help_2.avif',
  },
  {
    title: '256+',
    subtitle: 'Projects delivered',
    desc: 'Supporting in healthcare & crisis.',
    image: '/assets/help_3.avif',
  },
];

export default function ImpactSection() {
  return (
    <section className="bg-zinc-100 text-black fr-section">
      <div className="fr-container">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span>Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Together for change</h2>
          </div>
          <p className="text-zinc-600 text-base max-w-md lg:pt-12">
            Feeding families, educating children &amp; rebuilding lives what our impact shows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <motion.div
              key={c.subtitle}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative overflow-hidden rounded-3xl border border-zinc-300 bg-black text-white"
            >
              <div className="absolute inset-0">
                <Image src={c.image} alt={c.subtitle} fill className="object-cover opacity-55" />
                <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/55 to-black/80" />
              </div>
              <div className="relative p-8 min-h-[220px] flex flex-col justify-end">
                <div className="text-4xl font-semibold mb-3">{c.title}</div>
                <div className="font-semibold">{c.subtitle}</div>
                <div className="text-sm text-white/75 mt-1">{c.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
