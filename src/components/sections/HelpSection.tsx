'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const items = [
  {
    title: 'Act During Crisis',
    desc: 'Join urgent missions with rapid aid, relief, and community recovery.',
    image: '/assets/help_1.avif',
  },
  {
    title: 'Strengthen Social Good',
    desc: "Sponsorships grow awareness and strengthen your brand’s purpose.",
    image: '/assets/help_2.avif',
  },
  {
    title: 'Power Meaningful Change',
    desc: 'Financial gifts help drive lasting progress in key cause areas.',
    image: '/assets/help_3.avif',
  },
  {
    title: 'Fuel Greater Impact',
    desc: 'Your donation scales our work and reaches more communities in need.',
    image: '/assets/help_4.avif',
  },
  {
    title: 'Share Valuable Resources',
    desc: 'In-kind support accelerates logistics, technology, and field operations.',
    image: '/assets/help_%.avif',
  },
];

export default function HelpSection() {
  return (
    <section className="bg-black text-white fr-section">
      <div className="fr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-sm font-medium text-white/70 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span>How you can help</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">United, We Transform</h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="text-white/70">
              Feeding families, educating children, impacting lives compassion and support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="relative overflow-hidden rounded-3xl border-[4px] border-zinc-100/10 bg-zinc-950"
            >
              <div className="absolute inset-0">
                <Image src={it.image} alt={it.title} fill className="object-cover opacity-45" />
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/55 to-black/90" />
              </div>
              <div className="relative p-8 min-h-[260px] flex flex-col justify-end">
                <div className="text-xl font-semibold">{it.title}</div>
                <div className="mt-2 text-sm text-white/75">{it.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
